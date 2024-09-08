import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IconTokenERC20 from "../assets/tokenERC20.svg";
import { convertData, convertNumber } from "../convert/convertData";

function StakingInformation({
  provider,
  signer,
  address,
  ethers,
  contractHandleProvider,
  contractHandleSigner,
  NFTIsStaked,
  balanceOfTokenAAccount,
  tokenERC20ContractSigner,
  contractHandlerAddress,
  baseAPR,
  onReload,
}) {
  const [reload, setReload] = useState(false);
  const [totalAmountERC20, setTotalAmountERC20] = useState(0);
  const [APR, setAPR] = useState(0);
  const [aprBonus, setAprBonus] = useState(0);
  const [timeDeposit, setTimeDeposit] = useState("");
  const [rewards, setRewards] = useState(0);
  const [withdrawal, setWithdrawal] = useState(0);
  // const [claimReward, setClaimReward] = useState(0);

  const [amoutTokenADeposit, setAmoutTokenADeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingWithdrawal, setLoadingWithdrawal] = useState(false);
  const [loadingClaimReward, setLoadingClaimReward] = useState(false);
  const getStakingInfo = async (address) => {
    if (!contractHandleProvider || !address) {
      console.error("Invalid contractHandleProvider or address");
      return;
    }
    try {
      const stakingInfo = await contractHandleProvider.stakingInfo(address);
      return stakingInfo;
    } catch (error) {
      console.error("Error fetching staking info:", error);
    }
  };
  const fetchAPR = async () => {
    try {
      const currentAPR = await contractHandleProvider.getCurrentAPR();
      setAPR(currentAPR.toString() / 100);
      console.log("currentAPR:::", currentAPR.toString() / 100);
    } catch (error) {
      toast.error(`Error fetching staking info: ${error.message}`);
    }
  };
  useEffect(() => {
    if (!contractHandleProvider) {
      return;
    }

    fetchAPR();
    console.log("object:::", APR);
    // const interval = setInterval(() => {
    //   setReload(!reload);
    // }, 60000);
    // return () => clearInterval(interval);
  }, [contractHandleProvider]);
  useEffect(() => {
    if (!contractHandleProvider || !address) {
      return;
    }

    getStakingInfo(address).then((info) => {
      if (!info) {
        console.error("No staking info found for this address");
        return;
      }

      setTotalAmountERC20(
        convertNumber(ethers.utils.formatEther(info?.totalAmountERC20))
      );
      setAPR(info.APR?.toString() / 100 ?? "N/A");
      setTimeDeposit(
        convertData(Number(info.startTimeDeposit?.toString()) * 1000)
      );
      setRewards(
        convertNumber(ethers.utils.formatEther(info?.totalRewardERC20))
      );

      if (info.APR == 0) {
        setAprBonus(0);
      } else {
        setAprBonus(info.APR?.toString() / 100 - baseAPR);
      }
    });
  }, [reload]);
  const depositTokenA = async () => {
    try {
      setLoading(true);
      const tokenAIsStaked = ethers.utils
        .parseEther(amoutTokenADeposit.toString())
        .toString();

      const txt = await tokenERC20ContractSigner.approve(
        contractHandlerAddress,
        tokenAIsStaked
      );
      await txt.wait();

      const tx = await contractHandleSigner.depositERC20(tokenAIsStaked, {
        gasLimit: 9000000,
      });
      await tx.wait();
      toast.success("Deposit successful");
      setAmoutTokenADeposit(0);
    } catch (error) {
      toast.error("Deposit failed");
      console.error(error);
    } finally {
      setLoading(false);
      onReload();
      setReload(!reload);
    }
  };
  const claimReward = async () => {
    setLoadingClaimReward(true);
    try {
      const tx = await contractHandleSigner.claimRewardERC20();
      await tx.wait();
      toast.success("Withdraw successful");
    } catch (error) {
      console.log(error);
      toast.error("Claim reward failed");
    } finally {
      setLoadingClaimReward(false);
      onReload();
      setReload(!reload);
    }
  };

  const withdraw = async () => {};

  useEffect(() => {
    try {
      if (amoutTokenADeposit <= 0) {
        setAmoutTokenADeposit(0);
      } else if (amoutTokenADeposit > Number(balanceOfTokenAAccount)) {
        setAmoutTokenADeposit(Number(balanceOfTokenAAccount));
      }
    } catch (error) {
      console.error(error);
    }
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
                <h1 className="text-xl">{totalAmountERC20}</h1>
              </div>
              <div className="flex gap-4 mt-3">
                <h1 className="basis-32 ">Time Deposit</h1>
                <h1 className="basis-2/3 ">{timeDeposit}</h1>
              </div>
            </div>

            <div className="flex flex-col  rounded-md h-auto p-4 bg-gray-400">
              <div className="flex gap-4 ">
                <h1 className="basis-32 ">APR</h1>
                <h1 className="basis-2/3 ">{APR} %</h1>
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
                <button
                  className="basis-1/2 bg-blue-500 hover:bg-blue-700  py-2 rounded-lg text-white font-bold "
                  onClick={withdraw}
                >
                  Withdraw
                </button>

                {!loadingClaimReward ? (
                  <button
                    className="basis-1/2 bg-blue-500 hover:bg-blue-700  py-2 rounded-lg text-white"
                    onClick={claimReward}
                  >
                    Claim reward
                  </button>
                ) : (
                  <button
                    className="basis-1/2 bg-blue-700 py-2 rounded-lg text-white"
                    // onClick={claimReward}
                    disabled
                  >
                    Loading...
                  </button>
                )}
              </div>
              <div className="flex gap-4 mt-4 ">
                {amoutTokenADeposit > 0 ? (
                  <>
                    {!loading ? (
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700  rounded-lg py-1 px-2 text-white"
                        onClick={depositTokenA}
                      >
                        Deposit token A
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="bg-blue-500   rounded-lg py-1 px-2 text-white"
                        // onClick={depositTokenA}
                      >
                        Loading...
                      </button>
                    )}
                  </>
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
                  pattern="[-+]?[0-9]*[.,]?[0-9]+"
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
