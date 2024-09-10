import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IconTokenERC20 from "../assets/tokenERC20.svg";
import { convertDate, convertNumber } from "../convert/convertData";
import StakingNFTBInfomation from "./StakingNFTBInfomation";
function StakingInformation({
  signer,
  ethers,
  contractHandleProvider,
  contractHandleSigner,
  tokenERC20ContractSigner,
  contractHandlerAddress,
  onReload,
  reloadData,
}) {
  const [amountTokenADeposit, setAmountTokenADeposit] = useState(0);
  const [checkLoadData, setCheckLoadData] = useState(false);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingClaimReward, setLoadingClaimReward] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [timeReload, setTimeReload] = useState(false);

  const [balanceOfTokenAAccount, setBalanceOfTokenAAccount] = useState(0);

  //get staking information
  const [totalAmountTokenADeposit, setTotalAmountTokenADeposit] = useState(0);
  const [timeDeposit, setTimeDeposit] = useState("");
  const [APR, setAPR] = useState(0);
  const [bonusAPR, setBonusAPR] = useState(0);
  const [rewardTokenADeposit, setRewardTokenADeposit] = useState(0);
  const [lockTime, setLockTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  //fetch data
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
      const timeDeposit = stakingInfo?.startTimeDeposit.toString();
      setTimeDeposit(timeDeposit);

      //set APR
      const _apr =
        Number((await contractHandleProvider.baseAPR()).toString() / 100) +
        Number(stakingInfo?.bonusAPR.toString() / 100);

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
      //set lock time
      const lock = await contractHandleProvider.lockTime();
      setLockTime(Number(lock.toString()));
      //set time left
      const _timeLeft = getTimeLockLeft(timeDeposit, Number(lock.toString()));
      setTimeLeft(_timeLeft);
    } catch (error) {
      console.error("fetchData StakingInformation", error);
    }
  };
  //check load data
  useEffect(() => {
    if (!(contractHandleProvider, signer)) {
      return;
    }
    setCheckLoadData(false);
    fetchData().then(() => {
      setCheckLoadData(true);
    });
  }, [contractHandleProvider, signer, reloadData]);
  //check amout token A deposit
  useEffect(() => {
    if (!checkLoadData) {
      return;
    }
    try {
      if (amountTokenADeposit <= 0) {
        setAmountTokenADeposit(0);
      } else if (amountTokenADeposit > balanceOfTokenAAccount) {
        setAmountTokenADeposit(Math.floor(balanceOfTokenAAccount));
      }
    } catch (error) {
      console.error(error);
    }
  }, [amountTokenADeposit, checkLoadData]);
  //check time lock withdraw
  useEffect(() => {
    if (!checkLoadData) {
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [checkLoadData]);
  // 5s sẽ hiển thị lãi
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
  //deposit token A
  const depositTokenA = async () => {
    const amount = ethers.utils
      .parseEther(amountTokenADeposit.toString())
      .toString();
    setLoadingDeposit(true);
    const deposit = async () => {
      try {
        const approve = await tokenERC20ContractSigner.approve(
          contractHandlerAddress,
          amount
        );
        await approve.wait();
        const gasEstimate = await contractHandleSigner.estimateGas.depositERC20(
          amount
        );
        const deposit = await contractHandleSigner.depositERC20(amount, {
          gasLimit: gasEstimate,
        });
        await deposit.wait();

        onReload();
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoadingDeposit(false);
      }
    };
    toast.promise(deposit(), {
      pending: "Depositing...",
      success: "Deposit success",
      error: "Deposit error",
    });
  };
  const getReward = async () => {
    const getReward = await contractHandleSigner.getCurrentRewardERC20();
    return ethers.utils.formatEther(getReward);
  };
  const claimReward = async () => {
    setLoadingClaimReward(true);
    const claim = async () => {
      try {
        const number = await contractHandleSigner.calculateRewardERC20();
        if (number <= 0) {
          throw new Error("No reward to claim");
        }
        const tx = await contractHandleSigner.claimRewardERC20();
        await tx.wait();
        onReload();
      } catch (error) {
        console.log(error);
        throw new Error("cannel claim reward");
      } finally {
        setLoadingClaimReward(false);
      }
    };
    toast.promise(claim(), {
      pending: "Claiming...",
      success: "Claim success",
      error: "Claim error",
    });
  };

  const withdrawTokenA = async () => {
    setLoadingWithdraw(true);
    const withdraw = async () => {
      try {
        const tx = await contractHandleSigner.withdrawRewardERC20();
        await tx.wait();
        onReload();
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoadingWithdraw(false);
      }
    };
    toast.promise(withdraw(), {
      pending: "Withdrawing...",
      success: "Withdraw success",
      error: "Withdraw error",
    });
  };
  const getTimeLockLeft = (timeDeposit, lockTime) => {
    const timeLock = Number(timeDeposit) + Number(lockTime); // Tổng thời gian khóa
    const timeNow = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
    const timeLeft = timeLock - timeNow; // Tính thời gian còn lại
    if (timeLeft > 0) {
      return timeLeft;
    }
    return 0;
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
                {!loadingWithdraw ? (
                  totalAmountTokenADeposit <= 0 ? (
                    <button
                      className="basis-1/2 bg-gray-500 py-2 rounded-lg text-white font-bold"
                      disabled
                    >
                      Withdraw
                    </button>
                  ) : timeLeft > 0 ? (
                    <button
                      className="basis-1/2 bg-gray-500 py-2 rounded-lg text-white font-bold"
                      disabled
                    >
                      Withdraw in {timeLeft}
                    </button>
                  ) : (
                    <button
                      className="basis-1/2 bg-blue-500 hover:bg-blue-700 py-2 rounded-lg text-white font-bold"
                      onClick={withdrawTokenA}
                    >
                      Withdraw
                    </button>
                  )
                ) : (
                  <button
                    className="basis-1/2 bg-gray-500 py-2 rounded-lg text-white"
                    disabled
                  >
                    Withdraw
                  </button>
                )}
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
                  !loadingDeposit ? (
                    <button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 rounded-lg py-1 px-2 text-white"
                      onClick={depositTokenA}
                    >
                      Deposit token A
                    </button>
                  ) : (
                    <button
                      className="bg-gray-500 rounded-lg py-1 px-2 text-white"
                      disabled
                    >
                      Deposit token A
                    </button>
                  )
                ) : (
                  <button
                    className="bg-gray-500 rounded-lg py-1 px-2 text-white"
                    disabled
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
          <StakingNFTBInfomation
            signer={signer}
            contractHandleProvider={contractHandleProvider}
            contractHandleSigner={contractHandleSigner}
            tokenERC20ContractSigner={tokenERC20ContractSigner}
            ethers={ethers}
            contractHandlerAddress={contractHandlerAddress}
            onReload={onReload}
            reloadData={reloadData}
          />
        </div>
      </div>
    </div>
  );
}
export default StakingInformation;
