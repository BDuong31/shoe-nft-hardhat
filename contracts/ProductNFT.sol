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

    struct TransferHistory {
        address from;
        address to;
        uint256 timestamp;
    }

    mapping(uint256 => ProductInfo) private _productDetails;
    mapping(uint256 => TransferHistory[]) private _provenance;

    event ProductMinted(uint256 indexed tokenId, uint256 uniqueShoeID, address indexed minter);
    event ProvenanceRecorded(uint256 indexed tokenId, address indexed from, address indexed to, uint256 timestamp);

    constructor() ERC721("ShoeTraceNFT", "SNT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        address from = super._update(to, tokenId, auth);

        if (from != address(0)) {
            _provenance[tokenId].push(
                TransferHistory({
                    from: from,
                    to: to,
                    timestamp: block.timestamp
                })
            );
            emit ProvenanceRecorded(tokenId, from, to, block.timestamp);
        }

        return from;
    }

    function mintProduct(uint256 _uniqueShoeID) public onlyOwner returns (uint256) {
        uint256 newItemId = _tokenIdCounter;
        _tokenIdCounter++;

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
        uint256 productionDate,
        address currentOwner
    ) {
        address owner = _ownerOf(_tokenId);
        require(owner != address(0), "NFT does not exist");

        ProductInfo memory product = _productDetails[_tokenId];
        return (
            product.uniqueShoeID, 
            product.factoryAddress, 
            product.productionDate,
            owner
        );
    }

    function getProvenance(uint256 _tokenId) public view returns (TransferHistory[] memory) {
        require(_ownerOf(_tokenId) != address(0), "NFT does not exist");
        return _provenance[_tokenId];
    }
}