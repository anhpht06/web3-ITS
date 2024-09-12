// import React from "react";
import logo from "./assets/logo-BNC.svg";
import iconUser from "./assets/user-profile.svg";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "./components/Web3Context";
import { useNavigate } from "react-router-dom";
import contractAddress from "../src/contracts/contract-address.json";

function Header() {
  const navigate = useNavigate();
  const { connectMetaMask, disconnectMetaMask, address } = useWeb3Context();
  const [isCheckAdmin, setIsCheckAdmin] = useState(false);

  useEffect(() => {
    if (!address) {
      return;
    }
    const adminAddress = contractAddress.adminAddress
      ? contractAddress.adminAddress.toLowerCase().replace(/^0x/, "")
      : "";
    const userAddress = contractAddress.adminAddress
      ? address.toLowerCase().replace(/^0x/, "")
      : "";

    if (adminAddress === userAddress) {
      console.log("admin");
      setIsCheckAdmin(true);
    } else {
      console.log("user");
      setIsCheckAdmin(false);
    }
  }, [address]);
  //check admin

  //check if metamask is connected or not
  useEffect(() => {
    if (localStorage.getItem("isMetaMaskConnected") === "false") {
      navigate("/");
    }
  }, [localStorage.getItem("isMetaMaskConnected")]);

  return (
    <div className="container max-w-full flex justify-between items-center p-2 text-white bg-black bg-opacity-90">
      <div>
        <img className="h-12 " src={logo} alt="logo" />
      </div>

      <nav>
        <ul className="flex gap-4">
          <li>
            <Link className="font-bold text-2xl hover:text-red-500" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link
              className="font-bold text-2xl hover:text-red-500"
              to="/history"
            >
              History
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        {address ? (
          <div className="relative inline-block group mr-4">
            <button className="inline-flex justify-center w-full px-2 py-2  bg-gray-600 rounded-lg hover:bg-gray-700 ">
              <img className="h-6" src={iconUser} alt="icon user" />
            </button>

            <div className="absolute right-0 z-10  w-48  origin-top-right rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
              <div className="py-1 ">
                {isCheckAdmin ? (
                  <Link
                    to={"/change-base-apr"}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-600 hover:rounded-lg"
                  >
                    Change Base APR
                  </Link>
                ) : (
                  <></>
                )}

                <Link
                  to={"/"}
                  onClick={() => {
                    disconnectMetaMask();
                  }}
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-600 hover:rounded-lg"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold"
            onClick={connectMetaMask}
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
