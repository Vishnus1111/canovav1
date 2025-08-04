// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/forgotpassword/Forgotpassword.jsx";
import ResetPassword from "./pages/forgotpassword/ResetPassword.jsx";
import FormPage from "./pages/FormPage/FormPage.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import PublishedForm from "./components/PublishedForm/PublishedForm.jsx"; 
import Projects from "./pages/home/Projects.jsx";
import Analysis from "./pages/home/Analysis.jsx";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/form/:id" element={<FormPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/analysis" element={<Analysis />} />

          {/* ✅ New Route for Published Form Access Simulation */}
          <Route
            path="/forms/:formId"
            element={
              <PublishedForm
                formConfig={JSON.parse(localStorage.getItem("formConfig"))}
              />
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="custom-toast"
        />
      </>
    </Router>
  );
}

export default App;
