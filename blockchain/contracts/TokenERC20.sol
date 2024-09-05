// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TokenERC721.sol";
contract TokenERC20 is ERC20 {
    // address public account;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;
    uint256 public TOTAL_faucet_MAX = 10_000_000 * 10 ** 18;

    using Strings for uint256;

    constructor() ERC20("tokenA", "ERC20") {
        _mint(address(this), TOTAL_SUPPLY);
    }

    function faucet(address _to, uint256 _amount) external {
        require(
            _amount <= TOTAL_faucet_MAX,
            string(
                abi.encodePacked(
                    "ERC20Token: faucet amount too large, max: ",
                    TOTAL_faucet_MAX.toString()
                )
            )
        );
        require(
            balanceOf(address(this)) >= _amount,
            "ERC20Token: insufficient balance in contract"
        );
        _transfer(address(this), _to, _amount);
    }
    function balanceOfTokenERC20() public view returns (uint256) {
        return balanceOf(address(this));
    }
}
