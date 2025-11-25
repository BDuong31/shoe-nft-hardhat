const hre = require("hardhat");

async function main() {
  // Hardhat tự động lấy signers (tài khoản)
  const [deployer] = await hre.ethers.getSigners();

  console.log("Triển khai contract với tài khoản:", deployer.address);

  // Lấy Contract Factory
  const ProductNFT = await hre.ethers.getContractFactory("ProductNFT");

  // Triển khai Contract
  const productNFT = await ProductNFT.deploy();

  // Đợi cho đến khi contract được triển khai hoàn tất
  await productNFT.waitForDeployment(); 
  const contractAddress = productNFT.target;

  console.log("ProductNFT đã được triển khai tại địa chỉ:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});