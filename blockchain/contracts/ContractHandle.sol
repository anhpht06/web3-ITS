// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./TokenERC20.sol";
import "./TokenERC721.sol";

contract ContractHandle is TokenERC20, ReentrancyGuard, Ownable {
    TokenERC20 public tokenERC20; //token A
    TokenERC721 public tokenERC721; //NFT-B

    event getData(uint256 data, address _from, address _to);

    uint256 public constant MINIMUM_DEPOSIT_FOR_CERTIFICATE =
        1000000 * 10 ** 18;

    uint256 public baseAPR = 800; // lãi xuất 8%
    uint256 public bonusAPR = 200; // thưởng thêm 2%
    uint256 public lockTime = 30 seconds; // không cho withdraw sau 30s khi deposit

    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => StakingInfoNFTB) public stakingInfoNFTB;

    struct StakingInfo {
        uint256 totalAmountERC20;
        uint256 APR;
        uint256 bonusAPR;
        uint256 startTimeDeposit;
        uint256 totalRewardERC20;
        uint256 mintNFTbCount;
    }
    struct StakingInfoNFTB {
        uint256 totalAmountERC721;
        uint256 startTimeDeposit;
        uint256 bonusAPR;
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
        tokenERC20.transferFrom(msg.sender, address(this), _amount);
        useStakingInfo.totalAmountERC20 += _amount;

        if (useStakingInfo.startTimeDeposit == 0) {
            useStakingInfo.startTimeDeposit = block.timestamp;
        } else {
            useStakingInfo.totalRewardERC20 = calculateRewardERC20();
            useStakingInfo.startTimeDeposit = block.timestamp;
        }

        //mint NFTB nếu deposit 1.000.000 token A
        uint256 depositCount = (useStakingInfo.totalAmountERC20 /
            MINIMUM_DEPOSIT_FOR_CERTIFICATE) - useStakingInfo.mintNFTbCount;

        for (uint256 i = 0; i < depositCount; i++) {
            tokenERC721.mint(msg.sender);
            useStakingInfo.mintNFTbCount += 1;
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
            365 days * 10000
        );
        // uint256 reward = ((balance * (baseAPR + useStakingInfo.bonusAPR)) /
        //     10000) * (timeElapsed / 365 days); //lãi 8% trong 1 năm

        return reward;
    }
    function withdrawRewardERC20() external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];

        require(
            (useStakingInfo.startTimeDeposit + lockTime) >= block.timestamp,
            "TokenA: You can't withdraw now"
        );
        uint256 reward = useStakingInfo.totalAmountERC20 +
            calculateRewardERC20();
        require(reward > 0, "TokenA: No have reward to Withdraw reward");

        tokenERC20.transfer(msg.sender, useStakingInfo.totalAmountERC20);
        tokenERC20.transferRewardERC20(msg.sender, reward);

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
    }
    //NFTB
    function depositNFTB(uint256[] calldata tokenId) external nonReentrant {
        require(tokenId.length > 0, "NFT-B: Invalid tokenId");
        for (uint256 i = 0; i < tokenId.length; i++) {
            require(
                tokenERC721.ownerOf(tokenId[i]) == msg.sender,
                "NFT-B: Invalid tokenId"
            );
        }

        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        StakingInfoNFTB storage useStakingInfoNFTB = stakingInfoNFTB[
            msg.sender
        ];

        require(
            tokenERC721.balanceOf(msg.sender) > 0,
            "NFT-B: No have NFT B to deposit"
        );

        for (uint256 i = 0; i < tokenId.length; i++) {
            tokenERC721.safeTransferFrom(msg.sender, address(this), tokenId[i]);
            useStakingInfoNFTB.tokenId.push(tokenId[i]);
        }

        useStakingInfo.totalRewardERC20 = calculateRewardERC20();
        useStakingInfo.startTimeDeposit = block.timestamp;
        uint256 _bonusAPR = bonusAPR * tokenId.length;
        // useStakingInfo.APR += _bonusAPR;
        useStakingInfoNFTB.bonusAPR += _bonusAPR;

        useStakingInfoNFTB.totalAmountERC721 += tokenId.length;
        useStakingInfoNFTB.startTimeDeposit = block.timestamp;
    }

    function withRewardNFTB(uint256[] calldata tokenId) external {
        require(tokenId.length > 0, "NFT-B: Invalid tokenId");

        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        StakingInfoNFTB storage useStakingInfoNFTB = stakingInfoNFTB[
            msg.sender
        ];

        require(useStakingInfoNFTB.totalAmountERC721 > 0, "NFT-B: No deposit");
        require(
            (useStakingInfoNFTB.startTimeDeposit + lockTime) <= block.timestamp,
            "NFT-B: You can't withdraw now"
        );

        for (uint256 i = 0; i < tokenId.length; i++) {
            uint256 idToWithdraw = tokenId[i];
            bool found = false;

            for (uint256 j = 0; j < useStakingInfoNFTB.tokenId.length; j++) {
                if (useStakingInfoNFTB.tokenId[j] == idToWithdraw) {
                    tokenERC721.safeTransferFrom(
                        address(this),
                        msg.sender,
                        idToWithdraw
                    );

                    useStakingInfoNFTB.tokenId[j] = useStakingInfoNFTB.tokenId[
                        useStakingInfoNFTB.tokenId.length - 1
                    ];
                    useStakingInfoNFTB.tokenId.pop();
                    found = true;
                    break;
                }
            }

            if (!found) {}
        }

        // Cập nhật tổng số lượng NFT
        useStakingInfoNFTB.totalAmountERC721 -= tokenId.length;

        useStakingInfo.totalRewardERC20 = calculateRewardERC20();
        useStakingInfo.startTimeDeposit = 0;
        uint256 _bonusAPR = bonusAPR * tokenId.length;
        // useStakingInfo.APR -= _bonusAPR;
        useStakingInfoNFTB.bonusAPR -= _bonusAPR;
    }

    function getCurrentAPR() public view returns (uint256) {
        StakingInfoNFTB storage useStrakingInfoNFTB = stakingInfoNFTB[
            msg.sender
        ];
        if (useStrakingInfoNFTB.bonusAPR == 0) {
            return baseAPR;
        } else {
            return baseAPR + useStrakingInfoNFTB.bonusAPR;
        }
    }
    function updateAPR(uint256 newBaseAPR) external onlyOwner {
        baseAPR = newBaseAPR;
    }
    function getCurrentRewardERC20() public view returns (uint256) {
        return
            stakingInfo[msg.sender].totalRewardERC20 + calculateRewardERC20();
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
}
