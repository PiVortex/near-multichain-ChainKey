import { useState, useEffect, useContext } from "react";
import { NearContext } from "../context";

import { NFTClass } from "../services/NFT";
import PropTypes from 'prop-types';

export function NFTView({ props: { NFT_CONTRACT } }) {
  const { wallet, signedAccountId, tokenId, setTokenId } = useContext(NearContext);
  const CK = new NFTClass();

  const [NFTs, setNFTs] = useState([]);
  const [receiverId, setReceiverId] = useState('');


  useEffect(() => {
    getNFT();
  }, []);

  const handleChange = (event) => {
    setReceiverId(event.target.value);
  };

  async function getNFT() {
    try {
      const NFTList = await CK.get_NFTs(wallet, NFT_CONTRACT, signedAccountId);
      setNFTs(NFTList);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
    }
  }

  async function mintNFT() {
    try {
      await CK.mint_NFT(wallet, NFT_CONTRACT);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }

    getNFT();
  }

  async function sendNFT() {
    try {
      await CK.send_NFT(wallet, NFT_CONTRACT, tokenId, receiverId);
    } catch (error) {
      console.error("Failed to send NFT:", error);
    }

    getNFT();
    setTokenId('');
    setReceiverId('');
  }


  return (
    <>
    
      <div className="input-group input-group-sm mb-2">
          <span className="text-primary input-group-text" id="NFT">NFT</span>
          <select className="form-select" aria-describedby="NFT" value={tokenId} onChange={e => setTokenId(e.target.value)} >
            <option value="" disabled>Select NFT</option>
            {NFTs.map((NFT) => (
              <option key={NFT} value={NFT}>
                {NFT}
              </option>
            ))}
          </select>
      </div>
            
      <div className="container">
        <div className="d-flex justify-content-around mb-1">
          <button className="btn btn-primary btn-sm" style={{ width: '200px' }} onClick={() => mintNFT()}>Mint new NFT</button>
        </div>
      </div>

      <div className="row mb-5">
        <label className="col-sm-2 col-form-label col-form-label-sm">Account:</label>
        <div className="col-sm-10 d-flex align-items-center">
          <input type="text" className="form-control form-control-sm me-2" value={receiverId} onChange={handleChange} style={{ width: 'auto', flex: '1' }} />
          <button className="btn btn-primary" onClick={() => sendNFT()} style={{ whiteSpace: 'nowrap' }}>Send NFT</button>
        </div>
      </div>

    </>

  )
}

NFTView.propTypes = {
  props: PropTypes.shape({
    NFT_CONTRACT: PropTypes.string.isRequired,
  }).isRequired
};
