pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Tạo hợp đồng NFT cho sản phẩm giày theo dạng NFT ERC721 và quản lý bởi chủ sở hữu
contract ProductNFT is ERC721, Ownable {

    // Tạo một bộ đếm để theo dõi tokenId
    uint256 private _tokenIdCounter;

    // Cấu trúc để lưu thông tin sản phẩm
    struct ProductInfo {
        uint256 uniqueShoeID; // Mã số duy nhất của giày
        address factoryAddress; // Địa chỉ nhà máy sản xuất
        uint256 productionDate; // Ngày sản xuất (timestamp)
    }

    // Cấu trúc để lưu lịch sử chuyển nhượng
    struct TransferHistory {
        address from;// Địa chỉ người chuyển
        address to; // Địa chỉ người nhận
        uint256 timestamp; // Thời gian chuyển nhượng
    }

    // Bản đồ lưu thông tin sản phẩm theo tokenId
    mapping(uint256 => ProductInfo) private _productDetails; // tokenId => Thông tin sản phẩm
    mapping(uint256 => TransferHistory[]) private _provenance; // tokenId => Lịch sử chuyển nhượng

    event ProductMinted(uint256 indexed tokenId, uint256 uniqueShoeID, address indexed minter); // Tạo sự kiện khi mint sản phẩm mới gồm tokenId, mã số giày và địa chỉ người mint
    event ProvenanceRecorded(uint256 indexed tokenId, address indexed from, address indexed to, uint256 timestamp); // Tạo sự kiện khi ghi nhận lịch sử chuyển nhượng gồm tokenId, địa chỉ người chuyển, địa chỉ người nhận và thời gian

    // Hàm khởi tạo hợp đồng, đặt tên và ký hiệu cho NFT, đồng thời thiết lập chủ sở hữu
    constructor() ERC721("ShoeTraceNFT", "SNT") Ownable(msg.sender) { // ERC721(Tên NFT, Ký hiệu NFT) // Ownable(Chủ sở hữu hợp đồng)
        _tokenIdCounter = 0; // Khởi tạo bộ đếm tokenId từ 0
    }

    // Ghi đè hàm _update để ghi nhận lịch sử chuyển nhượng mỗi khi NFT được chuyển
    function _update(address to, uint256 tokenId, address auth)
        internal // internal để chỉ hợp đồng này và các hợp đồng kế thừa có thể gọi
        virtual // ảo để có thể được ghi đè trong các hợp đồng con
        override // ghi đè hàm từ hợp đồng cha
        returns (address)
    {
        // Gọi hàm _update gốc để thực hiện chuyển nhượng
        address from = super._update(to, tokenId, auth);

        // Ghi nhận lịch sử chuyển nhượng nếu không phải là minting (from != address(0))
        if (from != address(0)) {
            // Thêm bản ghi chuyển nhượng vào lịch sử
            _provenance[tokenId].push(
                TransferHistory({
                    from: from, // Địa chỉ người chuyển
                    to: to, // Địa chỉ người nhận
                    timestamp: block.timestamp // Thời gian chuyển nhượng
                })
            );
            emit ProvenanceRecorded(tokenId, from, to, block.timestamp); // Phát sự kiện ghi nhận lịch sử chuyển nhượng
        }

        return from;
    }

    // Hàm để mint một sản phẩm mới dưới dạng NFT, chỉ chủ sở hữu hợp đồng mới có thể gọi
    function mintProduct(uint256 _uniqueShoeID) public onlyOwner returns (uint256) {
        uint256 newItemId = _tokenIdCounter; // Lấy tokenId mới từ bộ đếm
        _tokenIdCounter++; // Tăng bộ đếm tokenId

        _safeMint(msg.sender, newItemId); // Mint NFT cho chủ sở hữu hợp đồng

        // Lưu thông tin sản phẩm
        _productDetails[newItemId] = ProductInfo({
            uniqueShoeID: _uniqueShoeID, // Mã số duy nhất của giày
            factoryAddress: msg.sender, // Địa chỉ nhà máy sản xuất (chủ sở hữu hợp đồng)
            productionDate: block.timestamp // Ngày sản xuất (timestamp hiện tại)
        });

        emit ProductMinted(newItemId, _uniqueShoeID, msg.sender); // Phát sự kiện mint sản phẩm mới
        return newItemId;
    }

    // Hàm để lấy thông tin sản phẩm theo tokenId
    function getProductInfo(uint256 _tokenId) public view returns (
        uint256 uniqueShoeID, // Mã số duy nhất của giày
        address factoryAddress, // Địa chỉ nhà máy sản xuất
        uint256 productionDate, // Ngày sản xuất (timestamp)
        address currentOwner // Chủ sở hữu hiện tại
    ) {
        address owner = _ownerOf(_tokenId); // Lấy chủ sở hữu hiện tại của NFT
        require(owner != address(0), "NFT does not exist"); // Kiểm tra NFT có tồn tại không

        ProductInfo memory product = _productDetails[_tokenId]; // Lấy thông tin sản phẩm từ bản đồ
        return (
            product.uniqueShoeID, 
            product.factoryAddress, 
            product.productionDate,
            owner
        );
    }

    // Hàm để lấy lịch sử chuyển nhượng (provenance) của một NFT theo tokenId
    function getProvenance(uint256 _tokenId) public view returns (TransferHistory[] memory) {
        require(_ownerOf(_tokenId) != address(0), "NFT does not exist"); // Kiểm tra NFT có tồn tại không
        return _provenance[_tokenId]; // Trả về mảng lịch sử chuyển nhượng
    }
}