import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useWeb3Context } from "./Web3Context";

export default function ChangeBaseAPR() {
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

  const [newAPR, setNewAPR] = useState(0);
  const [contractSigner, setContractSigner] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    
    if (!contractHandleSigner) {
      return;
    }
    setContractSigner(contractHandleSigner);
  }, [contractHandleSigner]);

  useEffect(() => {
    if (newAPR >= 100) {
      setNewAPR(100);
      toast.error("Value must be less than 100");
    } else if (newAPR < 0) {
      setNewAPR(0);
      toast.error("Value must be greater than 0");
    }
  }, [newAPR]);

  const handleChageBaseAPR = async () => {
    const _newAPR = Number(newAPR) * 100;
    setLoadingUpdate(true);

    const update = async () => {
      try {
        const tx = await contractSigner.updateBaseAPR(_newAPR);
        await tx.wait();
        setLoadingUpdate(false);
      } catch (error) {
        console.error("Update failed:", error);
        setLoadingUpdate(false);
        throw error;
      }
    };

    toast.promise(update(), {
      pending: "Updating...",
      success: "Update success",
      error: "Update error",
    });
  };
  return (
    <div>
      <div className="p-2">
        <div className="flex flex-col p-2 m-10 overflow-x-auto mt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white shadow-md rounded-lg p-4  w-max border border-gray-500 flex gap-2">
              {newAPR > 0 ? (
                !loadingUpdate ? (
                  <button
                    className=" bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
                    onClick={handleChageBaseAPR}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    disabled
                  >
                    Update
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Update
                </button>
              )}
              <input
                className="border-2 rounded-lg px-2"
                type="number"
                placeholder="0"
                value={newAPR || ""}
                onChange={(e) => setNewAPR(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
