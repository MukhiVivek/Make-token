import { useWallet } from "@solana/wallet-adapter-react";
import Walleticon from "../../icons/Walleticon";
import { PieChart } from "@mui/x-charts";
import { useFindToken } from "../../CustomHook/UseFindToken";
import { useTokenMeta } from "../../CustomHook/UseTokenName";
import Price  from "../../TokenPrice/Price";
import { useRaydium } from "../../CustomHook/useRaydium";
import { useState } from "react";

function Protfolio() {



    return (
        <Top />
    )
}

function Top() {

    const { publicKey } = useWallet();

    const tokens = useFindToken(publicKey?.toBase58());

    const tokenname = useTokenMeta()

    const price = Price()

    const ringData = tokens.map((token) => {
        return {
            id: token.mint,
            value: +(token.amount * price[tokenname[token.mint]?.symbol]?.price).toFixed(2),
            label: +(token.amount * price[tokenname[token.mint]?.symbol]?.price).toFixed(5) + tokenname[token.mint]?.symbol,
        };
    });

    const raydiumdata: any = useRaydium()

    const total = ringData.reduce((acc, curr) => acc + curr.value, 0) + raydiumdata.data?.positionInfo?.usdValue;


    return (
        <>
            <div className="flex grid-cols-2 md:grid-cols-2 gap-4 p-4 justify-center">
                <div className="grid grid-cols-[1fr] grid-rows-[repeat(2,1fr)] gap-y-[10px] gap-x-[10px] justify-items-stretch grid-flow-col auto-rows-[auto] content-center">
                    <div className="bg-gray-900 rounded-3xl h-40 w-60 p-4 flex flex-col m-auto">
                        <h1 className=" font-bold flex items-center gap-2"> <Walleticon />  Net worth</h1>
                        <h1 className="text-5xl font-bold text-green-500">$ {(total).toFixed(2)}</h1>
                    </div>
                    <div className="">
                        <div className="bg-gray-900 rounded-3xl h-40 w-60 p-4 flex flex-col ">
                            <h1 className="font-bold">SOL Balance</h1>
                            <h1 className="text-3xl font-bold">$ {}</h1>
                            <h1>~0.00 SOL</h1>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-500 text-white rounded-3xl h-80 w-2xl p-4 flex flex-col justify-between">
                    <div className="">
                        <PieChart series={[{ data: ringData, innerRadius: 70, outerRadius: 110, }]} width={400} height={300} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Protfolio;