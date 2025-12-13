
"use client";

import { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";


// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  // const network = process.env.NEXT_PUBLIC_SOLANA_DEVNET as string;
  // const network = process.env.NEXT_PUBLIC_SOLANA_TESTNET || "http://127.0.0.1:8899";
  const network = process.env.NEXT_PUBLIC_SOLANA_DEVNET || "https://solana-devnet.g.alchemy.com/v2/vNiyuieL-QhxDchV_hvLz";

  // Debug log to verify endpoint
  console.log("WalletContextProvider using endpoint:", network);

  const endpoint = useMemo(() => network, [network]);


  const wallets = useMemo(
    () => [],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};