import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function StakingNFTBInfomation({
  signer,
  ethers,
  contractHandleProvider,
  contractHandleSigner,
  tokenERC20ContractSigner,
  contractHandlerAddress,
  onReload,
  reloadData,
}) {
  const [checkLoadData, setCheckLoadData] = useState(false);
  const [listNFTB, setListNFTB] = useState([]);
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);

  const fetchData = async () => {
    setListNFTB([]);
    setSelectedNFTs([]);
    try {
      //get address account
      const addressAccount = await signer.getAddress();

      const stakingInfo = await contractHandleProvider.getStakingInfo(
        addressAccount
      );
      // setListNFTB(listNFTB);
      setListNFTB(stakingInfo?.tokenId);
    } catch (error) {
      console.log(error);
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

  const withdrawNFTB = async () => {
    if (!selectedNFTs.length > 0) return;
    setLoadingWithdraw(true);
    const withdraw = async () => {
      try {
        const gasEstimate =
          await contractHandleSigner.estimateGas.withRewardNFTB(selectedNFTs);
        const tx = await contractHandleSigner.withRewardNFTB(selectedNFTs, {
          gasLimit: gasEstimate,
        });
        console.log("LLL", gasEstimate), await tx.wait();
        onReload();
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setLoadingWithdraw(false);
        setSelectedNFTs([]);
      }
    };
    toast.promise(withdraw(), {
      pending: "Withdrawing...",
      success: "Withdraw success",
      error: "Withdraw error",
    });
  };

  const cancelDepositNFTB = async () => {
    setSelectedNFTs([]);
  };

  const handleNFTClick = (nft) => {
    if (nft == null) return;
    setSelectedNFTs((prevSelected) => {
      if (prevSelected.includes(nft)) {
        return prevSelected.filter((item) => item !== nft);
      } else {
        return [...prevSelected, nft];
      }
    });
  };
  return (
    <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold mt-6">
      <div className="flex flex-col  ">
        <div className="flex flex-col m-4 ">
          <h1 className="text-2xl font-bold">NFT B Staked</h1>

          <div className="flex flex-col rounded-lg h-auto mt-3">
            <div>
              {checkLoadData ? (
                listNFTB.length > 0 ? (
                  <div>
                    <div className="mt-4 flex gap-2 cursor-pointer">
                      {listNFTB?.map((nft) => {
                        const isSelected = selectedNFTs.includes(
                          nft.toString()
                        );
                        return (
                          <div
                            key={nft.toString()}
                            className={`flex gap-4 border-2 rounded p-2 cursor-pointer ${
                              isSelected ? "border-blue-500" : "border-gray-300"
                            }`}
                            onClick={() => handleNFTClick(nft.toString())}
                          >
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              checked={isSelected}
                              onChange={() => handleNFTClick()}
                            />
                            <label className="cursor-pointer">
                              NFT #{nft.toString()}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1>Chưa có NFT Nào</h1>
                  </div>
                )
              ) : (
                <div className="flex gap-2 mt-1 bg-slate-500 px-1 py-1 rounded-lg items-center animate-pulse w-max">
                  <h1 className="font-bold">Loading...</h1>
                  <h1 className="text-xl font-bold"></h1>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {selectedNFTs.length > 0 ? (
                !loadingWithdraw ? (
                  <button
                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-6 w-max"
                    onClick={withdrawNFTB}
                  >
                    Withdraw NFT-B
                  </button>
                ) : (
                  <button
                    className="bg-gray-500  text-white font-bold py-2 px-4 rounded mt-6 w-max"
                    disabled
                  >
                    Withdraw NFT-B
                  </button>
                )
              ) : (
                <button
                  className="bg-gray-500  text-white font-bold py-2 px-4 rounded mt-6 w-max"
                  disabled
                >
                  Withdraw NFT-B
                </button>
              )}
              <button
                className="bg-violet-800 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mt-6 w-max"
                onClick={cancelDepositNFTB}
              >
                Cancel Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
