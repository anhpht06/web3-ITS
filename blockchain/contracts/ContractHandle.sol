// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TokenERC20.sol";
import "./TokenERC721.sol";

contract ContractHandle is ReentrancyGuard {
    TokenERC20 public tokenERC20; //token A
    TokenERC721 public tokenERC721; //NFT-B

    event getData(uint256 data, address _from, address _to);

    uint256 public constant MINIMUM_DEPOSIT_FOR_CERTIFICATE =
        1000000 * 10 ** 18;

    uint256 public baseAPR = 800; // lãi xuất 8%
    uint256 public bonusAPR = 200; // thưởng thêm 2%
    uint256 public lockTime = 30 seconds; // 30s

    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => StakingInfoNFTB) public stakingInfoNFTB;

    struct StakingInfo {
        uint256 totalAmountERC20;
        uint256 APR;
        uint256 startTimeDeposit;
        uint256 lastTimeDeposit;
        uint256 mintNFTbCount;
        uint256 totalRewardERC20;
        uint256 latRewardERC20;
    }
    struct StakingInfoNFTB {
        uint256 totalAmountERC721;
        uint256 startTimeDeposit;
        uint256[] tokenId;
    }
    constructor(TokenERC20 _tokenERC20, TokenERC721 _tokenERC721) {
        tokenERC20 = _tokenERC20;
        tokenERC721 = _tokenERC721;
    }

    //Đã test
    function faucetERC20(uint256 _amount) external {
        require(_amount > 0, "TokenA: faucet amount must be greater than zero");
        tokenERC20.faucet(msg.sender, _amount);
    }
    //Đã test
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
            useStakingInfo.APR = baseAPR;
        } else {
            useStakingInfo.totalRewardERC20 += calculateRewardERC20();
            useStakingInfo.startTimeDeposit = block.timestamp;

            // useStakingInfo.latRewardERC20 += calculateLastRewardERC20();
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
        uint256 balance = tokenERC20.balanceOf(msg.sender);
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        uint256 startTimedeposit = useStakingInfo.startTimeDeposit;

        if (startTimedeposit == 0) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - startTimedeposit;
        uint256 interest = ((balance * useStakingInfo.APR) / 10000) *
            (timeElapsed / 180 seconds); //lãi 8% trong 3 phút

        return interest;
    }
    function calculateLastRewardERC20() public view returns (uint256) {
        uint256 balance = tokenERC20.balanceOf(msg.sender);
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        uint256 lastTimedeposit = useStakingInfo.lastTimeDeposit;

        if (lastTimedeposit == 0) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - lastTimedeposit;
        uint256 interest = ((balance * useStakingInfo.APR) / 10000) *
            (timeElapsed / 180 seconds); //lãi 8% trong 3 phút

        return interest;
    }

    function withRewardERC20() external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];

        require(
            (useStakingInfo.lastTimeDeposit + lockTime) >= block.timestamp,
            "TokenA: You can't withdraw now"
        );
        require(useStakingInfo.totalAmountERC20 > 0, "TokenA: No deposit");

        uint256 totalwithRewardERC20 = useStakingInfo.totalAmountERC20 +
            useStakingInfo.totalRewardERC20;
        tokenERC20.transfer(msg.sender, totalwithRewardERC20);

        useStakingInfo.totalAmountERC20 = 0;
        useStakingInfo.totalRewardERC20 = 0;
        useStakingInfo.startTimeDeposit = 0;

        emit getData(totalwithRewardERC20, address(this), msg.sender);
    }
    function claimRewardERC20() external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        require(useStakingInfo.totalRewardERC20 > 0, "TokenA: No reward");

        tokenERC20.transfer(msg.sender, useStakingInfo.totalRewardERC20);
        useStakingInfo.totalRewardERC20 = 0;
        useStakingInfo.startTimeDeposit = 0;
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

        require(useStakingInfoNFTB.totalAmountERC721 > 0, "NFT-B: No deposit");

        for (uint256 i = 0; i < tokenId.length; i++) {
            tokenERC721.safeTransferFrom(msg.sender, address(this), tokenId[i]);
            useStakingInfoNFTB.tokenId.push(tokenId[i]);
        }

        useStakingInfo.totalRewardERC20 = calculateRewardERC20();
        useStakingInfo.startTimeDeposit = block.timestamp;
        useStakingInfo.APR += bonusAPR * tokenId.length;

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
        useStakingInfo.APR -= bonusAPR * tokenId.length;
        useStakingInfo.startTimeDeposit = 0;
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
