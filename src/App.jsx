import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Alerts from "./Components/Alerts/Alerts"
import { Component } from "react";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/alerts" element={<Alerts />} />
    </Routes>
  );
};

export default App;
