const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductNFT Anti-Counterfeit System", function () {
    let productNFT;
    let factory; 
    let distributor; 
    let retailStore; 
    let customer; 
    
    const SHOE_ID_1 = 12345678; 
    let TOKEN_ID_1; 

    before(async function () {
        [factory, distributor, retailStore, customer] = await ethers.getSigners();

        const ProductNFT = await ethers.getContractFactory("ProductNFT");
        productNFT = await ProductNFT.deploy();
        await productNFT.waitForDeployment();
    });

    it("1. Phải đặt Factory là Owner ban đầu và chỉ Owner được Mint NFT", async function () {
        expect(await productNFT.owner()).to.equal(factory.address);

        await expect(
            productNFT.connect(customer).mintProduct(8888)
        ).to.be.revertedWithCustomError(productNFT, "OwnableUnauthorizedAccount");

        const tx = await productNFT.connect(factory).mintProduct(SHOE_ID_1);
        const receipt = await tx.wait();
        
        const event = receipt.logs.find(e => e.eventName === 'ProductMinted');
        TOKEN_ID_1 = event.args.tokenId; 

        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(factory.address);
    });

    it("2. Kiểm tra thông tin gốc (Provenance) phải chính xác ngay sau khi Mint", async function () {
        const [uniqueShoeID, factoryAddress, productionDate] = await productNFT.getProductInfo(TOKEN_ID_1);
        
        expect(uniqueShoeID).to.equal(SHOE_ID_1);
        expect(factoryAddress).to.equal(factory.address);
        
        expect(productionDate).to.be.above(0); 
    });

    it("3. Mô phỏng quá trình Phân phối (Chuyển nhượng NFT)", async function () {
        await productNFT.connect(factory).transferFrom(
            factory.address, 
            distributor.address, 
            TOKEN_ID_1
        );
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(distributor.address);

        await productNFT.connect(distributor).transferFrom(
            distributor.address, 
            retailStore.address, 
            TOKEN_ID_1
        );
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(retailStore.address);
    });
    
    it("4. Customer xác thực thông tin và quyền sở hữu hiện tại", async function () {
        const [uniqueShoeID, factoryAddress, productionDate] = await productNFT.getProductInfo(TOKEN_ID_1);
        
        expect(uniqueShoeID).to.equal(SHOE_ID_1);
        expect(factoryAddress).to.equal(factory.address); 

        const currentOwner = await productNFT.ownerOf(TOKEN_ID_1);
        
        expect(currentOwner).to.equal(retailStore.address); 
        
        await productNFT.connect(retailStore).transferFrom(
            retailStore.address, 
            customer.address, 
            TOKEN_ID_1
        );
        expect(await productNFT.ownerOf(TOKEN_ID_1)).to.equal(customer.address);
    });
});