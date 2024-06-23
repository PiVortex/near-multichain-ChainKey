import { useState, useEffect, useContext } from "react";
import { NearContext } from "../context";

import { NFTChainKey } from "../services/NFT";
import PropTypes from 'prop-types';

export function NFTView({ props: { setStatus, NFT_CONTRACT } }) {
  const { wallet, signedAccountId, tokenId, setTokenId } = useContext(NearContext);
  const NFTInstance = new NFTChainKey();

  const [NFTs, setNFTs] = useState([]);


  useEffect(() => {
    getNFTs()

    async function getNFTs() {
      try {
        const NFT_list = await NFTInstance.get_NFTs(wallet, NFT_CONTRACT, signedAccountId);
        setNFTs(NFT_list);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
      }
    }
  }, []);

  return (
    <>

      <div> My NFTs: </div>

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
          
        <div> NFTId: {tokenId}</div>
    </>

  )
}

NFTView.propTypes = {
  props: PropTypes.shape({
    setStatus: PropTypes.func.isRequired,
    NFT_CONTRACT: PropTypes.string.isRequired,
  }).isRequired
};
