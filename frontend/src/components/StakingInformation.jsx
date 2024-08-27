import React from "react";

function StakingInformation() {
  return (
    <div className="basis-2/3 h-screen bg-white m-1 rounded-lg shadow-xl">
      <div className="flex flex-col p-2">
        <h1 className="text-2xl font-bold text-center uppercase">
          staking information
        </h1>
        <hr className="border-gray-400 mt-2" />
        <div className="flex flex-col p-2">
          <div className="flex flex-row gap-2 items-center ">
            <div className="flex-none flex flex-row  basis-2/3 p-2 bg-blue-500 rounded-lg text-white font-bold">
              <h1 className="basis-1/4">Staked Token A: </h1>
              <h1 className="basis-3/4">1000000 </h1>
            </div>
            <div className=" basis-1/3 p-1 bg-red-400 rounded-lg flex flex-row gap-3">
              <input
                className="w-full flex-none basis-2/3 rounded border-none outline-none p-1"
                type="text"
              />
              <button className="basis-1/3 bg-blue-400 hover:bg-blue-600 rounded font-bold">
                Deposit
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center mt-5">
            <div className="flex-none flex flex-row basis-2/3 p-2 bg-blue-500 rounded-lg text-white font-bold">
              <h1 className="basis-1/4">Reward:</h1>
              <h1 className="basis-3/4">1000000 </h1>
            </div>
            <div className="basis-1/3 p-1 bg-red-400 rounded-lg flex flex-row gap-3">
              <button className="basis-1/2 bg-blue-400 hover:bg-blue-600 rounded font-bold">
                Claim reward
              </button>
              <button className="basis-1/2 bg-blue-400 hover:bg-blue-600 rounded font-bold py-1">
                Withdraw
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center mt-5">
            <div className=" flex flex-row p-2 gap-4 bg-blue-500 rounded-lg text-white font-bold">
              <h1 className="text-red-300">Lock time:</h1>
              <h1 className="">1000000 </h1>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center mt-5">
            <div className="flex flex-row gap-4  p-2 bg-blue-500 rounded-lg text-white font-bold">
              <h1 className="basis-1/4 text-red-300">APR:</h1>
              <h1 className="basis-3/4">8% </h1>
            </div>
          </div>        
          <div className="flex flex-row gap-2 items-center mt-5">
            <div className="flex-none flex flex-row basis-2/3 p-2 bg-blue-500 rounded-lg text-white font-bold">
              <h1 className="basis-1/4">Staked NFTB:</h1>
              <h1 className="basis-3/4">1000000 </h1>
            </div>
            <div className="basis-1/3 p-1 bg-red-400 rounded-lg flex flex-row gap-3">
              <input
                className="w-full flex-none basis-2/3 rounded border-none outline-none p-1"
                type="date"
              />
              <button className="basis-1/3 bg-blue-400 hover:bg-blue-600 rounded font-bold">
                Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakingInformation;
