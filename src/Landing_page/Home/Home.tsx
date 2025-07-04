import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

const Home = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenMap, setTokenMap] = useState<Record<string, any>>({});

  // Step 1: Load token list once
  useEffect(() => {
    const fetchTokenList = async () => {
      const res = await axios.get(
        "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
      );
      const list = res.data.tokens;

      const map: Record<string, any> = {};
      list.forEach((token: any) => {
        map[token.address] = token;
      });

      setTokenMap(map);
    };

    fetchTokenList();
  }, []);

  // Step 2: Load wallet token balances
  useEffect(() => {
    const fetchBalanceAndTokens = async () => {
      if (connected && publicKey) {
        // Get SOL balance
        const solBalance = await connection.getBalance(publicKey);
        setBalance(solBalance / 1e9);

        // Get token balances
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        const fetchedTokens = tokenAccounts.value
          .map((acc) => {
            const info = acc.account.data.parsed.info;
            const amount = info.tokenAmount.uiAmount || 0;
            return {
              mint: info.mint,
              amount,
            };
          })
          .filter((t) => t.amount > 0);

        // Add SOL manually
        fetchedTokens.push({
          mint: "So11111111111111111111111111111111111111112",
          amount: solBalance / 1e9,
        });

        setTokens(fetchedTokens);
      }
    };

    fetchBalanceAndTokens();
  }, [connected, publicKey]);

  return (
    <div className="min-h-screen px-6 py-8 bg-white dark:bg-black text-gray-900 dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Solana Dashboard</h1>
        </header>

        <section className="dark:bg-black border border-gray-700 p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Wallet Info</h2>
          <p><strong>Address:</strong> {publicKey?.toBase58() || "Not Connected"}</p>
          <p><strong>SOL Balance:</strong> {balance ? balance.toFixed(4) : "0.0000"} SOL</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Your Tokens</h2>
          {tokens.length === 0 ? (
            <p className="text-gray-500">No tokens found or wallet not connected.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokens.map((token, index) => {
                const tokenInfo =
                  token.mint === "So11111111111111111111111111111111111111112"
                    ? { symbol: "SOL", name: "Solana" }
                    : tokenMap[token.mint];

                return (
                  <div
                    key={index}
                    className="p-4 border rounded-xl bg-white dark:bg-black border-gray-700 transition hover:scale-105 duration-300"
                  >
                    <h3 className="font-medium text-lg">{tokenInfo?.name || token.mint.slice(0, 4) + "..."}</h3>
                    <p>Symbol: {tokenInfo?.symbol || "Unknown"}</p>
                    <p>Amount: {token.amount.toFixed(6)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
