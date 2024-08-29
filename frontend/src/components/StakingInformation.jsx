import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "./Web3Context";
import IconTokenERC20 from "../assets/tokenERC20.svg";
function StakingInformation() {
  const [amoutERC20, setAmoutERC20] = useState(0);
  return (
    <div className="basis-2/3 h-full bg-white m-1 rounded-lg shadow-xl">
      <div className="flex flex-col p-2">
        <h1 className="text-2xl font-bold text-center uppercase">
          staking information
        </h1>
        <hr className="border-gray-400 mt-2" />
        <div className="flex flex-col p-2 mt-2">
          <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold">
            <div className="flex flex-col p-4 ">
              <h1 className="text-xl font-bold">TokenERC20 Staked</h1>
              <div className="flex gap-4 mt-2 ">
                <img
                  src={IconTokenERC20}
                  alt="tonken ERC20"
                  className="w-6 h-6 "
                />
                <h1 className="">{amoutERC20}</h1>
              </div>
              <div className="flex gap-4 mt-3">
                <h1 className="basis-32 ">Lock time</h1>
                <h1 className="basis-2/3 ">22/33/2024</h1>
              </div>
            </div>

            <div className="flex flex-col  rounded-md h-auto p-4 bg-gray-400">
              <div className="flex gap-4 ">
                <h1 className="basis-32 ">APR</h1>
                <h1 className="basis-2/3 ">8%</h1>
              </div>
              <div className="flex gap-4   mt-2">
                <h1 className="basis-32 ">APR bonus</h1>
                <h1 className="basis-2/3 ">2%</h1>
              </div>
              <div className="flex gap-4  mt-2">
                <h1 className="basis-32 ">Reward</h1>
                <h1 className="basis-2/3 ">3000</h1>
              </div>
            </div>
            <div className="flex flex-col  rounded-lg h-auto p-4  mt-1">
              <div className="flex gap-4">
                <button className="basis-1/2 bg-blue-500 hover:bg-blue-700  py-2 rounded-lg text-white font-bold ">
                  Reward
                </button>
                <button className="basis-1/2 bg-blue-500 hover:bg-blue-700  py-2 rounded-lg text-white">
                  Claim reward
                </button>
              </div>
              <div className="flex gap-4 mt-4 ">
                <button className="bg-blue-500 hover:bg-blue-700  rounded-lg py-1 px-2 text-white">
                  Deposit token A
                </button>
                <input
                  className="border-2 rounded-lg px-2"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold mt-6">
            <div className="flex flex-col  ">
              <div className="flex flex-col p-4 ">
                <h1 className="text-xl font-bold">NFTB Staked</h1>
                <div className="flex gap-4 mt-2 ">
                  <h1 className="">{amoutERC20}</h1>
                  <h1>NFT-B</h1>
                </div>
              </div>
              <div className="flex flex-col  rounded-lg h-auto p-3">
                <div className="flex gap-4 ">
                  <button className="bg-blue-500 hover:bg-blue-700  rounded-lg py-1 px-2 text-white">
                    Deposit token B
                  </button>
                  <input
                    className="border-2 rounded-lg px-2"
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakingInformation;
