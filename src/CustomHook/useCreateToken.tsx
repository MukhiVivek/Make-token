import { Keypair , SystemProgram, Transaction } from "@solana/web3.js";
import { CreateTokenProps } from "../types/CreateTokenProps";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"

function useCreateToken({token_name, token_symbol, token_decimal, token_supply, token_img} : CreateTokenProps) {

    const { connection } = useConnection();
    const wallet = useWallet();

    async function createToken() {
        
        const mintKeypair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey || mintKeypair.publicKey, 
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey || mintKeypair.publicKey, wallet.publicKey || mintKeypair.publicKey, TOKEN_PROGRAM_ID)
        );
            
        transaction.feePayer = wallet.publicKey || mintKeypair.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

         await wallet.sendTransaction(transaction, connection);
        
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
    }
createToken()
    return ( 
            1
     );
}

export default useCreateToken;