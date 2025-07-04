import {  useConnection, useWallet } from "@solana/wallet-adapter-react";
// import Searchicon from "../../icons/Searchicon";
import ThreeLine from "../../icons/ThreeLine";
import ConnectButton from "./ConnectButton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type NavbarProps = {
  seturl: React.Dispatch<React.SetStateAction<boolean>>;
};

function Navbar({ seturl }: NavbarProps) {

    const { connection } = useConnection(); // Solana RPC connection
  const { publicKey } = useWallet();     // Wallet adapter
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1_000_000_000); // Convert lamports to SOL
      }
    };
    fetchBalance();

    if (!publicKey) {
        setBalance(0); // Reset balance if no public key is available
    }
        
  }, [publicKey, connection]);

    return (
        <div>
            <div className="flex justify-between items-center w-screen  h-16   mb-2 text-ls border-gray-500 border-b  text-white">
                <div className="flex items-center gap-6 ">
                    <div className="text-3xl">
                        <ThreeLine />
                    </div>
                    <Link rel="stylesheet" to="/home">
                    <div className="">
                        <h1>Home</h1>
                    </div>
                    </Link>
                    <Link rel="stylesheet" to="/airdrop">
                    <div className="">
                        <h1>Airdrop</h1>
                    </div>
                    </Link>
                    <Link rel="stylesheet" to="/token">
                    <div className="">
                        Your Token
                    </div>
                    </Link>

                </div>
                <div className="flex justify-self-start  ">
                    <div className="text-2xl  border border-gray-800 hover:bg-gray-900 bg-gray-950 rounded-3xl p-2 flex items-center">
                        {/* <div className="mx-1 text-gray-500 ">
                            <Searchicon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for anything"
                            className="bg-transparent border-none outline-none w-full h-full pl-2 text-white"
                        />
                        <div className="flex items-center justify-center w-6 h-6 mr-1 rounded bg-gray-700 text-white">
                            /
                        </div> */}
                        <h1 className="">Balance : {balance?.toFixed(3)} SOL</h1>
                    </div>
                </div>
                <div className="flex mr-2">
                    {/* <div 
                onClick={ConnectButton}
                className="bg-blue-500 hover:bg-blue-700!important text-white text-sm font-bold py-2 px-4 rounded-3xl">
            
                </div> */}

                    <select 
                        name="" 
                        id="" 
                        className="border-gray-600 border-1 rounded-xl p-3 mx-3"
                        onChange={(e) => seturl(e.target.value === "main")}
                        >
                        <option value="main" >MainNet</option>
                        <option value="Dev" >DevNet</option>
                    </select>

                
                    <ConnectButton />
                </div>
            </div>
        </div>
    );
}



export default Navbar;