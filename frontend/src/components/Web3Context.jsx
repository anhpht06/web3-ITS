import React, { createContext, useCallback, useContext } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectMetaMask = async () => {
    const BNC_CHAIN_ID = "0x61";
    if (window.ethereum) {
      try {
        if (window.ethereum) {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== BNC_CHAIN_ID) {
            toast.error("Please switch to the BNC network!");
          } else {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const accounts = await provider.listAccounts();

            setAccounts(accounts[0]);
            setAddress(address);
            setProvider(provider);
            setSigner(signer);

            localStorage.setItem("isMetaMaskConnected", true);
            toast.success("Connect to MetaMask successfully");
          }
        }
      } catch (error) {
        toast.error("Error connecting MetaMask");
        console.error("Error connecting MetaMask:", error);
      }
    } else {
      toast.error("Please install metamask");
    }
  };

  const disconnectMetaMask = () => {
    localStorage.setItem("isMetaMaskConnected", false);
    setAccounts([]);
    setAddress(null);
    setProvider(null);
    setSigner(null);
  };

  useEffect(() => {
    const isMetaMaskConnected = localStorage.getItem("isMetaMaskConnected");
    if (isMetaMaskConnected === "true") {
      connectMetaMask();
    } else if (isMetaMaskConnected === "false") {
      toast.error("Please connect MetaMask");
    }
  }, []);

  useEffect(() => {
    const BNC_CHAIN_ID = "0x61";
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        disconnectMetaMask();
      });

      window.ethereum.on("chainChanged", () => {
        if (window.ethereum) {
          try {
            if (window.ethereum) {
              const chainId = window.ethereum.chainId;
              if (chainId !== BNC_CHAIN_ID) {
                disconnectMetaMask();
                toast.error("Please switch to the BNC network!");
              }
            }
          } catch (error) {
            toast.error("Error connecting MetaMask");
            console.error("Error connecting MetaMask:", error);
          }
        } else {
          toast.error("Please install metamask");
        }
      });
    }
  }, [disconnectMetaMask]);

  return (
    <Web3Context.Provider
      value={{
        connectMetaMask,
        disconnectMetaMask,
        address,
        provider,
        signer,
        accounts,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  return useContext(Web3Context);
}
