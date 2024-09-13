import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useWeb3Context } from "./Web3Context";
import { getAllTRansaction } from "../service/transactions";
import {
  calculateTimestamp,
  convertNumber,
  convertNumberFee,
  shortenAddress,
} from "../convert/convertData";
function History() {
  const { connectMetaMask, disconnectMetaMask, address, accounts } =
    useWeb3Context();

  const [text, setText] = useState("");
  const [dataTransaction, setDataTransaction] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const fetchData = async (currentPage) => {
    try {
      const transactions = await getAllTRansaction(currentPage);
      setDataTransaction(transactions?.data);
      setTotalPages(transactions?.meta?.lastPage);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
    toast.success("Data fetched successfully");
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
    // setText(`Fetching data for page ${page}`);
    // console.log(`Fetching data for page ${page}`);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchData(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchData(currentPage + 1);
    }
  };
  return (
    <div className="flex flex-col p-2 m-10 overflow-x-auto mt-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="bg-white shadow-md rounded-lg p-4  w-full border border-gray-500">
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left bg-gray-300 rounded-s-lg w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                </th>
                <th className="px-4 py-2 text-left bg-gray-300 w-56">
                  Transaction Hash
                </th>
                <th className="px-4 py-2 text-left bg-gray-300 w-36">Method</th>
                <th className="px-4 py-2 text-left bg-gray-300 w-28">Block</th>
                <th className="px-4 py-2 text-left bg-gray-300 w-32">Age</th>
                <th className="px-4 py-2 text-left bg-gray-300">From</th>
                <th className="px-4 py-2 text-left bg-gray-300">To</th>
                <th className="px-4 py-2 text-left bg-gray-300 w-28">Amount</th>
                <th className="px-4 py-2 text-left bg-gray-300 w-28 rounded-r-lg">
                  Txn Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {dataTransaction?.map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td>
                    <button className="px-2 py-1 mx-2 mt-1 rounded-md border font-bold hover:bg-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-2 text-blue-600 font-bold text-base">
                    {shortenAddress(transaction.txHash)}
                  </td>
                  <td className="px-4 py-2 font-bold text-base">
                    {transaction.method}
                  </td>
                  <td className="px-4 py-2 text-blue-600 font-bold text-base">
                    {transaction.block}
                  </td>
                  <td className="px-4 py-2">
                    {calculateTimestamp(transaction.timestamp)}
                  </td>
                  <td className="px-4 py-2 text-blue-600 font-bold text-base">
                    {shortenAddress(transaction.from)}
                  </td>
                  <td className="px-4 py-2 font-bold text-base ">
                    {shortenAddress(transaction.to)}
                  </td>
                  <td className="px-4 py-2">
                    {convertNumber(transaction.amount)}
                  </td>
                  <td className="px-4 py-2 text-gray-400">
                    {convertNumberFee(transaction.fee)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages ? (
            <div className="flex gap-0 justify-center mt-6">
              <button
                className={`px-3 py-2 mx-1 rounded-md border font-bold  ${
                  currentPage === 1
                    ? "cursor-not-allowed"
                    : "hover:bg-gray-300 "
                }`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                  className={`px-4 py-2 mx-1 rounded-md border font-bold ${
                    page === currentPage
                      ? "bg-gray-400 text-gray-50"
                      : "bg-white"
                  } ${
                    page === currentPage
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-100"
                  } ${page === currentPage ? "text-gray-500" : "text-black"}`}
                >
                  {page}
                </button>
              ))}
              <button
                className={`px-3 py-2 mx-1 rounded-md border font-bold  ${
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "hover:bg-gray-300 "
                }`}
                onClick={nextPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div>loading.....</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
