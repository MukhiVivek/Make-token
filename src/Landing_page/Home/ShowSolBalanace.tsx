import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const ShowSolBalance: React.FC = () => {

    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();

    const [balance, setBalance] = useState<number>(0.00);

    async function getBalance() { 
        if (publicKey){
            const balance = await connection.getBalance(publicKey);
            setBalance(balance / LAMPORTS_PER_SOL);
        }
    }
    
    getBalance();

    return (
        <>
            {publicKey && connected ? (
                <>{(balance * 151).toFixed(2)}</>
            ) : (
                <p>Wallet not connected</p>
            )}
        </>
    );
};

export { ShowSolBalance };