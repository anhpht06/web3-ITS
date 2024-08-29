// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenERC20.sol";
import "./TokenERC721.sol";

contract ContractHandle {
    TokenERC20 private tokenERC20;
    TokenERC721 private tokenERC721;

    event getData(uint256 data,address _from,address _to);
    
    struct eventDepo{
        address from;
        
        uint256 amount;

    }
    uint256 public constant MINIMUM_DEPOSIT_FOR_CERTIFICATE =
        1000000 * 10 ** 18;

    uint256 public baseAPR = 800; // lãi xuất 8%
    uint256 public bonusAPR = 200; // thưởng thêm 2%
    uint256 public lockTime = 30 seconds; // 30s

    mapping(address => StakingInfo) public stakingInfo;

    struct StakingInfo {
        uint256 totalAmountERC20;
        uint256 APR;
        uint256 startTimeDeposit;
        uint256 lastTimeDeposit;
        uint256 mintNFTbCount;
        uint256 rewardERC20;
        uint256 latRewardERC20;
    }
    constructor(TokenERC20 _tokenERC20, TokenERC721 _tokenERC721) {
        tokenERC20 = _tokenERC20;
        tokenERC721 = _tokenERC721;
    }
    //Đã test
    function faucetERC20(uint256 _amount) external {
        require(
            _amount > 0,
            "ERC20Token: faucet amount must be greater than zero"
        );
        tokenERC20.faucet(msg.sender, _amount);
    }
    //Đã test
    function depositERC20(uint256 _amount) external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        require(
            _amount > 0,
            "ERC20Token: deposit amount must be greater than zero"
        );
        require(
            tokenERC20.balanceOf(msg.sender) >= _amount,
            "ERC20Token: insufficient balance in contract"
        );
        tokenERC20.transferFrom(msg.sender, address(this), _amount);
        useStakingInfo.totalAmountERC20 += _amount;

        if(useStakingInfo.startTimeDeposit == 0){
            useStakingInfo.startTimeDeposit = block.timestamp;
            useStakingInfo.APR = baseAPR;
        }else{
            useStakingInfo.latRewardERC20 = calculateRewardERC20();
        }
        useStakingInfo.lastTimeDeposit = block.timestamp;
        
        //mint NFTB nếu deposet 1.000.000 token A
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
        uint256 startTimeDeposet = useStakingInfo.startTimeDeposit;
        

        if (startTimeDeposet == 0) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - startTimeDeposet;
        uint256 interest = ((balance * useStakingInfo.APR) / 10000) *
            (timeElapsed / 180 seconds); //lãi 8% trong 3 phút
        
        
        return interest;
    }
    function CalculateNewRewardERC20() public view returns (uint256) {
        uint256 balance = tokenERC20.balanceOf(msg.sender);
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];
        uint256 lastTimeDeposet = useStakingInfo.lastTimeDeposit;
        

        if (lastTimeDeposet == 0) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - lastTimeDeposet;
        uint256 interest = ((balance * useStakingInfo.APR) / 10000) *
            (timeElapsed / 180 seconds); //lãi 8% trong 3 phút

        return interest;
    }


    function withRewardERC20() external {
        StakingInfo storage useStakingInfo = stakingInfo[msg.sender];

        require(
            (useStakingInfo.lastTimeDeposit + lockTime) >= block.timestamp,
            "ERC20Token: You can't withdraw now"
        );
        require(useStakingInfo.totalAmountERC20 > 0, "ERC20Token: No deposit");

        uint256 rewardERC20 = calculateRewardERC20();
        uint256 lastRewardERC20 = CalculateNewRewardERC20();

        uint256 totalwithRewardERC20 = useStakingInfo.totalAmountERC20 + rewardERC20 + lastRewardERC20;
        tokenERC20.transfer(
            msg.sender,
            totalwithRewardERC20
        );
        
        useStakingInfo.totalAmountERC20 = 0;
        useStakingInfo.mintNFTbCount = 0;
        useStakingInfo.rewardERC20 = 0;
        useStakingInfo.startTimeDeposit = 0;
        emit getData(totalwithRewardERC20,address(this),msg.sender);
    }
    function claimRewardERC20() external {

        StakingInfo storage stakingInfo = stakingInfo[msg.sender];

        require(calculateRewardERC20() > 0, "ERC20Token: No reward");
    
        uint256 rewardERC20 = calculateRewardERC20();
        uint256 lastRewardERC20 = CalculateNewRewardERC20();

        tokenERC20.transfer(msg.sender, rewardERC20 + lastRewardERC20);
    }
}
