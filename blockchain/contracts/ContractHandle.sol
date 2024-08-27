// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenERC20.sol";
import "./TokenERC721.sol";

contract ContractHandle {
    TokenERC20 private tokenERC20;
    TokenERC721 private tokenERC721;

    uint256 public constant MINIMUM_DEPOSIT_FOR_CERTIFICATE =
        1000000 * 10 ** 18;

    uint256 public APR = 8; //lãi 8%
    uint256 public bonusAPR = 2; // thưởng thêm 2%

    uint256 public lockTime = 30 seconds; // 30s

    constructor(TokenERC20 _tokenERC20, TokenERC721 _tokenERC721) {
        tokenERC20 = _tokenERC20;
        tokenERC721 = _tokenERC721;
    }

    struct stakingInfo {
        uint256 totalAmountERC20;
        uint256 mintNFTbCount;
        uint256 rewardERC20;    
        uint256 timestart;
    }

    mapping(address => stakingInfo) public stakingInfos; 
    mapping(address => uint256) public depositTimes; // Lưu thời gian tiền gửi của người dùng


    function faucetERC20(uint256 _amount) external {
        require(
            _amount > 0,
            "ERC20Token: faucet amount must be greater than zero"
        );
        tokenERC20.faucet(msg.sender, _amount);
    }
    function depositERC20(uint256 _amount) external {
        stakingInfo storage useStakingInfo = stakingInfos[msg.sender];

        require(
            _amount > 0,
            "ERC20Token: deposit amount must be greater than zero"
        );
        require(
            tokenERC20.balanceOf(msg.sender) >= _amount,
            "ERC20Token: insufficient balance in contract"
        );
        tokenERC20.transferFrom(msg.sender, address(this), _amount);
        depositTimes[msg.sender] = block.timestamp;

        useStakingInfo.totalAmountERC20 += _amount;
        uint256 depositCount = (useStakingInfo.totalAmountERC20 /
            MINIMUM_DEPOSIT_FOR_CERTIFICATE) - useStakingInfo.mintNFTbCount;

        for (uint256 i = 0; i < depositCount; i++) {
            tokenERC721.mint(msg.sender);
            useStakingInfo.mintNFTbCount += 1;
        }
    }

    function calculateRewardERC20() external {
        stakingInfo storage useStakingInfo = stakingInfos[msg.sender];
        uint256 totalAmountERC20 = useStakingInfo.totalAmountERC20;
        uint256 mintNFTbCount = useStakingInfo.mintNFTbCount;
        uint256 depositTime = (block.timestamp - depositTimes[msg.sender]) /
            lockTime;
        uint256 rewardERC20 = (totalAmountERC20 * APR * depositTime) /
            10 ** 18;
        useStakingInfo.rewardERC20 = rewardERC20;
    }

    function withdrawERC20() external {
        stakingInfo storage useStakingInfo = stakingInfos[msg.sender];
        require(
            useStakingInfo.totalAmountERC20 > 0,
            "ERC20Token: insufficient balance in contract"
        );
        tokenERC20.transfer(msg.sender, useStakingInfo.totalAmountERC20);
        useStakingInfo.totalAmountERC20 = 0;
    }




}
