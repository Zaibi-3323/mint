import React, { FC, useMemo,useEffect } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
// import WalletTest from "./TestComponentFile";
import WalletTest from './newCompFile';
import {countActions} from './redux/actions/action'
import { useSelector } from 'react-redux'
import {useDispatch} from 'react-redux'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientComponent } from "./sokcketTest";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      // new SolflareWalletAdapter({ network }),
      // new TorusWalletAdapter(),
      // new LedgerWalletAdapter(),
      // new SolletWalletAdapter({ network }),
      // new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );
  const disptach=useDispatch();
  
  const counter = useSelector((state:any) => state.count)
  
  useEffect(()=>{
    console.log(counter,"count");
  },[counter])

  return (
    <>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>Minting panel</div>
          <WalletTest />
          
          <ClientComponent />
        </WalletModalProvider>
      </WalletProvider>
      
    </ConnectionProvider>
    {/* ////////Routing//////// */}
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        </Route>
      </Routes>
    </BrowserRouter> */}

    {/* ///////////////////// */}
    </>
  );
};
export default App;
