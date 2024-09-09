import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IconTokenERC20 from "../assets/tokenERC20.svg";
import { convertDate, convertNumber } from "../convert/convertData";

function StakingInformation({
  signer,
  ethers,
  contractHandleProvider,
  contractHandleSigner,
  tokenERC20ContractSigner,
  contractHandlerAddress,
  onReload,
  reloadData,
  // provider,
  // address,
  // NFTIsStaked,
  // balanceOfTokenAAccount,
  // baseAPR,
}) {
  const [amountTokenADeposit, setAmountTokenADeposit] = useState(0);
  const [formatAmountTokenADeposit, setFormatAmountTokenADeposit] = useState(0);
  const [checkLoadData, setCheckLoadData] = useState(false);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingClaimReward, setLoadingClaimReward] = useState(false);
  const [timeReload, setTimeReload] = useState(false);

  const [balanceOfTokenAAccount, setBalanceOfTokenAAccount] = useState(0);

  //get staking information
  const [totalAmountTokenADeposit, setTotalAmountTokenADeposit] = useState(0);
  const [timeDeposit, setTimeDeposit] = useState("");
  const [APR, setAPR] = useState(0);
  const [bonusAPR, setBonusAPR] = useState(0);
  const [rewardTokenADeposit, setRewardTokenADeposit] = useState(0);

  const fetchData = async () => {
    setRewardTokenADeposit(0);
    setTotalAmountTokenADeposit(0);
    setTimeDeposit(0);
    setAPR(0);
    setBonusAPR(0);
    try {
      //get address account
      const addressAccount = await signer.getAddress();
      //get mapping staking infomation
      const stakingInfo = await contractHandleProvider.stakingInfo(
        addressAccount
      );
      //set total amount token A deposit
      setTotalAmountTokenADeposit(
        convertNumber(ethers.utils.formatEther(stakingInfo?.totalAmountERC20))
      );
      //set time deposit
      setTimeDeposit(stakingInfo?.startTimeDeposit.toString());

      //set APR
      const _apr =
        (await contractHandleProvider.getCurrentAPR()).toString() / 100;
      setAPR(_apr);
      //set bonus APR
      setBonusAPR(stakingInfo?.bonusAPR.toString() / 100 || "0");
      //set balance of token A account
      const balance = await ethers.utils.formatEther(
        await contractHandleProvider.balaceOfERC20(addressAccount)
      );
      setBalanceOfTokenAAccount(Number(balance));
      //
      setAmountTokenADeposit(0);
      //set reward token A deposit
      setRewardTokenADeposit(convertNumber(await getReward()));
    } catch (error) {
      console.error("fetchData StakingInformation", error);
    }
  };

  useEffect(() => {
    if (!(contractHandleProvider, signer)) {
      return;
    }
    setCheckLoadData(false);
    fetchData().then(() => {
      setCheckLoadData(true);
    });
  }, [contractHandleProvider, signer, reloadData]);

  useEffect(() => {
    if (!checkLoadData) {
      return;
    }
    try {
      if (amountTokenADeposit <= 0) {
        setAmountTokenADeposit(0);
      } else if (amountTokenADeposit > balanceOfTokenAAccount) {
        setAmountTokenADeposit(balanceOfTokenAAccount);
      }
    } catch (error) {
      console.error(error);
    }
  }, [amountTokenADeposit, checkLoadData]);

  // 5s sẽ hiển thị lãi
  const getReward = async () => {
    const getReward = await contractHandleSigner.getCurrentRewardERC20();
    return ethers.utils.formatEther(getReward);
  };
  useEffect(() => {
    if (!checkLoadData) {
      return;
    }
    if (timeDeposit === "0") {
      setRewardTokenADeposit("0");
      return;
    }
    const interval = setInterval(() => {
      setTimeReload(!timeReload);
      getReward().then((reward) => {
        const rewardTokenA = convertNumber(reward.toString());
        if (rewardTokenA <= 0) {
          setRewardTokenADeposit("0");
          clearInterval(interval);
          return;
        }
        setRewardTokenADeposit(rewardTokenA);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [checkLoadData, rewardTokenADeposit]);
  const depositTokenA = async () => {
    const amout = await ethers.utils
      .parseEther(amountTokenADeposit.toString())
      .toString();
    const deposit = async () => {
      try {
        setLoadingDeposit(true);
        const approve = await tokenERC20ContractSigner.approve(
          contractHandlerAddress,
          amout
        );
        await approve.wait();
        const depo = await contractHandleSigner.depositERC20(amout);
        await depo.wait();
      } catch (error) {
        console.error("Error in depositTokenA:", error.message || error);
        throw error;
      } finally {
        setLoadingDeposit(false);
        onReload();
      }
    };

    toast.promise(deposit(), {
      pending: "Depositing...",
      success: "Deposit success",
      error: "Deposit error",
    });
  };
  const claimReward = async () => {
    setLoadingClaimReward(true);

    try {
      const number = await contractHandleSigner.calculateRewardERC20();
      const claim = async () => {
        if (number <= 0) {
          throw new Error("No reward to claim");
        }
        const tx = await contractHandleSigner.claimRewardERC20();
        await tx.wait();
        onReload();
      };

      await toast.promise(claim(), {
        pending: "Claiming...",
        success: "Claim success",
        error: {
          render({ data }) {
            return ` ${data.message || data}`;
          },
        },
      });
    } catch (error) {
      console.warn("Error while claiming reward:", error);
    } finally {
      setLoadingClaimReward(false);
    }
  };


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

              {totalAmountTokenADeposit ? (
                <div className="flex gap-4 mt-2 items-center">
                  <img
                    src={IconTokenERC20}
                    alt="tonken ERC20"
                    className="w-6 h-6 "
                  />
                  <h1 className="text-xl">{totalAmountTokenADeposit}</h1>
                </div>
              ) : (
                <div className="flex gap-4 mt-2 items-center px-1 py-1 bg-slate-400 rounded-lg w-max">
                  <img
                    src={IconTokenERC20}
                    alt="tonken ERC20"
                    className="w-6 h-6 "
                  />
                  <h1 className="text-xl px-1 py-1 bg-slate-400 rounded-lg">
                    Loading...
                  </h1>
                </div>
              )}
              {timeDeposit ? (
                <div className="flex gap-4 mt-3">
                  <h1 className="basis-32 ">Time Deposit</h1>
                  <h1 className="basis-2/3 ">
                    {convertDate(Number(timeDeposit) * 1000)}
                  </h1>
                </div>
              ) : (
                <div className="flex gap-4 mt-3">
                  <h1 className="basis-32 ">Time Deposit</h1>
                  <h1 className="text-xl px-1 py-1 bg-slate-400 rounded-lg">
                    Loading...
                  </h1>
                </div>
              )}
            </div>

            <div className="flex flex-col  rounded-md h-auto p-4 bg-gray-400">
              {APR ? (
                <div className="flex gap-4 ">
                  <h1 className="basis-32 ">APR</h1>
                  <h1 className="basis-2/3 ">{APR} %</h1>
                </div>
              ) : (
                <div className="flex gap-4 ">
                  <h1 className="basis-32 ">APR</h1>
                  <h1 className=" px-1 py-1 bg-gray-500 rounded-lg w-max ">
                    Loading...
                  </h1>
                </div>
              )}
              {bonusAPR ? (
                <div className="flex gap-4   mt-2">
                  <h1 className="basis-32 ">APR bonus</h1>
                  <h1 className="basis-2/3 ">{bonusAPR} %</h1>
                </div>
              ) : (
                <div className="flex gap-4   mt-2">
                  <h1 className="basis-32 ">APR bonus</h1>
                  <h1 className=" px-1 py-1 bg-gray-500 rounded-lg w-max ">
                    Loading...
                  </h1>
                </div>
              )}
              {rewardTokenADeposit ? (
                <div className="flex gap-4  mt-2">
                  <h1 className="basis-32 ">Reward</h1>
                  <h1 className="basis-2/3 ">{rewardTokenADeposit} token A</h1>
                </div>
              ) : (
                <div className="flex gap-4  mt-2">
                  <h1 className="basis-32 ">Reward</h1>
                  <h1 className=" px-1 py-1 bg-gray-500 rounded-lg w-max ">
                    Loading...
                  </h1>
                </div>
              )}
            </div>
            <div className="flex flex-col  rounded-lg h-auto p-4  mt-1">
              <div className="flex gap-4">
                <button
                  className="basis-1/2 bg-blue-500 hover:bg-blue-700  py-2 rounded-lg text-white font-bold "
                  // onClick={withdraw}
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
                    className="basis-1/2 bg-gray-500 py-2 rounded-lg text-white"
                    disabled
                  >
                    Claim reward
                  </button>
                )}
              </div>
              <div className="flex gap-4 mt-4 ">
                {amountTokenADeposit > 0 ? (
                  <>
                    {!loadingDeposit ? (
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700  rounded-lg py-1 px-2 text-white"
                        onClick={depositTokenA}
                      >
                        Deposit token A
                      </button>
                    ) : (
                      <button
                        className="bg-gray-500  rounded-lg py-1 px-2 text-white"
                        type="button"
                        disabled
                      >
                        Deposit token A
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
                  placeholder="0"
                  value={amountTokenADeposit || ""}
                  onChange={(e) => setAmountTokenADeposit(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold mt-6">
            <div className="flex flex-col  ">
              <div className="flex flex-col p-4 ">
                <h1 className="text-2xl font-bold">NFT B Staked</h1>
                <div className="flex gap-2 mt-2 text-xl">
                  <h1 className="">{}</h1>
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
