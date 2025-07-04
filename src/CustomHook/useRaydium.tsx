import axios from "axios";
import { useEffect, useState } from "react";

export function useRaydium() {
    const [data , setData] = useState([]);

    async function getData() {
        await axios.get(`https://dynamic-ipfs.raydium.io/clmm/position?id=5nQdSCSGvhYz4axMPJakwpvL4NXNTxJ2FtwHcmJ7beHR`)
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getData()
        let interval = setInterval(() => {
            getData()
        }, 10 * 1000)

        return () => {
            clearInterval(interval);
        }
    }, []);
    
    return {data};
}

