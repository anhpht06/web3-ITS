import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import History from "./components/History";
import Header from "./Header";
import ChangeBaseAPR from "./components/ChangeBaseAPR";
import { Web3Provider } from "./components/Web3Context";

function App() {
  return (
    <Web3Provider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/change-base-apr" element={<ChangeBaseAPR />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
