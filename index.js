async function connectWallet () {
  const connectButton = document.getElementById("btnConnect")
  if (!!window.ethereum && typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } catch (e) {
      console.error(e)
    }

    connectButton.innerHTML = 'connected'
  } else {
    connectButton.innerHTML = 'no wallet detected'
  }
}

async function callFund () {
  const ethAmount = document.getElementById("fundAmount").value
  console.log({ethAmount})
  if (!!window.ethereum && typeof window.ethereum !== 'undefined') {
  } else {
    console.log('cannot fund this contract')
  }
}