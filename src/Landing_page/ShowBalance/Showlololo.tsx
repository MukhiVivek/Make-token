import axios from "axios";
import { useEffect, useState } from "react";

function ShowSomeUSDT() {
    const [balance, setBalance] = useState(0);

    async function getBalance() {
        await axios.get("https://dynamic-ipfs.raydium.io/clmm/position?id=7a5gz4iKmpkf3uQb63xP5PhBpmvhkEoPADtL1mUUpnh")
            .then((res) => {
                //@ts-ignore
                setBalance(res.data.positionInfo.unclaimedFee.usdValue);
                // console.log("Balance", res.data);
            }).catch((err) => {
                console.log("Error fetching balance", err);
            });
    }

    useEffect(() => {
        getBalance();

        let interval = setInterval(() => {
            getBalance();
        }, 5 * 1000);

        return () => clearInterval(interval);
    }, [])

    return { balance };
}

export default ShowSomeUSDT;