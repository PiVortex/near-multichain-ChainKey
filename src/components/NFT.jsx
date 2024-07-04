import { useState, useEffect, useContext } from "react";
import { NearContext } from "../context";

import { NFTChainKey } from "../services/NFT";
import PropTypes from 'prop-types';

export function NFTView({ props: { setStatus, NFT_CONTRACT } }) {
  const { wallet, signedAccountId, tokenId, setTokenId } = useContext(NearContext);
  const NFTInstance = new NFTChainKey();

  const [NFTs, setNFTs] = useState([]);
  const [receiverId, setReceiverId] = useState('')


  useEffect(() => {
    getNFTs()
  }, []);

  const handleChange = (event) => {
    setReceiverId(event.target.value);
  };

  async function getNFTs() {
    try {
      const NFT_list = await NFTInstance.get_NFTs(wallet, NFT_CONTRACT, signedAccountId);
      setNFTs(NFT_list);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
    }
  }

  async function payStorage() {
    try {
      await NFTInstance.add_storage_deposit(wallet, NFT_CONTRACT);
    } catch (error) {
      console.error("Failed to add storage_deposit:", error);
    }
  }

  async function mintNFT() {
    try {
      await NFTInstance.mint_NFT(wallet, NFT_CONTRACT);
    } catch (error) {
      console.error("Failed to mint NFT:", error)
    }

    getNFTs();
  }

  async function sendNFT() {
    try {
      await NFTInstance.send_NFT(wallet, NFT_CONTRACT, tokenId, receiverId);
    } catch (error) {
      console.error("Failed to send NFT:", error)
    }

    getNFTs();
    setTokenId('');
    setReceiverId('');
  }


  return (
    <>

      <div>
        <p> My NFTs: </p>

        <div className="NFT-list">
              {NFTs.map(NFT => (
                <div key={NFT}>
                  
                  {<button className="NFT-view" onClick={() => setTokenId(NFT)}><div>
                    {NFT}
                    </div>
                  </button> }

                </div>
              ))}
        </div>
        <p> Selected NFT: {tokenId} </p>
      </div>

      <div>
        <button onClick={() => payStorage()}> Pay NFT storage deposit </button>
        <button onClick={() => mintNFT()}> Mint new NFT </button>
      </div>    

      <div>
        <p> Send selected NFT </p>
        <input type="text" value={receiverId} onChange={handleChange} />
        <button onClick={() => sendNFT()}> Send NFT </button>
      </div>
    </>

  )
}

NFTView.propTypes = {
  props: PropTypes.shape({
    setStatus: PropTypes.func.isRequired,
    NFT_CONTRACT: PropTypes.string.isRequired,
  }).isRequired
};
