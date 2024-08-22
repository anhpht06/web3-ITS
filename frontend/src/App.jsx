import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Header from "./Header";
import { Web3Provider } from "./components/Web3Context";

function App() {
  return (
    <Web3Provider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
