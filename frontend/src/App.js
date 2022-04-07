import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Adminlogin from "./pages/Adminlogin";
import VotingPage from "./pages/VotingPage";
import UserLogin from "./pages/UserLogin";



function App() {
  return (
    // <Result />

    <Router>
      <Routes>
        <Route path="/" element={<Adminlogin />} />
        <Route path="/user" element={<UserLogin />} />
        <Route path="/room/:roomId" element={<VotingPage />} />
        {/* <Route path="/vote/:storyId" element={<VotingPage />} /> */}
        {/* <Route path="/room/:roomId" element={<Room />}/> */}
      </Routes>
    </Router>
  );
}

export default App;
