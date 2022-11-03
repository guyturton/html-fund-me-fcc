import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, fundMeAddress } from "./constants.js";

const connectBtn = document.getElementById("btnConnect");
const fundBtn = document.getElementById("btnFund");
const getBalanceBtn = document.getElementById("btnGetBalance");
const withdrawBtn = document.getElementById("btnWithdrawl");
connectBtn.onclick = connect;
fundBtn.onclick = fund;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }
        connectBtn.innerHTML = "Connected";
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    } else {
        connectBtn.innerHTML = "Please install MetaMask";
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(fundMeAddress);
        console.log(`Balance: ${ethers.utils.formatEther(balance)}`);
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing funds ....");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(fundMeAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdrawl();
            await listenForTransactionMine(transactionResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}

async function fund() {
    const ethAmount = document.getElementById("txtEthAmount").value;
    console.log(`Funding with ETH ammount: ${ethAmount}`);
    if (typeof window.ethereum !== "undefined") {
        try {
            //await ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(fundMeAddress, abi, signer);
            try {
                const transactionResponse = await contract.fund({
                    value: ethers.utils.parseEther(ethAmount),
                });
                await listenForTransactionMine(transactionResponse, provider);
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        connectBtn.innerHTML = "Please install MetaMask";
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining: ${transactionResponse.hash}....`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed confirmations: ${transactionReceipt.confirmations}`
            );
        });
        resolve();
    });
}
