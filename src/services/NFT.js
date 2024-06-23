export class NFTChainKey {
    
    async get_NFTs(wallet, contractId, accountId) {

        const result = await wallet.viewMethod({
            contractId,
            method: "nft_tokens_for_owner",
            args: { account_id: accountId},
        });
    
        const tokenIds = result.map(item => item.token_id);
        return tokenIds;
    }

}