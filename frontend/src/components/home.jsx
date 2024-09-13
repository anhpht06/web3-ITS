import React, { useEffect, useState } from "react";
import StakingInformation from "./StakingInformation";
import AccountInformation from "./AccountInformation";
import LoadingAccoutInfo from "./loading/LoadingAccoutInfo";
import LoadingStakingInfo from "./loading/LoadingStakingInformation";
import { useWeb3Context } from "./Web3Context";

function Home() {
  const {
    signer,
    ethers,
    contractHandleProvider,
    contractHandleSigner,
    tokenERC20ContractSigner,
    tokenERC721ContractProvider,
    tokenERC721ContractSigner,
    contractHandlerAddress,
    tokenERC721Address,
  } = useWeb3Context();

  const [reload, setReload] = useState(false);
  const handleReload = () => {
    setReload(!reload);
    // console.log(object)
  };
  return (
    <div className="flex flex-row h-auto bg-gray-700 p-2 ">
      {contractHandleProvider ? (
        <StakingInformation
          signer={signer}
          contractHandleProvider={contractHandleProvider}
          contractHandleSigner={contractHandleSigner}
          tokenERC20ContractSigner={tokenERC20ContractSigner}
          ethers={ethers}
          onReload={handleReload}
          contractHandlerAddress={contractHandlerAddress}
          reloadData={reload}
        />
      ) : (
        <LoadingStakingInfo />
      )}
      {contractHandleProvider ? (
        <AccountInformation
          signer={signer}
          contractHandleProvider={contractHandleProvider}
          contractHandleSigner={contractHandleSigner}
          tokenERC721ContractSigner={tokenERC721ContractSigner}
          contractHandlerAddress={contractHandlerAddress}
          ethers={ethers}
          onReload={handleReload}
          reloadData={reload}
          tokenERC721Address={tokenERC721Address}
        />
      ) : (
        <LoadingAccoutInfo />
      )}
    </div>
  );
}

export default Home;
