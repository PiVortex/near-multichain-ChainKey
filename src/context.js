import { createContext } from 'react';

/**
 * @typedef NearContext
 * @property {import('./services/near-wallet').Wallet} wallet Current wallet
 * @property {string} signedAccountId The AccountId of the signed user
 * @property {string} tokenId The NFTId selected
 * @property {(nftId: string) => void} setTokenId Function to set the selected NFT ID
 */

/** @type {import ('react').Context<NearContext>} */
export const NearContext = createContext({
  wallet: undefined,
  signedAccountId: '',
  tokenId: '',
  setTokenId: () => {}
});