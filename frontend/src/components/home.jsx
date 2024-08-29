import React from "react";
import StakingInformation from "./StakingInformation";
import AccountInformation from "./AccountInformation";
import LoadingAccoutInfo from "./loading/LoadingAccoutInfo";
import { useWeb3Context } from "./Web3Context";

function home() {
  const {
    provider,
    signer,
    address,
    contractHandleProvider,
    contractHandleSigner,
  } = useWeb3Context();

  return (
    <div className="flex flex-row h-auto bg-gray-700 p-2 ">
      <StakingInformation
        provider={provider}
        signer={signer}
        address={address}
        contractHandleProvider={contractHandleProvider}
        contractHandleSigner={contractHandleSigner}
      />

      {address ? (
        <AccountInformation
          provider={provider}
          signer={signer}
          address={address}
          contractHandleProvider={contractHandleProvider}
          contractHandleSigner={contractHandleSigner}
        />
      ) : (
        <LoadingAccoutInfo />
      )}
    </div>
  );
}

export default home;
