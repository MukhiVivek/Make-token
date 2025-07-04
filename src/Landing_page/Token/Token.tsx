import { useEffect, useState } from "react";
import { CreateTokenData } from "./fuction/create_token";
import { Link } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import addSupply from "./fuction/AddSupply";

function TokenList() {
    const [tokens, setTokens] = useState<CreateTokenData[]>([]);
    const [newSupply, setNewSupply] = useState<{ [mint: string]: number }>({});

    const { connection } = useConnection();
    const wallet = useWallet();
    
    useEffect(() => {
        const local = localStorage.getItem("Token_details");
        if (local) {
            const parsed = Object.values(JSON.parse(local)) as CreateTokenData[];
            setTokens(parsed);
        }
    }, []);

    function handleAddSupply (mint_address : any , token_address : any  , wallet : any , connection : any) {
        const amount = newSupply[mint_address];
        if (!amount || amount <= 0) return;

        // Replace this with real minting logic
        console.log(`Minted ${amount} to token: ${mint_address}`);

        addSupply(mint_address , token_address , wallet, connection , amount);

        const updated = tokens.map((t) =>
            t.mint_address === mint_address
                ? { ...t, token_supply: t.token_supply + amount }
                : t
        );
        setTokens(updated);

        localStorage.setItem("Token_details", JSON.stringify(updated));

        setNewSupply((prev) => ({ ...prev, [mint_address]: 0 }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black px-6 py-10 text-black dark:text-white">
            <h1 className="text-4xl font-extrabold text-center mb-10">Your Token Collection</h1>
                <div className="justify-center items-center mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                    {tokens.map((token) => (
                        <div
                            key={token.mint_address}
                            className="rounded-2xl p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black border-2 border-transparent hover:animate-border-rgb shadow-lg hover:shadow-[0_0_15px_3px_rgba(255,0,128,0.6)] transition-shadow duration-500"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {token.token_img ? (
                                    <img
                                        src={token.token_img}
                                        alt={token.token_name}
                                        className="w-14 h-14 rounded-full border border-gray-300"
                                    />
                                ) : (
                                    <div className="w-14 h-14 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
                                        {token.token_symbol.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-bold">{token.token_name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{token.token_symbol}</p>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm break-words">
                                <p><span className="text-gray-500">Mint Address:</span> {token.mint_address}</p>
                                <p><span className="text-gray-500">Token Address:</span> {token.token_address}</p>
                                <p><span className="font-medium text-indigo-600 dark:text-indigo-400">Current Supply:</span> {token.token_supply}</p>
                            </div>

                            <div className="flex items-center gap-2 mt-6">
                                <input
                                    type="number"
                                    placeholder="New Supply"
                                    value={newSupply[token.mint_address] || ""}
                                    onChange={(e) =>
                                        setNewSupply((prev) => ({
                                            ...prev,
                                            [token.mint_address]: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    onClick={() => handleAddSupply(token.mint_address, token.token_address, wallet , connection)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-1"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    ))}
                    <Link
                        to="/token-create"
                        className="cursor-pointer flex flex-col items-center justify-center text-center rounded-2xl p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black border-2 border-transparent hover:animate-border-rgb shadow-lg hover:shadow-[0_0_15px_3px_rgba(255,0,128,0.6)] transition-all duration-500 hover:scale-105"
                    >
                        <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold mb-4">
                            +
                        </div>
                        <h2 className="text-xl font-semibold">Create New Token</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Launch your next token with a few clicks.
                        </p>
                    </Link>
                </div>
        </div>
    );
}

export default TokenList;
