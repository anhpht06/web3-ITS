import React, { createContext, useCallback, useContext } from "react";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";

import contractAddress from "../contracts/contract-address.json";
import contractHandler from "../contracts/ContractHandle.json";
import tokenERC20 from "../contracts/TokenERC20.json";
import tokenERC721 from "../contracts/TokenERC721.json";

const Web3Context = createContext();
const BNC_CHAIN_ID = "0x61";
export function Web3Provider({ children }) {
  const contractHandlerAddress = contractAddress.contractHandle;
  const tokenERC20Address = contractAddress.tokenERC20;
  const tokenERC721Address = contractAddress.tokenERC721;

  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);

  const [contractHandleProvider, setContractHandleProvider] = useState(null);
  const [contractHandleSigner, setContractHandleSigner] = useState(null);
  const [tokenERC20ContractSigner, setTokenERC20ContractSigner] =
    useState(null);
  const [tokenERC20ContractProvider, setTokenERC20ContractProvider] =
    useState(null);
  const [tokenERC721ContractProvider, setTokenERC721ContractProvider] =
    useState(null);
  const [tokenERC721ContractSigner, setTokenERC721ContractSigner] =
    useState(null);

  const [baseAPR, setBaseAPR] = useState(0);

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
      const signer = provider.getSigner();

      const contractHandleProvider = new ethers.Contract(
        contractHandlerAddress,
        contractHandler.abi,
        provider
      );

      const contractHandleSigner = new ethers.Contract(
        contractHandlerAddress,
        contractHandler.abi,
        signer
      );

      const tokenERC20ContractSigner = new ethers.Contract(
        tokenERC20Address,
        tokenERC20.abi,
        signer
      );

      const tokenERC20ContractProvider = new ethers.Contract(
        tokenERC20Address,
        tokenERC20.abi,
        provider
      );

      const tokenERC721ContractProvider = new ethers.Contract(
        tokenERC721Address,
        tokenERC721.abi,
        provider
      );

      const tokenERC721ContractSigner = new ethers.Contract(
        tokenERC721Address,
        tokenERC721.abi,
        signer
      );

      setContractHandleProvider(contractHandleProvider);
      setContractHandleSigner(contractHandleSigner);

      setTokenERC20ContractSigner(tokenERC20ContractSigner);
      setTokenERC20ContractProvider(tokenERC20ContractProvider);

      setTokenERC721ContractProvider(tokenERC721ContractProvider);
      setTokenERC721ContractSigner(tokenERC721ContractSigner);

      const address = await signer.getAddress();
      const accounts = await provider.listAccounts();

      const apr = await contractHandleProvider.baseAPR();
      console.log("object:::", apr.toString());
      setBaseAPR(apr.toString() / 100);

      setAccounts(accounts);
      setAddress(address);
      setProvider(provider);
      setSigner(signer);

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
        tokenERC20ContractProvider,
        tokenERC20ContractSigner,
        tokenERC721ContractProvider,
        tokenERC721ContractSigner,
        contractHandlerAddress,
        tokenERC20Address,
        tokenERC721Address,
        baseAPR,
        ethers,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3Context() {
  return useContext(Web3Context);
}
