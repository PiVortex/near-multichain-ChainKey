export class NFTClass {
    
    async get_NFTs(wallet, contractId, account_id) {

        const result = await wallet.viewMethod({
            contractId,
            method: 'nft_tokens_for_owner',
            args: { account_id },
        });
    
        const tokenIds = result.map(item => item.token_id);
        return tokenIds;
    }

    async mint_NFT(wallet, contractId) {
        const storageMethod = {
            method: 'storage_deposit',
            deposit: '20000000000000000000000'
        };
        const mintMethod = {
            method: 'mint'
        };
        const methods = [storageMethod, mintMethod]

        await wallet.callMultipleMethods({
            contractId,
            methods
        })
    }

    async send_NFT(wallet, contractId, token_id, receiver_id) {
        await wallet.callMethod({
            contractId,
            method: 'nft_transfer',
            args: { token_id, receiver_id },
            deposit: '1'
        });
    }

}