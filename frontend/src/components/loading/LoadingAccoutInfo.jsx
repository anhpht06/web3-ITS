import React from "react";

function LoadingAccoutInfo() {
  return (
    <div className="flex-auto basis-1/3 h-full bg-white m-1 rounded-lg shadow-xl">
      <div className="flex flex-col p-2 ">
        <h1 className="text-2xl font-bold text-center uppercase">
          please connect MetaMask
        </h1>
        <hr className="border-gray-400 mt-2" />
        <div className="flex gap-2 mt-4 h-5 bg-slate-500 rounded animate-pulse"></div>
        <div className="flex gap-2 mt-3 h-5 bg-slate-500 rounded animate-pulse"></div>
        <div className="flex gap-2 mt-3 h-5 bg-slate-500 rounded animate-pulse"></div>
        <div className="flex gap-2 mt-3 h-5 bg-slate-500 rounded animate-pulse"></div>
        <button
          disabled
          className="bg-blue-500 text-white font-bold py-5 px-4 rounded mt-6 animate-pulse"
        >
          
        </button>
      </div>
    </div>
  );
}

export default LoadingAccoutInfo;
