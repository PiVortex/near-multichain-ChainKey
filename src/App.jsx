import { NearContext } from './context';

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"
import { Wallet } from "./services/near-wallet";
import { ChainKeyView } from "./components/ChainKey";
import { EthereumView } from "./components/Ethereum";
import { BitcoinView } from "./components/Bitcoin";

// CONSTANTS
const CHAIN_KEY_CONTRACT = 'v2.nft.kagi.testnet';

// NEAR WALLET
const wallet = new Wallet({ network: 'testnet', createAccessKeyFor: CHAIN_KEY_CONTRACT });

function App() {
  const [signedAccountId, setSignedAccountId] = useState('');
  const [status, setStatus] = useState("Please login to request a signature");
  const [chain, setChain] = useState('eth');
  const [tokenId, setTokenId] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => { 
    wallet.startUp(setSignedAccountId) 
  }, []);

  useEffect(() => {
    if (signedAccountId && tokenId == '') {
      setStatus("Please select a Chain Key");
    } else if (! signedAccountId) {
      setStatus("Please login to request a signature");
    }
  }, [signedAccountId]);
  

  useEffect(() => {
    // Get transaction hash from when using web wallet
    const getTransactionHashFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = urlParams.get('transactionHashes');
      setTransactionHash(hash);
    };

    getTransactionHashFromUrl();
  }, []);

  return (
    <NearContext.Provider value={{ wallet, signedAccountId, tokenId, setTokenId }}>
      <Navbar />
      <div className="container">
        <h4> 🔗 NEAR Multi Chain </h4>
        <p className="small">
          Send transactions through NFT Chain Keys. Learn more in the <a href="https://docs.near.org/build/chain-abstraction/nft-chain-keys"> <b>documentation</b></a>.
        </p>

        {signedAccountId &&
          <div style={{ width: '50%', minWidth: '400px' }}>
            
            <div className="input-group input-group-sm mt-3 mb-3">
              <input className="form-control text-center" type="text" value={`NFT Chain Keys Contract: ${CHAIN_KEY_CONTRACT}`} disabled />
            </div>
            
            <ChainKeyView props={{ CHAIN_KEY_CONTRACT }} />

            <div className="input-group input-group-sm my-2 mb-4">
              <span className="text-primary input-group-text" id="chain">Chain</span>
              <select className="form-select" aria-describedby="chain" value={chain} onChange={e => setChain(e.target.value)} >
                <option value="eth"> Ξ Ethereum </option>
                <option value="btc"> ₿ BTC </option>
              </select>
            </div>

            {chain === 'eth' && <EthereumView props={{ setStatus, CHAIN_KEY_CONTRACT, transactionHash }} />}
            {chain === 'btc' && <BitcoinView props={{ setStatus, CHAIN_KEY_CONTRACT }} />}
          </div>
        }

        <div className="mt-3 small text-center">
          {status}
        </div>
      </div>
    </NearContext.Provider>
  )
}

export default App
