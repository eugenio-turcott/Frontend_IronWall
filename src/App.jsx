import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Alerts from "./Components/Alerts/Alerts";
import Dashboard from "./Components/Dashboards/Dashboard";
import Layout from "./Components/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/alertas" element={<Alerts />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
