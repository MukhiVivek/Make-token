import { createMintToInstruction, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { Transaction, PublicKey, Connection } from "@solana/web3.js";

async function addSupply(
  mint_address: string | PublicKey,
  token_address: string | PublicKey,
  wallet: any, // Wallet adapter (e.g., useWallet())
  connection: Connection,
  amount: number
) {
  const token_supply = amount * 1e9; // Assuming 9 decimals

  // Convert addresses to PublicKey if needed
  const mintPubKey = typeof mint_address === "string" ? new PublicKey(mint_address) : mint_address;
  const associatedTokenPubKey =
    typeof token_address === "string" ? new PublicKey(token_address) : token_address;

  const transaction = new Transaction().add(
    createMintToInstruction(
      mintPubKey, // mint
      associatedTokenPubKey, // destination
      wallet.publicKey, // authority
      token_supply,
      [], // multisig signers if any
      TOKEN_2022_PROGRAM_ID
    )
  );

  // Send transaction
  const signature = await wallet.sendTransaction(transaction, connection);
  console.log("Transaction Signature: ", signature);

  return {
    mint: mintPubKey.toBase58(),
    associatedToken: associatedTokenPubKey.toBase58(),
    signature,
  };
}

export default addSupply;
