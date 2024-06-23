export class NFTChainKey {
    
    async get_NFTs(wallet, contractId, accountId) {

        const result = await wallet.viewMethod({
            contractId,
            method: 'nft_tokens_for_owner',
            args: { account_id: accountId},
        });
    
        const tokenIds = result.map(item => item.token_id);
        return tokenIds;
    }

    async add_storage_deposit(wallet, contractId) {
        await wallet.callMethod({
            contractId,
            method: 'storage_deposit',
            deposit: '100000000000000000000000'
        });
    }

    async mint_NFT(wallet, contractId) {
        await wallet.callMethod({
            contractId,
            method: 'mint',
        });
    }

}