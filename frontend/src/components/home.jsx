import React, { useEffect, useState } from "react";
import StakingInformation from "./StakingInformation";
import AccountInformation from "./AccountInformation";
import LoadingAccoutInfo from "./loading/LoadingAccoutInfo";
import LoadingStakingInfo from "./loading/LoadingStakingInformation";
import { useWeb3Context } from "./Web3Context";
import numeral from "numeral";

function Home() {
  const {
    provider,
    signer,
    address,
    contractHandleProvider,
    contractHandleSigner,
    tokenERC20ContractProvider,
    tokenERC20ContractSigner,
    tokenERC721ContractProvider,
    tokenERC721ContractSigner,
    contractHandlerAddress,
    tokenERC20Address,
    tokenERC721Address,
    baseAPR,
    ethers,
  } = useWeb3Context();

  const [totalSupplyTokenA, setTotalSupplyTokenA] = useState(0);
  const [reload, setReload] = useState(false);
  const [balanceOfTokenAAccount, setBalanceTokenAAccount] = useState(0);
  const [balanceNFTBAccount, setBalanceNFTBAccount] = useState(0);
  const [NFTIsStaked, setNFTIsStaked] = useState(0);
  // console.log("Homeeeee", contractHandleProvider);
  useEffect(() => {
    const fetch = async () => {
      if (contractHandleProvider && address) {
        //get balance of token A account
        const balance = await ethers.utils.formatEther(
          await contractHandleProvider.balaceOfERC20(address)
        );
        setBalanceTokenAAccount(balance);

        //get balance of NFT b account
        const balanceNFTAccount = await contractHandleProvider.balaceOfERC721(
          address
        );
        setBalanceNFTBAccount(balanceNFTAccount.toString());
        //get balance of NFT b is staked
        const balanceNFTBAccountIsStaked =
          await contractHandleProvider.balaceOfERC721(contractHandlerAddress);
        setNFTIsStaked(Number(balanceNFTBAccountIsStaked));
        //get total supply token A
        const totalSupply = await ethers.utils.formatEther(
          await contractHandleProvider.balaceOfERC20TotalSupply()
        );
        const formattedNumberTotalSupply = numeral(
          totalSupply.toString()
        ).format("0,0.00");
        setTotalSupplyTokenA(formattedNumberTotalSupply);
      }
    };

    fetch();
  }, [contractHandleProvider, address, reload]);
  const handleReload = () => {
    setReload(!reload);
  };
  return (
    <div className="flex flex-row h-auto bg-gray-700 p-2 ">
      {address ? (
        <StakingInformation
          provider={provider}
          signer={signer}
          address={address}
          ethers={ethers}
          contractHandleProvider={contractHandleProvider}
          contractHandleSigner={contractHandleSigner}
          NFTIsStaked={NFTIsStaked}
          balanceOfTokenAAccount={balanceOfTokenAAccount}
          tokenERC20ContractSigner={tokenERC20ContractSigner}
          contractHandlerAddress={contractHandlerAddress}
          onReload={handleReload}
          baseAPR={baseAPR}
        />
      ) : (
        <LoadingStakingInfo />
      )}
      {address ? (
        <AccountInformation
          provider={provider}
          signer={signer}
          address={address}
          contractHandleProvider={contractHandleProvider}
          contractHandleSigner={contractHandleSigner}
          baseAPR={baseAPR}
          ethers={ethers}
          balanceOfTokenAAccount={balanceOfTokenAAccount}
          balanceNFTBAccount={balanceNFTBAccount}
          totalSupplyTokenA={totalSupplyTokenA}
          onReload={handleReload}
        />
      ) : (
        <LoadingAccoutInfo />
      )}
    </div>
  );
}

export default Home;
