import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

export interface token_data {
    connection: any; // Replace with the actual type if known
    wallet: any; // Replace with the actual type if known
    token_name: string;
    token_symbol: string;
    token_supply: number;
    token_img: string;
}

export interface CreateTokenData {
    mint_address: string;
    token_address: string;
    token_name: string;
    token_symbol: string;
    token_supply: number;
    token_img: string;
}



export async function create_token(data: token_data) {

    const connection = data.connection;
    const wallet = data.wallet;

    const mintKeypair = Keypair.generate();

    const token_supply = data.token_supply * 1000000000;

    const metadata = {
        mint: mintKeypair.publicKey,
        name: data.token_name,
        symbol: data.token_symbol,
        uri: data.token_img,
        additionalMetadata: [],
    };

    console.log('metadata: ', data);


    const mintLen = getMintLen([ExtensionType.MetadataPointer]);

    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata as any).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    console.log("metadata: ", metadata.name, metadata.symbol, metadata.uri);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey || mintKeypair.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey || mintKeypair.publicKey, null, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name: metadata?.name || "",
            symbol: metadata?.symbol || "",
            uri: metadata?.uri || "",
            mintAuthority: wallet.publicKey || mintKeypair.publicKey,
            updateAuthority: wallet.publicKey || mintKeypair.publicKey,
        }),
    );
    console.log("Transaction created: ", transaction);

    transaction.feePayer = wallet.publicKey || mintKeypair.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);

    const lol = await wallet.sendTransaction(transaction, connection);
    console.log("Transaction sent: ", lol);
    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

    const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey || mintKeypair.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
    );

    console.log('associatedToken: ', associatedToken.toBase58());

    const transaction2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            wallet.publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID,
        ),
    );

    await wallet.sendTransaction(transaction2, connection);

    console.log("transaction2 sent: ", transaction2);
    console.log("Associated Token created: ", associatedToken);

    const transaction3 = new Transaction().add(
        createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey || mintKeypair.publicKey, token_supply , [], TOKEN_2022_PROGRAM_ID)
    );

    await wallet.sendTransaction(transaction3, connection);

    console.log("Transaction created: ", transaction3);

    const token_details : CreateTokenData = {
        mint_address: mintKeypair.publicKey.toBase58(),
        token_address: associatedToken.toBase58(),
        token_name: data.token_name,
        token_symbol: data.token_symbol,
        token_supply: data.token_supply,
        token_img: data.token_img,
    };

    console.log("Token_details: ", token_details);

    // Save token details to local storage
    const existing = JSON.parse(localStorage.getItem("Token_details") || "[]");

    existing.push(token_details); // Append new token to the array

    localStorage.setItem("Token_details", JSON.stringify(existing));


    return {
        mint: mintKeypair.publicKey.toBase58(),
        associatedToken: associatedToken.toBase58(),
        transaction: transaction3
    };
}

