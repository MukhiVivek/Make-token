import { useRaydium } from "../CustomHook/useRaydium";

function Price() {

    const RaydiumData : any = useRaydium()

    const price: any = {
        SOL: {
            price: RaydiumData?.data?.poolInfo?.price,
        },
        USDC: {
            price: 1.0,
        },
        RAY: {
            price: 3.08,
        },
    };
    return price;
}

export default Price;
