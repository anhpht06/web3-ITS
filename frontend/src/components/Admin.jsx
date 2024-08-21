import React from "react";
import { useState, useEffect } from "react";
function Admin() {
  const [address, setAddress] = useState("");
  useEffect(() => {
    setAddress(localStorage.getItem("address"));
  }, []);
  return (
    <div>
      <h1>{address}</h1>
    </div>
  );
}

export default Admin;
