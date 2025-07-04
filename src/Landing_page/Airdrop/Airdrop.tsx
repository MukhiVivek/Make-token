import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";

function Airdrop() {
  const { publicKey } = useWallet();
  const [claimed, setClaimed] = useState(false);
  const { connection } = useConnection();

  const handleAirdropClaim = () => {
    if (publicKey) {
      // Trigger your airdrop logic here (backend / blockchain call)
      airdrop();
      setClaimed(true);
    } else {
      alert("Please connect your wallet to claim.");
    }
  };

  function airdrop() {
    connection.requestAirdrop(publicKey as PublicKey, 100000000);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-10 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">🎁 Solana Airdrop</h1>
        <p className="text-center text-gray-700 dark:text-gray-300">
          Claim your free tokens instantly. Connect your wallet and hit the button below!
        </p>

        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl text-sm break-words text-center">
          <strong>Wallet:</strong><br />
          {publicKey ? publicKey.toBase58() : "Not connected"}
        </div>

        <button
          className={`w-full py-3 text-lg font-semibold rounded-xl transition-all ${
            claimed
              ? "bg-green-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
          onClick={handleAirdropClaim}
          disabled={claimed}
        >
          {claimed ? "✅ Claimed" : "🚀 Claim Airdrop"}
        </button>

        {claimed && (
          <div className="text-center text-green-500 font-medium">
            Congratulations! Tokens have been sent to your wallet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Airdrop;
