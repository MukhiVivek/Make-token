import { useRef } from "react";
import { create_token } from "./fuction/create_token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

function CreateToken() {

    const token_name = useRef<HTMLInputElement>(null);
    const token_symbol = useRef<HTMLInputElement>(null);
    const token_supply = useRef<HTMLInputElement>(null);
    const token_img = useRef<HTMLInputElement>(null);

    const { connection } = useConnection();
    const wallet = useWallet();

    let token_data: any = {
        connection: connection,
        wallet: wallet,
        token_name: token_name.current?.value ,
        token_symbol: token_symbol.current?.value ,
        token_supply: parseInt(token_supply.current?.value ?? ""),
        token_img: token_img.current?.value ,
    };

    console.log('token_data: ', token_data);
    
    return (

        <div className="flex justify-center items-center  ">
            <div className="w-110 justify-self-center   p-4 flex flex-col">
                <label className="block mb-3 text-xl">Token Name :</label>
                <input
                    type="text"
                    placeholder="Ex : Solana"
                    ref={token_name}
                    className="w-100 mb-3 border border-gray-300 px-4 py-2 rounded-2xl"
                />
                <label className="block mb-2 text-xl">Token Symbol :</label>
                <input
                    type="text"
                    placeholder="Ex : SOL"
                    ref={token_symbol}
                    className="w-100 mb-3 border border-gray-300 px-4 py-2 rounded-2xl"
                />
                <label className="block mb-2 text-xl">Token Initial Supply :</label>
                <input
                    type="text"
                    placeholder="Ex : 1000"
                    ref={token_supply}
                    className="w-100 mb-3 border border-gray-300 px-4 py-2 rounded-2xl"
                />
                <label className="block mb-2 text-xl">Token Img Url :</label>
                <input
                    type="text"
                    ref={token_img}
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