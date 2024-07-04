export class ChainKey {
    
    async get_chain_keys(wallet, contractId, account_id) {

        const result = await wallet.viewMethod({
            contractId,
            method: 'nft_tokens_for_owner',
            args: { account_id },
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

    async mint_chain_key(wallet, contractId) {
        await wallet.callMethod({
            contractId,
            method: 'mint',
        });
    }

    async send_chain_key(wallet, contractId, token_id, receiver_id) {
        await wallet.callMethod({
            contractId,
            method: 'nft_transfer',
            args: { token_id, receiver_id },
            deposit: '1'
        });
    }

}