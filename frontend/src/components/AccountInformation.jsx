import React from "react";
import logoBNC from "../assets/logo-BNC.svg";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { convertNumber } from "../convert/convertData";

function AccountInformation({
  signer,
  ethers,
  contractHandleProvider,
  contractHandleSigner,
  reloadData,
  onReload,
}) {
  const [addressAccount, setAddressAccount] = useState("");
  const [totalSupplyTokenA, setTotalSupplyTokenA] = useState(0);
  const [balanceOfTokenAAccount, setBalanceTokenAAccount] = useState(0);
  const [balanceNFTBAccount, setBalanceNFTBAccount] = useState(0);
  const [baseAPR, setBaseAPR] = useState(0);

  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const fetchData = async () => {
    try {
      //get address account
      const address = await signer.getAddress();
      setAddressAccount(address);
      //get total supply token A
      const totalSupply = await ethers.utils.formatEther(
        await contractHandleProvider.balaceOfERC20TotalSupply()
      );
      setTotalSupplyTokenA(convertNumber(totalSupply.toString()));
      //get balance of token A account
      const balance = await ethers.utils.formatEther(
        await contractHandleProvider.balaceOfERC20(address)
      );
      setBalanceTokenAAccount(convertNumber(balance.toString()));
      //get balance of NFT b account
      const balanceNFTAccount = await contractHandleProvider.balaceOfERC721(
        address
      );
      setBalanceNFTBAccount(balanceNFTAccount.toString());
      //get base APR
      const apr = await contractHandleProvider.baseAPR();
      setBaseAPR(apr.toString() / 100);
    } catch (error) {
      console.error("fetchData AccountInformation", error);
    }
  };
  useEffect(() => {
    if (!(contractHandleProvider, signer)) {
      return;
    }
    fetchData();
  }, [signer, contractHandleProvider, reload, reloadData]);

  const faucetTokenA = async (amountFaucetERC20) => {
    const faucet = async () => {
      setLoading(true);
      try {
        const amount = ethers.utils.parseEther(amountFaucetERC20.toString());
        const faucet = await contractHandleSigner.faucetERC20(amount);
        await faucet.wait();
      } catch (error) {
        console.error("Error in faucetTokenA:", error.message || error);
        throw error;
      } finally {
        setLoading(false);
        setReload(!reload);
        onReload();
      }
    };
    toast.promise(faucet(), {
      pending: "Fauceting...",
      success: "Faucet success",
      error: "Faucet error",
    });
  };

  return (
    <div className="flex-auto basis-1/3 h-full bg-white m-1 rounded-lg shadow-xl sticky top-5">
      <div className="flex flex-col p-2">
        <h1 className="text-2xl font-bold text-center uppercase">
          account information
        </h1>
        <hr className="border-gray-400 mt-2" />
        {addressAccount ? (
          <div className="flex gap-2 mt-4 items-center ">
            <img src={logoBNC} alt="logo BNC" className="w-8 h-8" />
            <h1 className="font-bold">{addressAccount}</h1>
          </div>
        ) : (
          <div className="flex gap-2 mt-4 items-center animate-pulse px-1 py-1 bg-slate-400 rounded-lg">
            <img src={logoBNC} alt="logo BNC" className="w-8 h-8" />
            <h1 className="font-bold">Loading...</h1>
          </div>
        )}
        {totalSupplyTokenA ? (
          <div className="text-right">
            <h1 className="">Token A left: {totalSupplyTokenA}</h1>
          </div>
        ) : (
          <div className="animate-pulse flex flex-row-reverse">
            <div className="px-1 py-1 bg-slate-400 rounded-lg">
              <h1 className="">Loading...</h1>
            </div>
          </div>
        )}

        {balanceOfTokenAAccount ? (
          <div className="flex gap-2 mt-1 bg-slate-400 px-1 py-1 rounded-lg items-center">
            <h1 className="font-bold">Token A :</h1>
            <h1 className="text-xl font-bold">{balanceOfTokenAAccount}</h1>
          </div>
        ) : (
          <div className="flex gap-2 mt-1 bg-slate-500 px-1 py-1 rounded-lg items-center animate-pulse">
            <h1 className="font-bold">Loading...</h1>
            <h1 className="text-xl font-bold"></h1>
          </div>
        )}
        {balanceNFTBAccount ? (
          <div className="flex gap-2 mt-3 bg-slate-400 px-1 py-1 rounded-lg items-center ">
            <h1 className="font-bold">NFTB :</h1>
            <h1 className="text-xl font-bold">{balanceNFTBAccount}</h1>
          </div>
        ) : (
          <div className="flex gap-2 mt-3 bg-slate-500 px-1 py-1 rounded-lg items-center animate-pulse">
            <h1 className="font-bold">Loading...</h1>
          </div>
        )}
        {baseAPR ? (
          <div className="flex gap-2 mt-3 bg-slate-400 px-1 py-1 rounded-lg items-center">
            <h1 className="font-bold ">Base APR :</h1>
            <h1 className="text-xl font-bold">{baseAPR} %</h1>
          </div>
        ) : (
          <div className="flex gap-2 mt-3 bg-slate-500 px-1 py-1 rounded-lg items-center animate-pulse">
            <h1 className="font-bold ">Loading...</h1>
          </div>
        )}

        {!loading ? (
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={() => {
              faucetTokenA(5000000);
            }}
          >
            Faucet 5M Token A
          </button>
        ) : (
          <button
            className="bg-gray-500  text-white font-bold py-2 px-4 rounded mt-6"
            disabled
          >
            Faucet 5M Token A
          </button>
        )}
      </div>
    </div>
  );
}

export default AccountInformation;
