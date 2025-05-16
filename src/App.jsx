import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Alerts from "./Components/Alerts/Alerts"
import { Component } from "react";
import Layout from "./Components/Layout"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
};

export default App;
