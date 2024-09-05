import React from "react";
import logoBNC from "../assets/logo-BNC.svg";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import numeral from "numeral";

function AccountInformation({
  provider,
  signer,
  address,
  contractHandleProvider,
  contractHandleSigner,
  baseAPR,
  ethers,
  balanceOfTokenAAccount,
  balanceNFTBAccount,
  totalSupplyTokenA,
  onReload,
}) {
  const [balanceOfTokenAAccountFormatted, setBalanceOfTokenAAccountFormatted] =
    useState(balanceOfTokenAAccount);
  const [loading, setLoading] = useState(false);
  const [nftBAmount, setNftBAmount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const formattedNumber = numeral(balanceOfTokenAAccount).format(
          "0,0.00"
        );

        setBalanceOfTokenAAccountFormatted(formattedNumber);
        console.log("object::", formattedNumber);
      } catch (error) {}
    };
    fetch();
  }, [balanceOfTokenAAccount]);
  const faucetTokenA = async (amountFaucetERC20) => {
    setLoading(true);
    try {
      // Gửi giao dịch
      const amount = ethers.utils.parseEther(amountFaucetERC20.toString());

      const tx = await contractHandleSigner.faucetERC20(amount);
      // // Chờ giao dịch hoàn thành
      await tx.wait();

      console.log(`Transaction successful! Tx Hash: ${tx.hash}`);
    } catch (error) {
      console.log(error);
      console.error("Error in faucetTokenA:", error.message || error);
      toast.error("foucet failed");
      setLoading(false);
    } finally {
      setLoading(false);
      toast.success("foucet successful!");
      onReload();
    }
  };
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
        {totalSupplyTokenA ? (
          <div className="text-right">
            <h1 className="">Token A left: {totalSupplyTokenA}</h1>
          </div>
        ) : (
          <div className="animate-pulse  flex flex-row-reverse">
            <div className="px-1 py-1 bg-slate-400 rounded-lg">
              <h1 className="">Token A left:</h1>
            </div>
          </div>
        )}

        {balanceOfTokenAAccount ? (
          <div className="flex gap-2 mt-1 bg-slate-400 px-1 py-1 rounded-lg items-center">
            <h1 className="font-bold">Token A :</h1>
            <h1 className="text-xl font-bold">
              {balanceOfTokenAAccountFormatted}
            </h1>
          </div>
        ) : (
          <div className="flex gap-2 mt-1 bg-slate-500 px-1 py-1 rounded-lg items-center animate-pulse">
            <h1 className="font-bold">Token A :</h1>
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
            <h1 className="font-bold">NFTB :</h1>
            <h1 className="text-xl font-bold">{balanceNFTBAccount}</h1>
          </div>
        )}
        {baseAPR ? (
          <div className="flex gap-2 mt-3 bg-slate-400 px-1 py-1 rounded-lg items-center">
            <h1 className="font-bold ">Base APR :</h1>
            <h1 className="text-xl font-bold">{baseAPR} %</h1>
          </div>
        ) : (
          <div className="flex gap-2 mt-3 bg-slate-500 px-1 py-1 rounded-lg items-center animate-pulse">
            <h1 className="font-bold ">Base APR :</h1>
            <h1 className="text-xl font-bold">{baseAPR} %</h1>
          </div>
        )}

        {loading ? (
          <button className="bg-blue-700  text-white font-bold py-2 px-4 rounded mt-6">
            Loading...
          </button>
        ) : (
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={() => {
              faucetTokenA(5000000);
            }}
          >
            Faucet 5M Token A
          </button>
        )}
      </div>
    </div>
  );
}

export default AccountInformation;
