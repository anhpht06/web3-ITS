import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IconTokenERC20 from "../assets/tokenERC20.svg";
function StakingInformation({
  provider,
  signer,
  address,
  ethers,
  contractHandleProvider,
  contractHandleSigner,
  tokenAIsStaked,
  NFTIsStaked,
  balanceOfTokenAAccount,
}) {
  const [baseAPR, setBaseAPR] = useState(0);
  const [aprBonus, setAprBonus] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [timeDeposit, setTimeDeposit] = useState("");
  const [amoutTokenADeposit, setAmoutTokenADeposit] = useState(0);
  const depositTokenA = async () => {
    console.log("amout:::", Number(amoutTokenADeposit));
  };

  useEffect(() => {
    try {
      if (amoutTokenADeposit <= 0) {
        setAmoutTokenADeposit(0);
      } else if (amoutTokenADeposit > Number(balanceOfTokenAAccount)) {
        setAmoutTokenADeposit(Number(balanceOfTokenAAccount));
      }
    } catch (error) {}
  }, [amoutTokenADeposit, balanceOfTokenAAccount]);
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
              <h1 className="text-2xl font-bold">Token A Staked</h1>
              <div className="flex gap-4 mt-2 items-center">
                <img
                  src={IconTokenERC20}
                  alt="tonken ERC20"
                  className="w-6 h-6 "
                />
                <h1 className="text-xl">{tokenAIsStaked}</h1>
              </div>
              <div className="flex gap-4 mt-3">
                <h1 className="basis-32 ">Time Deposit</h1>
                <h1 className="basis-2/3 ">22/33/2024</h1>
              </div>
            </div>

            <div className="flex flex-col  rounded-md h-auto p-4 bg-gray-400">
              <div className="flex gap-4 ">
                <h1 className="basis-32 ">APR</h1>
                <h1 className="basis-2/3 ">{baseAPR} %</h1>
              </div>
              <div className="flex gap-4   mt-2">
                <h1 className="basis-32 ">APR bonus</h1>
                <h1 className="basis-2/3 ">{aprBonus} %</h1>
              </div>
              <div className="flex gap-4  mt-2">
                <h1 className="basis-32 ">Reward</h1>
                <h1 className="basis-2/3 ">{rewards} token A</h1>
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
                {amoutTokenADeposit > 0 ? (
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700  rounded-lg py-1 px-2 text-white"
                    onClick={depositTokenA}
                  >
                    Deposit token A
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-500   rounded-lg py-1 px-2 text-white"
                    // onClick={depositTokenA}
                  >
                    Deposit token A
                  </button>
                )}
                <input
                  className="border-2 rounded-lg px-2"
                  type="number"
                  placeholder="0"
                  value={amoutTokenADeposit || ""}
                  onChange={(e) => setAmoutTokenADeposit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold mt-6">
            <div className="flex flex-col  ">
              <div className="flex flex-col p-4 ">
                <h1 className="text-2xl font-bold">NFT B Staked</h1>
                <div className="flex gap-2 mt-2 text-xl">
                  <h1 className="">{NFTIsStaked}</h1>
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
