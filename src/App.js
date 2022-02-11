/* eslint-disable no-undef */
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./containers/login";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Login />}/>
      </Routes>
    </div>
  );
}

export default App;
