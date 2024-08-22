import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useWeb3Context } from "./Web3Context";

function Admin() {
  const { connectMetaMask, disconnectMetaMask, address, accounts } =
    useWeb3Context();
  return (
    <div>
      <h1>{address}</h1>
    </div>
  );
}

export default Admin;
