import { useState, useEffect, useContext } from "react";
import { NearContext } from "../context";

import { ChainKey } from "../services/chain-key";
import PropTypes from 'prop-types';

export function ChainKeyView({ props: { CHAIN_KEY_CONTRACT } }) {
  const { wallet, signedAccountId, tokenId, setTokenId } = useContext(NearContext);
  const CK = new ChainKey();

  const [chainKeys, setChainKeys] = useState([]);
  const [receiverId, setReceiverId] = useState('')


  useEffect(() => {
    getChainKeys()
  }, []);

  const handleChange = (event) => {
    setReceiverId(event.target.value);
  };

  async function getChainKeys() {
    try {
      const chainKeyList = await CK.get_chain_keys(wallet, CHAIN_KEY_CONTRACT, signedAccountId);
      setChainKeys(chainKeyList);
    } catch (error) {
      console.error("Failed to fetch Chain Keys:", error);
    }
  }

  async function payStorage() {
    try {
      await CK.add_storage_deposit(wallet, CHAIN_KEY_CONTRACT);
    } catch (error) {
      console.error("Failed to add storage_deposit:", error);
    }
  }

  async function mintChainKey() {
    try {
      await CK.mint_chain_key(wallet, CHAIN_KEY_CONTRACT);
    } catch (error) {
      console.error("Failed to mint Chain Key:", error)
    }

    getChainKeys();
  }

  async function sendChainKey() {
    try {
      await CK.send_chain_key(wallet, CHAIN_KEY_CONTRACT, tokenId, receiverId);
    } catch (error) {
      console.error("Failed to send Chain Key:", error)
    }

    getChainKeys();
    setTokenId('');
    setReceiverId('');
  }


  return (
    <>

      <div className="container">
        <p> Selected Chain Key: {tokenId} </p>
        <div className="d-flex">
              {chainKeys.map(chainKey => (
                <div key={chainKey} className="mx-1">
                  
                  {<button className="btn btn-outline-primary" onClick={() => setTokenId(chainKey)}><div>
                    {chainKey}
                    </div>
                  </button> }

                </div>
              ))}
        </div>
      </div>

    <div className="container mt-2">
      <div className="d-flex justify-content-around mb-3">
        <button className="btn btn-primary btn-sm me-2" style={{ width: '200px' }} onClick={() => payStorage()}>Pay Chain Key storage deposit</button>
        <button className="btn btn-primary btn-sm" style={{ width: '200px' }} onClick={() => mintChainKey()}>Mint new Chain Key</button>
      </div>
    </div>

    <div className="row mb-3">
      <label className="col-sm-2 col-form-label col-form-label-sm">Account:</label>
      <div className="col-sm-10 d-flex align-items-center">
        <input type="text" className="form-control form-control-sm me-2" value={receiverId} onChange={handleChange} style={{ width: 'auto', flex: '1' }} />
        <button className="btn btn-primary" onClick={() => sendChainKey()} style={{ whiteSpace: 'nowrap' }}>Send Chain Key</button>
      </div>
    </div>

    </>

  )
}

ChainKeyView.propTypes = {
  props: PropTypes.shape({
    CHAIN_KEY_CONTRACT: PropTypes.string.isRequired,
  }).isRequired
};
