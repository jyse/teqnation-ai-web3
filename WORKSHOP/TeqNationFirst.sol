// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TeqNationFirst is ERC721, ERC721Enumerable, ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor()
        ERC721("TeqNationFirst", "TEQ")        
    {}

    uint256 maxSupply = 30;

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://.....[json-hash-folder]....../";
    }
        // Step 1: Researching the safeMint()
        // Step 2: A tokenId always increments with mint
        // Step 3: Deploy a contract locally on VM Remix London
        // Step 4: Use safeMint() locally on VM Remix London
        // Step 5: Try out balanceOf, ownerOf, tokenURI functions after using safeMint()
    function safeMint() public {
        // Step 6: Make the safeMint function payable
        // Step 6a: Add a requirement of msg.value >= 0.001 ether
        // Step 7: Ethereum Metric System
        // Step 8: use SafeMint again without value
        // Step 9: use SafeMint again WITH value
        // Step 10: Add a requirement of totalSupply() <= maxSupply
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);        
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
