import React, { createContext, useCallback, useContext } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import contractHandler from "../contracts/ContractHandle.json";
const Web3Context = createContext();
const BNC_CHAIN_ID = "0x61";
export function Web3Provider({ children }) {
  const contractHandlerAddress = contractAddress.contractHandle;

  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contractHandleProvider, setContractHandleProvider] = useState(null);
  const [contractHandleSigner, setContractHandleSigner] = useState(null);

  const connectMetaMask = async () => {
    console.log("connectMetaMask: ");

    if (!window.ethereum) {
      toast.error("Please install MetaMask");
      return;
    }

    try {
      // Tắt để test trên localhost khi deploy
      // const chainId = await window.ethereum.request({ method: "eth_chainId" });
      // if (chainId !== BNC_CHAIN_ID || chainId !== localhost_id) {
      //   toast.error("Please switch to the BNC network!");
      //   return;
      // }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractHandleProvider = new ethers.Contract(
        contractHandlerAddress,
        contractHandler.abi,
        provider
      );
      const signer = provider.getSigner();
      const contractHandleSigner = contractHandleProvider.connect(signer);
      const address = await signer.getAddress();
      const accounts = await provider.listAccounts();

      setAccounts(accounts[0]);
      setAddress(address);
      setProvider(provider);
      setSigner(signer);
      setContractHandleProvider(contractHandleProvider);
      setContractHandleSigner(contractHandleSigner);

      localStorage.setItem("isMetaMaskConnected", true);
      toast.success("Connect to MetaMask successfully");
    } catch (error) {
      toast.error("Error connecting MetaMask");
      console.error("Error connecting MetaMask:", error);
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
    const fetch = () => {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectMetaMask();
        } else {
          connectMetaMask();
        }
      };

      const handleChainChanged = async () => {
        if (window.ethereum) {
          try {
            const chainId = await window.ethereum.request({
              method: "eth_chainId",
            });
            if (chainId !== BNC_CHAIN_ID) {
              disconnectMetaMask();
              toast.error("Please switch to the BNC network!");
            }
          } catch (error) {
            toast.error("Error connecting MetaMask");
            console.error("Error connecting MetaMask:", error);
          }
        } else {
          toast.error("Please install metamask");
        }
      };

      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      }
    };

    fetch();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        connectMetaMask,
        disconnectMetaMask,
        address,
        provider,
        signer,
        accounts,
        contractHandleProvider,
        contractHandleSigner,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  return useContext(Web3Context);
}
