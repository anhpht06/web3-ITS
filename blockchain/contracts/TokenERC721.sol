// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenERC721 is ERC721 {
    uint256 public nextTokenId;
    constructor() ERC721("NFT-B", "ERC721") {}

    mapping(address => uint256[]) private _ownedTokens;

    function mint(address to) external returns (uint256 _tokenId) {
        _tokenId = nextTokenId;
        _mint(to, _tokenId);
        nextTokenId += 1;

        // Add token ID to owner's list
        _ownedTokens[to].push(_tokenId);

        return _tokenId;
    }
    function balanceOfTokenERC721() public view returns (uint256) {
        return balanceOf(address(this));
    }

    function getOwnedTokens(
        address owner
    ) external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }
    // function _burn(uint256 tokenId) internal override {
    //     super._burn(tokenId);

    //     // Remove token ID from owner's list
    //     address owner = ownerOf(tokenId);
    //     uint256[] storage tokens = _ownedTokens[owner];
    //     for (uint256 i = 0; i < tokens.length; i++) {
    //         if (tokens[i] == tokenId) {
    //             tokens[i] = tokens[tokens.length - 1];
    //             tokens.pop();
    //             break;
    //         }
    //     }
    // }
}
