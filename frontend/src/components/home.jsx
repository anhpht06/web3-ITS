import React from "react";
import { Link } from "react-router-dom";

function home() {
  return (
    <div>
      <h1 className="mt-1 text-green-500 font-bold">day la home</h1>
      <Link className="" to={"/login"}>
        Login
      </Link>
    </div>
  );
}

export default home;
