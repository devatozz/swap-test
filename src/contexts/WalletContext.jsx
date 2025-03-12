// src/contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const currentAccount = useCurrentAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (currentAccount) {
      setIsConnected(true);
      setWalletAddress(currentAccount.address);
    } else {
      setIsConnected(false);
      setWalletAddress("");
    }
  }, [currentAccount]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        currentAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
