// useFindToken.ts
import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/eR9u-bVEzRBYDcfzrHj3pfEfXhv3A5l1")

async function fetchTokens(wallet: PublicKey) {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
  });

  const tokens = tokenAccounts.value
    .map((account) => {
      const info = account.account.data.parsed.info;
      return {
        mint: info.mint,
        amount: info.tokenAmount.uiAmount || 0,
      };
    })
    .filter((token) => token.amount > 0);

  // Get SOL balance too
  const solBalanceLamports = await connection.getBalance(wallet);
  const solBalance = solBalanceLamports / 1e9;
  tokens.push({
    mint: "So11111111111111111111111111111111111111112", // SOL Mint
    amount: solBalance,
  });

  return tokens;
}

export function useFindToken(walletAddress: string | undefined) {
  const [tokens, setTokens] = useState<
    { mint: string; amount: number }[]
  >([]);

  useEffect(() => {
    const getTokens = async () => {
      try {
        if (walletAddress) {
          const wallet = new PublicKey(walletAddress);
          const result = await fetchTokens(wallet);
          setTokens(result);
        }
      } catch (error) {
        console.error("Failed to fetch token balances", error);
        setTokens([]);
      }
    };

    getTokens();
  }, [walletAddress]);

  return tokens;
}