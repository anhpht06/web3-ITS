import React from "react";
import LoadingAccoutInfo from "./loading/LoadingAccoutInfo";
import StakingInformation from "./StakingInformation";
import AccountInformation from "./AccountInformation";
import { useWeb3Context } from "./Web3Context";

function home() {
  const { connectMetaMask, disconnectMetaMask, address, accounts } =
    useWeb3Context();
  return (
    <div className="flex flex-row h-auto bg-gray-700 p-2 ">
      <StakingInformation />
      {address ? <AccountInformation /> : <LoadingAccoutInfo />}
    </div>
  );
}

export default home;
