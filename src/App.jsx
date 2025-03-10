import { useState } from 'react'
import './App.css'
import Login from './code/registration/Login.jsx'
import SignUp from './code/registration/SignUp.jsx'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './code/header/Header.jsx';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/header" element={<Header />} />
        </Routes>
    </Router>
  )
}

export default App
