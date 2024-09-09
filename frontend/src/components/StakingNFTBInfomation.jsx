import React from "react";
import ListNFTB from "./ListNFTB";
import { useState, useEffect } from "react";

export default function StakingNFTBInfomation() {
  return (
    <div className="flex flex-col border-2 shadow-lg rounded-lg h-auto bg-gray-200 font-bold mt-6">
      <div className="flex flex-col  ">
        <div className="flex flex-col p-4 ">
          <h1 className="text-2xl font-bold">NFT B Staked</h1>
          <div className="flex gap-2 mt-2 text-xl">
            <h1 className="">{}</h1>
            <h1>NFT-B</h1>
          </div>
        </div>
        <div className="flex flex-col  rounded-lg h-auto p-3">
          <div className="flex gap-4 "></div>
        </div>
      </div>
    </div>
  );
}
