// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./TokenERC20.sol";
import "./TokenERC721.sol";

contract ContractHandle is ReentrancyGuard, Ownable, IERC721Receiver {
    TokenERC20 public tokenERC20;
    TokenERC721 public tokenERC721;

    event getData(uint256 data, address _from, address _to);

    uint256 public constant MINIMUM_DEPOSIT_FOR_CERTIFICATE =
        1000000 * 10 ** 18;

    uint256 public baseAPR = 800; // lãi xuất 8%
    uint256 public bonusAPR = 200; // thưởng thêm 2%
    uint256 public lockTime = 30 seconds; // không cho withdraw sau 30s khi deposit

    //event
    event TokenADeposit(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );

    event WithdrawTokenA(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );
    event ClaimTokenA(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );

    event DepositNFTB(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );
    event WithdrawNFTB(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );
    event MintedNFTB(
        address indexed _from,
        address indexed _to,
        uint256 _amount
    );
    event UpdateAPR(address indexed admin, uint256 _newBaseAPR);

    event NFTReceived(
        address indexed operator,
        address indexed from,
        uint indexed tokenId,
        bytes data
    );

    function onERC721Received(
        address operator,
        address from,
        uint tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        emit NFTReceived(operator, from, tokenId, data);

        return this.onERC721Received.selector;
    }

    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => uint256) public mintNFTbCount;

    struct StakingInfo {
        uint256 totalAmountERC20;
        uint256 APR;
        uint256 bonusAPR;
        uint256 startTimeDeposit;
        uint256 totalRewardERC20;
        uint256 mintNFTbCount;
        //NFT
        uint256 totalAmountERC721;
        uint256 startTimeDepositNFTB;
        uint256[] tokenId;
    }

    constructor(
        TokenERC20 _tokenERC20,
        TokenERC721 _tokenERC721
    ) Ownable(msg.sender) {
        tokenERC20 = _tokenERC20;
        tokenERC721 = _tokenERC721;
    }

    function faucetERC20(uint256 _amount) external {
        require(_amount > 0, "TokenA: faucet amount must be greater than zero");
        tokenERC20.faucet(msg.sender, _amount);
    }
    function depositERC20(uint256 _amount) external nonReentrant {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        require(
            _amount > 0,
            "TokenA: deposit amount must be greater than zero"
        );
        require(
            tokenERC20.balanceOf(msg.sender) >= _amount,
            "TokenA: insufficient balance in contract"
        );

        if (useStakingInfo.startTimeDeposit != 0) {
            uint256 pendingReward = calculateRewardERC20();
            useStakingInfo.totalRewardERC20 += pendingReward;
        }

        useStakingInfo.startTimeDeposit = block.timestamp;
        tokenERC20.transferFrom(msg.sender, address(this), _amount);
        emit TokenADeposit(msg.sender, address(this), _amount);
        useStakingInfo.totalAmountERC20 += _amount;

        //mint NFTB nếu deposit 1.000.000 token A
        uint256 totalAmount = useStakingInfo.totalAmountERC20;
        uint256 minimumDeposit = MINIMUM_DEPOSIT_FOR_CERTIFICATE;

        uint256 depositCount = (totalAmount / minimumDeposit) >
            useStakingInfo.mintNFTbCount
            ? (totalAmount / minimumDeposit) - useStakingInfo.mintNFTbCount
            : 0;

        if (depositCount > 0) {
            for (uint256 i = 0; i < depositCount; i++) {
                uint256 tokenId = tokenERC721.safeMint(msg.sender);
                useStakingInfo.mintNFTbCount += 1;
                emit MintedNFTB(address(this), msg.sender, tokenId);
            }
        }
    }
    function calculateRewardERC20() public view returns (uint256) {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];

        uint256 balance = useStakingInfo.totalAmountERC20;
        if (balance == 0) {
            return 0;
        }

        uint256 startTimedeposit = useStakingInfo.startTimeDeposit;
        if (startTimedeposit == 0) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - startTimedeposit;
        uint256 reward = Math.mulDiv(
            balance * (baseAPR + useStakingInfo.bonusAPR),
            timeElapsed,
            365.25 days * 10000
        );

        return reward;
    }
    function withdrawRewardERC20() external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];

        require(
            block.timestamp >= (useStakingInfo.startTimeDeposit + lockTime),
            "TokenA: You can't withdraw now"
        );

        require(
            useStakingInfo.totalAmountERC20 > 0,
            "TokenA: No have reward to Withdraw reward"
        );
        uint256 reward = useStakingInfo.totalRewardERC20 +
            calculateRewardERC20();
        uint256 totalAmout = useStakingInfo.totalAmountERC20;

        tokenERC20.transferAmoutOfERC20(msg.sender, totalAmout);
        tokenERC20.transferRewardERC20(msg.sender, reward);

        emit WithdrawTokenA(address(this), msg.sender, totalAmout + reward);

        useStakingInfo.totalAmountERC20 = 0;
        useStakingInfo.totalRewardERC20 = 0;
        useStakingInfo.startTimeDeposit = 0;
    }
    function claimRewardERC20() external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];

        require(calculateRewardERC20() > 0, "Claim Reward: No have reward!");
        uint256 reward = useStakingInfo.totalRewardERC20 +
            calculateRewardERC20();
        tokenERC20.transferRewardERC20(msg.sender, reward);
        useStakingInfo.totalRewardERC20 = 0;
        useStakingInfo.startTimeDeposit = block.timestamp;

        emit ClaimTokenA(address(this), msg.sender, reward);
    }
    //NFTB
    function depositNFTB(uint256[] calldata tokenIds) external nonReentrant {
        require(tokenIds.length > 0, "NFT-B: No token IDs provided");

        StakingInfo storage userStakingInfo = stakingInfo[msg.sender];

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                tokenERC721.ownerOf(tokenIds[i]) == msg.sender,
                "NFT-B: Not owner of token ID"
            );
        }

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenERC721.transferAndUpdateTokens(
                msg.sender,
                address(this),
                tokenIds[i]
            );
            userStakingInfo.tokenId.push(tokenIds[i]);
            emit DepositNFTB(msg.sender, address(this), tokenIds[i]);
        }

        // Update staking info
        userStakingInfo.totalRewardERC20 += calculateRewardERC20();
        userStakingInfo.startTimeDeposit = block.timestamp;
        userStakingInfo.totalAmountERC721 += tokenIds.length;
        userStakingInfo.startTimeDepositNFTB = block.timestamp;

        uint256 _bonusAPR = bonusAPR * tokenIds.length;
        userStakingInfo.bonusAPR += _bonusAPR;
    }
    function withRewardNFTB(uint256[] calldata tokenId) external {
        require(tokenId.length > 0, "NFT-B: Invalid tokenId");

        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        require(useStakingInfo.totalAmountERC721 > 0, "NFT-B: No deposit");
        require(
            block.timestamp >= (useStakingInfo.startTimeDeposit + lockTime),
            "NFT-B: You can't withdraw now"
        );

        for (uint256 i = 0; i < tokenId.length; i++) {
            uint256 idToWithdraw = tokenId[i];
            bool found = false;

            for (uint256 j = 0; j < useStakingInfo.tokenId.length; j++) {
                if (useStakingInfo.tokenId[j] == idToWithdraw) {
                    tokenERC721.transferAndUpdateTokens(
                        address(this),
                        msg.sender,
                        idToWithdraw
                    );

                    useStakingInfo.tokenId[j] = useStakingInfo.tokenId[
                        useStakingInfo.tokenId.length - 1
                    ];
                    useStakingInfo.tokenId.pop();
                    found = true;
                    emit WithdrawNFTB(address(this), msg.sender, idToWithdraw);
                    break;
                }
            }

            if (!found) {}
        }

        useStakingInfo.totalAmountERC721 -= tokenId.length;
        useStakingInfo.totalRewardERC20 += calculateRewardERC20();
        useStakingInfo.startTimeDeposit = block.timestamp;
        useStakingInfo.startTimeDepositNFTB = block.timestamp;
        uint256 _bonusAPR = bonusAPR * tokenId.length;
        useStakingInfo.bonusAPR -= _bonusAPR;
    }
    function updateAPR(uint256 newBaseAPR) external onlyOwner {
        baseAPR = newBaseAPR;
        emit UpdateAPR(msg.sender, newBaseAPR);
    }
    function getCurrentRewardERC20() public view returns (uint256) {
        uint256 reward = stakingInfo[msg.sender].totalRewardERC20 +
            calculateRewardERC20();
        return reward;
    }
    //get balance of ERC20 and ERC721
    function balaceOfERC20(address _address) public view returns (uint256) {
        return tokenERC20.balanceOf(_address);
    }
    function balaceOfERC20TotalSupply() public view returns (uint256) {
        return tokenERC20.balanceOfTokenERC20();
    }
    function balaceOfERC721(address _address) public view returns (uint256) {
        return tokenERC721.balanceOf(_address);
    }
    function balaceOfERC721TotalSupply() public view returns (uint256) {
        return tokenERC721.balanceOfTokenERC721();
    }
    function getOwnedNFTs(
        address _address
    ) external view returns (uint256[] memory) {
        return tokenERC721.getOwnedTokens(_address);
    }
    //
    function getStakingInfo(
        address _address
    ) external view returns (StakingInfo memory) {
        return stakingInfo[_address];
    }
}
