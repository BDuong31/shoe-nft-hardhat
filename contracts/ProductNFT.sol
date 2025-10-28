// contracts/ProductNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct ProductInfo {
        uint256 uniqueShoeID;      
        address factoryAddress;    
        uint256 productionDate;    
    }

    mapping(uint256 => ProductInfo) private _productDetails;

    event ProductMinted(uint256 indexed tokenId, uint256 uniqueShoeID, address indexed minter);

    constructor() 
        ERC721("ShoeTraceNFT", "SNT") 
        Ownable(msg.sender)
    {
        _tokenIdCounter = 0; 
    }

    function mintProduct(uint256 _uniqueShoeID) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;
        
        _safeMint(msg.sender, newItemId);
        
        _productDetails[newItemId] = ProductInfo({
            uniqueShoeID: _uniqueShoeID,
            factoryAddress: msg.sender,
            productionDate: block.timestamp
        });

        emit ProductMinted(newItemId, _uniqueShoeID, msg.sender);
        return newItemId;
    }

    function getProductInfo(uint256 _tokenId) public view returns (
        uint256 uniqueShoeID, 
        address factoryAddress, 
        uint256 productionDate
    ) {
        require(ownerOf(_tokenId) != address(0), "NFT does not exist");
        ProductInfo memory product = _productDetails[_tokenId];
        return (product.uniqueShoeID, product.factoryAddress, product.productionDate);
    }
}