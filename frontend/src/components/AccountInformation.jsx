import React from "react";
import logoBNC from "../assets/logo-BNC.svg";
import { useWeb3Context } from "./Web3Context";

function AccountInformation() {
  const { connectMetaMask, disconnectMetaMask, address, accounts } =
    useWeb3Context();
  return (
    <div className="flex-auto basis-1/3 h-full bg-white m-1 rounded-lg shadow-xl sticky top-5">
      <div className="flex flex-col p-2">
        <h1 className="text-2xl font-bold text-center uppercase">
          account information
        </h1>
        <hr className="border-gray-400 mt-2" />
        <div className="flex gap-2 mt-4 items-center ">
          <img src={logoBNC} alt="logo BNC" className="w-8 h-8" />
          <h1 className="font-bold">{address}</h1>
        </div>
        
        <div className="flex gap-2 mt-3 bg-slate-400 px-1 py-1 rounded-lg">
          <h1 className="font-bold">Token A :</h1>
        </div>
        <div className="flex gap-2 mt-3 bg-slate-400 px-1 py-1 rounded-lg">
          <h1 className="font-bold">NFTB :</h1>
        </div>
        <div className="flex gap-2 mt-3 bg-slate-400 px-1 py-1 rounded-lg">
          <h1 className="font-bold ">Base APR :</h1>
        </div>
        <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-6">
          Faucet 1M Token A
        </button>
      </div>
    </div>
  );
}

export default AccountInformation;
