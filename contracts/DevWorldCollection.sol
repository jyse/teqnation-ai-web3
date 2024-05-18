// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DevWorldCollection is ERC721, ERC721Enumerable, ERC721URIStorage {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    uint256 public maxSupply = 500;
    mapping(uint256 => bool) private _mintedTokens;
 
    constructor()
        ERC721("DevWorldCollection", "DWC")        
    {}

    function _baseURI() internal pure override returns (string memory) {
        
        return "ipfs://QmR5TJiH8e9joEkwG4iW3TYEUgUNq9fP8vHc3u3EGkkYzj/";
    }

    function isTokenMinted(uint256 tokenId) public view returns (bool) {
        return _mintedTokens[tokenId];
    }

 
    function safeMint(address to, uint256 tokenId) public payable {
        require(msg.value >= 0.001 ether, "More money please");
        require(totalSupply() < maxSupply, "You have reached a limit");
        require(!_mintedTokens[tokenId], "Token already minted");
        require(tokenId > 0 && tokenId <= maxSupply, "Token ID is out of range");
        _mintedTokens[tokenId] = true;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _constructTokenURI(tokenId));
    }

   function _constructTokenURI(uint256 tokenId) private pure returns (string memory) {
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
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