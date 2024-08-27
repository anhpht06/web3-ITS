// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenERC721 is ERC721 {
    uint256 public nextTokenId;
    constructor() ERC721("NFT-B", "ERC721") {}

    function mint(address to) external {
        uint256 _tokenId = nextTokenId;
        _mint(to, _tokenId);
        nextTokenId += 1;
    }
}
