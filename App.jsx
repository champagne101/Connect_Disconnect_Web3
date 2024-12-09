import { useState } from "react";
import Web3 from "web3";


const WalletConnect = () => {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const connectWalletHandler = async () => {
    setError('');
    setSuccessMsg('');
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAddress(accounts[0]);

        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3Instance.eth.getAccounts();
          setAddress(accounts[0]);
        });

        setSuccessMsg('Wallet connected!');
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  // Disconnect Wallet
  const disconnectWalletHandler = () => {
    try {
      // Clear all states
      setWeb3(null);
      setAddress(null);

      // Remove the accountsChanged listener
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts();
          setAddress(accounts[0]);
        });
      }

      setSuccessMsg('Wallet disconnected!');
    } catch (err) {
      setError('Failed to disconnect wallet: ' + err.message);
    }
  };

  return (
    <div>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      <button onClick={disconnectWalletHandler} disabled={!address}>
        Disconnect Wallet
      </button>
      {address && <p>Connected Address: {address}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </div>
  );
};

export default WalletConnect;
