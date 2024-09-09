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
    tokenERC20ContractProvider,
    tokenERC20ContractSigner,
    tokenERC721ContractProvider,
    tokenERC721ContractSigner,
    contractHandlerAddress,
    // address,
    // provider,
    // tokenERC20Address,
    // tokenERC721Address,
    // baseAPR,
  } = useWeb3Context();

  const [reload, setReload] = useState(false);
  const handleReload = () => {
    setReload(!reload);
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

          // balanceOfTokenAAccount={balanceOfTokenAAccount}
          // provider={provider}
          // address={address}
          // NFTIsStaked={NFTIsStaked}
          // baseAPR={baseAPR}
        />
      ) : (
        <LoadingStakingInfo />
      )}
      {contractHandleProvider ? (
        <AccountInformation
          signer={signer}
          contractHandleProvider={contractHandleProvider}
          contractHandleSigner={contractHandleSigner}
          ethers={ethers}
          onReload={handleReload}
          reloadData={reload}
        />
      ) : (
        <LoadingAccoutInfo />
      )}
    </div>
  );
}

export default Home;
