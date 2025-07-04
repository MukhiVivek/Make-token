import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Landing_page/Home/Home'
import Navbar from './Landing_page/Navbar/Navbar'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css';
// import Protfolio from './Landing_page/Protfolio/Protfolio'
import { useState } from 'react'
import Airdrop from './Landing_page/Airdrop/Airdrop'
import Token from './Landing_page/Token/Token'
import CreateToken from './Landing_page/Token/CreateToken'

function App() {

  const mainnet_url = "https://solana-mainnet.g.alchemy.com/v2/eR9u-bVEzRBYDcfzrHj3pfEfXhv3A5l1"

  const devnet_url  = "https://solana-devnet.g.alchemy.com/v2/eR9u-bVEzRBYDcfzrHj3pfEfXhv3A5l1"

  const [url, setUrl] = useState(true)

  return (
    <div className='dark:bg-black dark:text-white bg-white text-black h-screen w-screen'>
      <ConnectionProvider endpoint={url ? mainnet_url : devnet_url }>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <Router>
              <Navbar seturl={setUrl}/>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/token" element={<Token />} />
                <Route path="/token-create" element={<CreateToken />} />
                <Route path="/airdrop" element={<Airdrop />} />
              </Routes>
            </Router>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
      
    </div>

  )
}

export default App
