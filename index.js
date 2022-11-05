import { ethers } from "./ethers-5.2.umd.min.js"
import { ABI, CONTRACT_ADDRESS } from "./constants.js"

const connectButton = document.getElementById("btnConnect")
const withdrawButton = document.getElementById("btnWithdraw")
const fundButton = document.getElementById("btnFund")
const balanceButton = document.getElementById("btnBalance")
const contractBalance = document.getElementById("contractBalance")
const contractState = document.getElementById("contractState")
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("fundAmount").value
  contractState.innerHTML = `Funding with ${ethAmount}...`
  contractBalance.innerHTML = ''
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      contractState.innerHTML = `There was an error: ${error}`
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function getBalance() {
  contractState.innerHTML = ''
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(CONTRACT_ADDRESS)
    contractBalance.innerHTML = ethers.utils.formatEther(balance)
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}


function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining: ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with: ${transactionReceipt.confirmations} confirmations`)
      contractState.innerHTML = `Completed with: ${transactionReceipt.confirmations} confirmations`
      resolve()
    })
  })
}

async function withdraw () {
  contractState.innerHTML = 'withdrawing...'
  contractBalance.innerHTML = ''
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
      contractState.innerHTML = 'FINISHED'
    } catch (e) {
      console.log(e)
      contractState.innerHTML = `ERROR! ${e}`
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}