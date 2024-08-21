// import React from "react";
import logo from "./assets/logo-BNC.svg";
import { Link } from "react-router-dom";
import metamask from "./function/metamask";
import React, { useState } from "react";

function Header() {
  const [address, setAddress] = useState("");

  const connectMetamask = async () => {
    const { address } = await metamask();
    setAddress(address);
  };
  return (
    <div className="container mx-auto flex justify-between items-center p-2 text-white bg-black bg-opacity-90">
      <div>
        <img className="h-12" src={logo} alt="logo" />
      </div>
      <nav>
        <ul className="flex">
          <li>
            <Link className="font-bold text-2xl" to="/">
              Home
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        <button
          className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold"
          onClick={connectMetamask}
        >
          <div className="flex items-center">
            <img
              className="h-6 mr-2"
              src="/images/icon-metamask.png"
              alt="icon metamask"
            />
            <h1>Connect Metamask</h1>
          </div>
        </button>
        {address && <p>Connected address: {address}</p>}
      </div>
    </div>
  );
}

export default Header;
