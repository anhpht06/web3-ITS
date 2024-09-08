import React from "react";
import IconTokenERC20 from "../../assets/tokenERC20.svg";

function StakingInformation() {
  return (
    <div className="basis-2/3 h-full bg-white m-1 rounded-lg shadow-xl ">
      <div className="flex flex-col p-2 ">
        <h1 className="text-2xl font-bold text-center uppercase">
          please connect MetaMask
        </h1>
        <hr className="border-gray-400 mt-2" />
        <div className="flex flex-col p-2 mt-2">
          <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold">
            <div className="flex flex-col p-4 ">
              <div className="flex gap-2 mt-4 h-8 bg-slate-500 rounded animate-pulse"></div>
              <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
              <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-col  rounded-md h-auto p-4 bg-gray-400">
              <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
              <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
              <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col  rounded-lg h-auto p-4  mt-1">
              <div className="flex gap-2 mt-4 h-10 bg-blue-500 rounded animate-pulse"></div>
              <div className="flex gap-2 mt-4 h-8 bg-slate-500 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold mt-6">
            <div className="flex flex-col  ">
              <div className="flex flex-col p-4 ">
                <div className="flex gap-2 mt-4 h-8 bg-slate-500 rounded animate-pulse"></div>
                <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-col  rounded-lg h-auto p-3">
                <div className="flex gap-2 mt-4 h-10 bg-blue-500 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakingInformation;
