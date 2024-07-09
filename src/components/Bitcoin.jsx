import { useState, useEffect, useContext } from "react";
import { NearContext } from "../context";

import { Bitcoin as Bitcoin } from "../services/bitcoin";
import { useDebounce } from "../hooks/debounce";
import PropTypes from 'prop-types';

const BTC_NETWORK = 'testnet';
const BTC = new Bitcoin('https://blockstream.info/testnet/api', BTC_NETWORK);

export function BitcoinView({ props: { setStatus, NFT_CONTRACT, transactionHash } }) {
  const { wallet, signedAccountId, tokenId, setTokenId } = useContext(NearContext);

  const [receiver, setReceiver] = useState("tb1q86ec0aszet5r3qt02j77f3dvxruk7tuqdlj0d5");
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("request");
  const [signedTransaction, setSignedTransaction] = useState(null);
  const [senderAddress, setSenderAddress] = useState("")
  const [senderPK, setSenderPK] = useState("")

  const [derivation, setDerivation] = useState("bitcoin-1");
  const derivationPath = useDebounce(derivation, 500);

  useEffect(() => {
    // Only called if using web wallet
    if (transactionHash != null && sessionStorage.getItem('chain') == "BTC") {
      resetParams();
      handleCallback();
    }
  }, [transactionHash]);

  // Reset params to before asking for signature if using web wallet
  async function resetParams() {
    try {
    const args = await wallet.getTransactionArgs(transactionHash);
    setTokenId(args.token_id);
    setDerivation(args.path);
    setAmount(sessionStorage.getItem('amount'));
    } catch (e) {
      setStatus(`❌ Error: ${e.message}`);
    }
  }

    // Handles the rest of the signature method if using web wallet
  async function handleCallback() {
    try {
      setLoading(true);
      const signedTransaction = await BTC.requestSignatureFromNFTCallback(wallet, transactionHash);
      setSignedTransaction(signedTransaction);
      setStatus(`✅ Signed payload ready to be relayed to the Ethereum network`);
      setStep('relay');
      setLoading(false);
    } catch (e) {
      setStatus(`❌ Error: ${e.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    setSenderAddress('Waiting for you to stop typing...')
  }, [derivation]);

  useEffect(() => {
    if (tokenId == '') {
      setSenderAddress('Select NFT');
    } else {
      setBtcAddress()
    }

    async function setBtcAddress() {
      setStatus('Querying your address and balance');
      setSenderAddress(`Deriving address from path ${derivationPath}...`);

      const { address, publicKey } = await BTC.deriveAddress(NFT_CONTRACT, derivationPath, tokenId);
      setSenderAddress(address);
      setSenderPK(publicKey);

      const balance = await BTC.getBalance(address);
      setStatus(`Your Bitcoin address is: ${address}, balance: ${balance} satoshi`);
    }
  }, [signedAccountId, derivationPath, tokenId]);

  async function chainSignature() {
    setStatus('🏗️ Creating transaction');
    const payload = await BTC.createPayload(senderAddress, receiver, amount);

    setStatus('🕒 Asking MPC to sign the transaction, this might take a while...');
    try {
      const signedTransaction = await BTC.requestSignatureFromNFT(wallet, tokenId, NFT_CONTRACT, derivationPath, payload, senderPK);
      console.log(signedTransaction)
      setStatus('✅ Signed payload ready to be relayed to the Bitcoin network');
      setSignedTransaction(signedTransaction);
      setStep('relay');
    } catch (e) {
      setStatus(`❌ Error: ${e.message}`);
      setLoading(false);
    }
  }

  async function relayTransaction() {
    setLoading(true);
    setStatus('🔗 Relaying transaction to the Bitcoin network... this might take a while');

    try {
      const txHash = await BTC.relayTransaction(signedTransaction);
      setStatus(
        <>
          <a href={`https://blockstream.info/testnet/tx/${txHash}`} target="_blank"> ✅ Successful </a>
        </>
      );
    } catch (e) {
      setStatus(`❌ Error: ${e.message}`);
    }

    setStep('request');
    setLoading(false);
    window.history.pushState({}, '', window.location.origin);
  }

  const UIChainSignature = async () => {
    setLoading(true);
    await chainSignature();
    setLoading(false);
  }

  return (
    <>
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label col-form-label-sm">Path:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control form-control-sm" value={derivation} onChange={(e) => setDerivation(e.target.value)} disabled={loading} />
          <div className="form-text" id="eth-sender"> {senderAddress} </div>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label col-form-label-sm">To:</label>
        <div className="col-sm-10">
          <input type="text" className="form-control form-control-sm" value={receiver} onChange={(e) => setReceiver(e.target.value)} disabled={loading} />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-2 col-form-label col-form-label-sm">Amount:</label>
        <div className="col-sm-10">
          <input type="number" className="form-control form-control-sm" value={amount} onChange={(e) => setAmount(e.target.value)} step="1" disabled={loading} />
          <div className="form-text"> satoshi units </div>
        </div>
      </div>

      <div className="text-center">
        {step === 'request' && <button className="btn btn-primary text-center" onClick={UIChainSignature} disabled={loading}> Request Signature </button>}
        {step === 'relay' && <button className="btn btn-success text-center" onClick={relayTransaction} disabled={loading}> Relay Transaction </button>}
      </div>
    </>
  )
}

BitcoinView.propTypes = {
  props: PropTypes.shape({
    setStatus: PropTypes.func.isRequired,
    NFT_CONTRACT: PropTypes.string.isRequired,
  }).isRequired
};