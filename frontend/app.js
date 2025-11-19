import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.1/+esm";

// *******************************************************************
// ************ BƯỚC 1: CẤU HÌNH CONTRACT ****************************
// *******************************************************************

// ⚠️ QUAN TRỌNG: Thay địa chỉ này bằng địa chỉ Contract bạn vừa Deploy trong Terminal
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

const CONTRACT_ABI = [
   {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "uniqueShoeID",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "minter",
          "type": "address"
        }
      ],
      "name": "ProductMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProvenanceRecorded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getProductInfo",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "uniqueShoeID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "factoryAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "productionDate",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "currentOwner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getProvenance",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct ProductNFT.TransferHistory[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_uniqueShoeID",
          "type": "uint256"
        }
      ],
      "name": "mintProduct",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

// Địa chỉ ví Hardhat (Localhost)
const ROLE_ADDRESSES = {
    Factory: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",     // Account #0
    Distributor: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Account #1
    RetailStore: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Account #2
    Customer: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",    // Account #3
};

let provider;
let signer;
let contract;

// *******************************************************************
// ************ CÁC HÀM XỬ LÝ LOGIC **********************************
// *******************************************************************

function getRoleName(address) {
    if (!address) return "Unknown";
    const entry = Object.entries(ROLE_ADDRESSES)
        .find(([key, val]) => val.toLowerCase() === address.toLowerCase());
    return entry ? entry[0] : `${address.substring(0, 6)}...${address.substring(38)}`;
}

function log(elementId, message, isError = false) {
    const logContainer = document.getElementById(elementId);
    logContainer.innerHTML = `<span class="${isError ? 'text-red-500' : 'text-green-600'}">${message}</span>`;
}

// 1. Kết nối Ví
async function connectWallet() {
    if (!window.ethereum) return alert("Vui lòng cài đặt MetaMask!");
    
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        document.getElementById("wallet-address").innerText = address;
        document.getElementById("current-role").innerText = getRoleName(address);
        
        log("connect-log", `✅ Đã kết nối: ${getRoleName(address)}`);
        
        // Tự động chọn người nhận phù hợp dựa trên vai trò hiện tại
        autoSelectReceiver(getRoleName(address));

    } catch (error) {
        console.error(error);
        log("connect-log", "Lỗi kết nối: " + error.message, true);
    }
}

// 2. Mint NFT (Factory Only)
async function mintProduct() {
    if (!contract) return alert("Chưa kết nối ví!");
    
    const shoeID = document.getElementById("shoe-id-input").value;
    if (!shoeID) return alert("Vui lòng nhập ID giày!");

    try {
        log("mint-log", "⏳ Đang gửi giao dịch Mint...");
        
        // Gửi transaction
        const tx = await contract.mintProduct(shoeID);
        log("mint-log", `⏳ Đang chờ xác nhận trên Blockchain...`);
        
        // Chờ transaction hoàn tất
        const receipt = await tx.wait();
        
        console.log("Receipt nhận được:", receipt); // In ra để debug nếu cần

        // --- BẮT ĐẦU ĐOẠN SỬA LỖI ---
        let tokenId = null;

        // Duyệt qua tất cả các logs có trong receipt
        for (const log of receipt.logs) {
            try {
                // Ethers v6: parseLog có thể trả về null nếu log không khớp ABI
                const parsedLog = contract.interface.parseLog(log);
                
                // Kiểm tra xem có parse được không VÀ đúng tên sự kiện không
                if (parsedLog && parsedLog.name === "ProductMinted") {
                    tokenId = parsedLog.args.tokenId.toString();
                    console.log("Đã tìm thấy TokenID:", tokenId);
                    break; // Tìm thấy rồi thì thoát vòng lặp ngay
                }
            } catch (err) {
                // Nếu log này bị lỗi (do log hệ thống, log rác), ta bỏ qua nó
                console.warn("Bỏ qua một log không xác định:", err);
            }
        }
        // --- KẾT THÚC ĐOẠN SỬA LỖI ---

        if (tokenId === null) {
            log("mint-log", "⚠️ Giao dịch thành công nhưng không bắt được TokenID (Vui lòng kiểm tra Console F12)", true);
            return;
        }

        log("mint-log", `✅ Mint thành công! Token ID: ${tokenId}`);
        
        // Điền sẵn vào ô Transfer
        document.getElementById("transfer-token-id").value = tokenId;
        document.getElementById("provenance-token-id").value = tokenId;

    } catch (error) {
        console.error(error);
        if (error.message && error.message.includes("OwnableUnauthorizedAccount")) {
            log("mint-log", "⛔ LỖI: Bạn không phải Factory (Owner)!", true);
        } else {
            log("mint-log", "Lỗi Mint: " + (error.reason || error.message), true);
        }
    }
}
// 3. Chuyển NFT (Transfer)
// async function transferNFT() {
//     if (!contract) return alert("Chưa kết nối ví!");

//     const tokenId = document.getElementById("transfer-token-id").value;
//     const toAddress = document.getElementById("transfer-to-address").value;

//     if (!tokenId || !toAddress) return alert("Thiếu thông tin chuyển!");

//     try {
//         const owner = await contract.ownerOf(tokenId);
//         const currentSigner = await signer.getAddress();

//         if (owner.toLowerCase() !== currentSigner.toLowerCase()) {
//             return log("transfer-log", "⛔ Bạn không phải chủ sở hữu Token này!", true);
//         }

//         log("transfer-log", `⏳ Đang chuyển Token ${tokenId} tới ${getRoleName(toAddress)}...`);
        
//         // Gọi hàm transferFrom (Token Owner tự gọi thì không cần Approve trước)
//         const tx = await contract.transferFrom(currentSigner, toAddress, tokenId);
//         await tx.wait();

//         log("transfer-log", `✅ Chuyển thành công cho ${getRoleName(toAddress)}!`);

//     } catch (error) {
//         console.error(error);
//         log("transfer-log", "Lỗi chuyển: " + error.message, true);
//     }
// }

async function transferNFT() {
    if (!contract) return alert("Chưa kết nối ví!");

    // Lấy dữ liệu từ ô input
    const tokenId = document.getElementById("transfer-token-id").value;
    const toAddress = document.getElementById("transfer-to-address").value;

    if (!tokenId || !toAddress) return alert("Thiếu thông tin chuyển!");

    try {
        const currentSigner = await signer.getAddress();
        
        // Kiểm tra xem ví hiện tại có phải chủ token không
        const owner = await contract.ownerOf(tokenId);
        if (owner.toLowerCase() !== currentSigner.toLowerCase()) {
            return log("transfer-log", "Bạn không phải chủ sở hữu Token này! (Hãy kiểm tra lại ví đang kết nối)", true);
        }

        log("transfer-log", `Đang chuyển Token ${tokenId} tới ${getRoleName(toAddress)}...`);
        
        // === SỬA LỖI TẠI ĐÂY: THÊM GAS LIMIT THỦ CÔNG ===
        // Thêm { gasLimit: 500000 } để tránh lỗi Internal JSON-RPC
        const tx = await contract.transferFrom(currentSigner, toAddress, tokenId, { gasLimit: 3000000 });
        
        log("transfer-log", `Đang chờ xác nhận...`);
        await tx.wait();

        log("transfer-log", `Chuyển thành công cho ${getRoleName(toAddress)}!`);

    } catch (error) {
        console.error(error);
        log("transfer-log", "Lỗi chuyển: " + (error.reason || error.message), true);
    }
}

// 4. Kiểm tra thông tin (Traceability)
async function checkAuthenticity() {
    if (!contract) return alert("Chưa kết nối ví!");
    
    const tokenId = document.getElementById("provenance-token-id").value;
    if (!tokenId) return alert("Nhập Token ID!");

    try {
        log("authenticity-log", "⏳ Đang truy xuất dữ liệu...");
        
        // Lấy thông tin cơ bản
        const info = await contract.getProductInfo(tokenId);
        // Lấy lịch sử
        const history = await contract.getProvenance(tokenId);

        // Render kết quả
        const resultDiv = document.getElementById("provenance-results");
        resultDiv.innerHTML = `
            <div class="bg-gray-50 p-4 rounded border mt-4">
                <h3 class="font-bold text-lg text-blue-800">📦 Thông tin sản phẩm</h3>
                <ul class="mt-2 space-y-1 text-sm">
                    <li>🏷 <strong>Shoe ID (Physical):</strong> ${info.uniqueShoeID}</li>
                    <li>🏭 <strong>Factory:</strong> ${info.factoryAddress} (${getRoleName(info.factoryAddress)})</li>
                    <li>📅 <strong>Ngày SX:</strong> ${new Date(Number(info.productionDate) * 1000).toLocaleString()}</li>
                    <li>👤 <strong>Chủ hiện tại:</strong> <span class="text-red-600 font-bold">${getRoleName(info.currentOwner)}</span></li>
                </ul>
            </div>

            <div class="bg-gray-50 p-4 rounded border mt-4">
                <h3 class="font-bold text-lg text-purple-800">🚚 Lịch sử hành trình (Provenance)</h3>
                <div class="overflow-x-auto mt-2">
                    <table class="min-w-full bg-white text-sm">
                        <thead>
                            <tr class="bg-gray-200 text-left">
                                <th class="p-2">Từ (From)</th>
                                <th class="p-2">Đến (To)</th>
                                <th class="p-2">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.length === 0 ? '<tr><td colspan="3" class="p-2 text-center">Chưa có giao dịch nào (Mới Mint)</td></tr>' : ''}
                            ${history.map(h => `
                                <tr class="border-t">
                                    <td class="p-2">${getRoleName(h.from)}</td>
                                    <td class="p-2">⬇️ ${getRoleName(h.to)}</td>
                                    <td class="p-2">${new Date(Number(h.timestamp) * 1000).toLocaleTimeString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        log("authenticity-log", "✅ Truy xuất xong!");

    } catch (error) {
        console.error(error);
        log("authenticity-log", "⛔ Không tìm thấy NFT hoặc lỗi mạng!", true);
        document.getElementById("provenance-results").innerHTML = "";
    }
}

// Helper: Tự động chọn người nhận tiếp theo dựa trên logic chuỗi cung ứng
function autoSelectReceiver(currentRole) {
    const select = document.getElementById("transfer-to-address");
    let target = "";
    
    if (currentRole === "Factory") target = ROLE_ADDRESSES.Distributor;
    else if (currentRole === "Distributor") target = ROLE_ADDRESSES.RetailStore;
    else if (currentRole === "RetailStore") target = ROLE_ADDRESSES.Customer;
    
    if (target) select.value = target;
}

// Khởi tạo Dropdown địa chỉ
function initUI() {
    const select = document.getElementById("transfer-to-address");
    for (const [role, addr] of Object.entries(ROLE_ADDRESSES)) {
        const opt = document.createElement("option");
        opt.value = addr;
        opt.text = `${role} (${addr.substring(0,6)}...)`;
        select.add(opt);
    }
    
    // Gắn sự kiện
    document.getElementById("connect-btn").onclick = connectWallet;
    document.getElementById("mint-btn").onclick = mintProduct;
    document.getElementById("transfer-btn").onclick = transferNFT;
    document.getElementById("check-btn").onclick = checkAuthenticity;
}

window.onload = initUI;