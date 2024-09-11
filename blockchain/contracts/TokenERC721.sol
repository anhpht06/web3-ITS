// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenERC721 is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("NFT-B", "ERC721") {}

    mapping(address => uint256[]) private _ownedTokens;

    function safeMint(address to) external returns (uint256) {
        uint256 _tokenId = nextTokenId;
        _safeMint(to, _tokenId);
        _ownedTokens[to].push(_tokenId);
        nextTokenId += 1;

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

    function transferAndUpdateTokens(
        address from,
        address to,
        uint256 tokenId
    ) public {
        require(
            ownerOf(tokenId) == from,
            "ERC721: transfer of token that is not owned"
        );
        safeTransferFrom(from, to, tokenId);
        _ownedTokens[to].push(tokenId);
        _updateTokenOwnership(from, tokenId);
    }

    function _updateTokenOwnership(address from, uint256 tokenId) private {
        _removeTokenFromOwnerEnumeration(from, tokenId);
    }

    function _removeTokenFromOwnerEnumeration(
        address from,
        uint256 tokenId
    ) private {
        uint256[] storage tokens = _ownedTokens[from];
        uint256 tokenCount = tokens.length;
        for (uint256 i = 0; i < tokenCount; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokenCount - 1];
                tokens.pop();
                break;
            }
        }
    }
}
