import {  useState } from "react";
import { create_token } from "./fuction/create_token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

function CreateToken() {

    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenSupply, setTokenSupply] = useState("");
    const [tokenImg, setTokenImg] = useState("");

    const { connection } = useConnection();
    const wallet = useWallet();

    let token_data: any = {
        connection: connection,
        wallet: wallet,
        token_name: tokenName,
        token_symbol: tokenSymbol,
        token_supply: parseInt(tokenSupply),
        token_img: tokenImg,
    };

    console.log('token_data: ', token_data);

    return (

        <div className="flex justify-center items-center  ">
            <div className="w-110 justify-self-center   p-4 flex flex-col">
                <label className="block mb-3 text-xl">Token Name :</label>
                <input
                    type="text"
                    placeholder="Ex : Solana"
                    onChange={(e) => setTokenName(e.target.value)}
                    value={tokenName}
                    className="w-100 mb-3 border border-gray-300 px-4 py-2 rounded-2xl"
                />
                <label className="block mb-2 text-xl">Token Symbol :</label>
                <input
                    type="text"
                    placeholder="Ex : SOL"
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    value={tokenSymbol}
                    className="w-100 mb-3 border border-gray-300 px-4 py-2 rounded-2xl"
                />
                <label className="block mb-2 text-xl">Token Initial Supply :</label>
                <input
                    type="text"
                    placeholder="Ex : 1000"
                    onChange={(e) => setTokenSupply(e.target.value)}
                    value={tokenSupply}
                    className="w-100 mb-3 border border-gray-300 px-4 py-2 rounded-2xl"
                />
                <label className="block mb-2 text-xl">Token Img Url :</label>
                <input
                    type="text"
                    onChange={(e) => setTokenImg(e.target.value)}
                    value={tokenImg}
                    placeholder="Ex : www.img.com/123"
                    className="w-100 mb-7 border border-gray-300 px-4 py-2 rounded-2xl"
                />

                <button
                    className="m-auto w-40 cursor-pointer bg-blue-500 hover:bg-blue-700!important text-white text-sm font-bold py-2 px-4 rounded-3xl"
                    onClick={() => create_token(token_data)}
                >
                    Create Token
                </button>
            </div>
        </div>
    );
}

export default CreateToken;