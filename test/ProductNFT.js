const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductNFT Anti-Counterfeit System", function () {
    let productNFT;
    let factory;      // Người tạo ra giày (Owner contract)
    let distributor;  // Nhà phân phối
    let retailStore;  // Cửa hàng bán lẻ
    let customer;     // Khách hàng cuối
    
    const SHOE_ID_1 = 12345678; 
    let TOKEN_ID_1; 

    before(async function () {
        // 1. Lấy danh sách ví
        [factory, distributor, retailStore, customer] = await ethers.getSigners();

        // 2. Deploy Contract
        const ProductNFT = await ethers.getContractFactory("ProductNFT");
        productNFT = await ProductNFT.deploy();
        await productNFT.waitForDeployment();
        
        console.log("Contract deployed at:", await productNFT.getAddress());
    });

    it("1. Phải đặt Factory là Owner ban đầu và chỉ Owner được Mint NFT", async function () {
        // Kiểm tra Factory là chủ contract
        expect(await productNFT.owner()).to.equal(factory.address);

        // Kiểm tra: Customer (người lạ) KHÔNG được mint
        // Dùng .connect(customer) để giả lập hành động của khách
        await expect(
            productNFT.connect(customer).mintProduct(8888)
        ).to.be.revertedWithCustomError(productNFT, "OwnableUnauthorizedAccount");

        // Factory tiến hành Mint
        const tx = await productNFT.connect(factory).mintProduct(SHOE_ID_1);
        const receipt = await tx.wait(); // Chờ transaction hoàn tất
        
        // === CÁCH LẤY TOKEN ID CHUẨN TRONG ETHERS V6 ===
        // Lọc trong các logs để tìm event 'ProductMinted'
        const mintLog = receipt.logs
            .map(log => {
                try { return productNFT.interface.parseLog(log); } 
                catch (e) { return null; }
            })
            .find(parsedLog => parsedLog && parsedLog.name === 'ProductMinted');
            
        // Gán vào biến toàn cục để dùng cho các test sau
        TOKEN_ID_1 = mintLog.args.tokenId; 

        console.log("\t>> Minted Token ID:", TOKEN_ID_1.toString());

        // Kiểm tra chủ sở hữu NFT lúc này phải là Factory
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(factory.address);
    });

    it("2. Kiểm tra thông tin gốc (Provenance) phải chính xác ngay sau khi Mint", async function () {
        const data = await productNFT.getProductInfo(TOKEN_ID_1);
        
        // data trả về dạng mảng: [uniqueShoeID, factoryAddress, productionDate, currentOwner]
        expect(data.uniqueShoeID).to.equal(SHOE_ID_1);
        expect(data.factoryAddress).to.equal(factory.address);
        expect(data.currentOwner).to.equal(factory.address);
        expect(data.productionDate).to.be.above(0); 
    });

    it("3. Mô phỏng chuỗi cung ứng: Factory -> Distributor -> Retailer", async function () {
        // BƯỚC A: Factory chuyển cho Distributor
        // Factory đang giữ token, nên Factory gọi hàm transfer
        await productNFT.connect(factory).transferFrom(
            factory.address, 
            distributor.address, 
            TOKEN_ID_1
        );
        
        // Kiểm tra: Distributor đã nhận được chưa?
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(distributor.address);

        // BƯỚC B: Distributor chuyển cho Retailer
        // Lúc này Distributor là chủ, nên Distributor gọi hàm
        await productNFT.connect(distributor).transferFrom(
            distributor.address, 
            retailStore.address, 
            TOKEN_ID_1
        );

        // Kiểm tra: Retailer đã nhận được chưa?
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(retailStore.address);
    });
    
    it("4. Khách hàng mua giày: Retailer -> Customer", async function () {
        // Retailer chuyển cho Customer
        await productNFT.connect(retailStore).transferFrom(
            retailStore.address, 
            customer.address, 
            TOKEN_ID_1
        );

        // Kiểm tra quyền sở hữu cuối cùng
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(customer.address);

        // Kiểm tra lại thông tin gốc xem có bị thay đổi không (phải giữ nguyên)
        const [id, factoryAddr, , currentOwner] = await productNFT.getProductInfo(TOKEN_ID_1);
        
        expect(id).to.equal(SHOE_ID_1);
        expect(factoryAddr).to.equal(factory.address); // Vẫn là Factory sản xuất
        expect(currentOwner).to.equal(customer.address); // Nhưng chủ hiện tại là Customer
    });

    it("5. Kiểm tra lịch sử đường đi (Traceability)", async function () {
        // Lấy lịch sử
        const history = await productNFT.getProvenance(TOKEN_ID_1);
        
        console.log(`\t>> Total transfers recorded: ${history.length}`);
        
        // Chúng ta đã thực hiện 3 lần chuyển:
        // 1. Factory -> Distributor
        // 2. Distributor -> Retailer
        // 3. Retailer -> Customer
        expect(history.length).to.equal(3);

        // Kiểm tra giao dịch đầu tiên trong lịch sử
        expect(history[0].from).to.equal(factory.address);
        expect(history[0].to).to.equal(distributor.address);
        
        // Kiểm tra giao dịch cuối cùng
        expect(history[2].to).to.equal(customer.address);
    });
});