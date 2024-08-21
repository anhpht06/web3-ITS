// import React from "react";
import logo from "./assets/logo-BNC.svg";
import iconUser from "./assets/user-profile.svg";
import { Link } from "react-router-dom";
import metamask, { checkAndConnectMetaMask } from "./function/metamask";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Header() {
  const [address, setAddress] = useState("");
  const [isOpenUser, setIsOpenUser] = useState(false);

  useEffect(() => {
    setAddress(localStorage.getItem("address"));
    checkAndConnectMetaMask();
  }, []);
  const connectMetamask = async () => {
    const { address, provider, signer } = await metamask();
    localStorage.setItem("address", address);
    setAddress(address);
  };

  return (
    <div className="container mx-auto flex justify-between items-center p-2 text-white bg-black bg-opacity-90">
      <div>
        <img className="h-12 " src={logo} alt="logo" />
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
        {address ? (
          <div class="relative inline-block group mr-4">
            <button class="inline-flex justify-center w-full px-2 py-2  bg-gray-600 rounded-lg hover:bg-gray-700 ">
              <img className="h-6" src={iconUser} alt="icon user" />
            </button>

            <div class="absolute right-0  w-48  origin-top-right rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
              <div class="py-1 ">
                <Link
                  to={"/admin"}
                  class="block px-4 py-2 text-sm text-white hover:bg-gray-600 hover:rounded-lg"
                >
                  Admin
                </Link>

                <Link
                  to={"/"}
                  onClick={() => {
                    localStorage.removeItem("address");
                    setAddress("");
                  }}
                  class="block px-4 py-2 text-sm text-white hover:bg-gray-600 hover:rounded-lg"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Header;
