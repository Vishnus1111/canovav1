import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Send OTP
  const handleSendMail = async () => {
    if (loading) return;
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("OTP sent successfully");
        localStorage.setItem("resetEmail", email); // ✅ Store email for reset password page
        setStep(2);
      } else {
        toast.error(data.error || "Error sending OTP");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully!");
        navigate("/resetpassword", { state: { email } }); // ✅ Pass email to reset page
      } else {
        toast.error(data.error || "Invalid or expired OTP");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <img
        src={require("../../assets/canovatag.png")}
        alt="Canova Logo"
        className={styles.logo}
      />

      <div className={styles.card}>
        {step === 1 ? (
          <>
            <h1 className={styles.title}>
              Welcome CANOVA <span>👋</span>
            </h1>
            <p className={styles.subtitle}>
              Please enter your registered email ID to receive an OTP
            </p>

            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button
              className={styles.button}
              onClick={handleSendMail}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Mail"}
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Enter Your OTP</h2>
            <p className={styles.subtitle}>
              We've sent a 6-digit OTP to your registered mail. <br /> Please
              enter it below to sign in.
            </p>

            <label className={styles.label}>OTP</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showOtp ? "text" : "password"}
                placeholder="xxxxxx"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.input}
                maxLength={6}
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowOtp(!showOtp)}
              ></span>
            </div>

            <button className={styles.button} onClick={handleVerifyOtp}>
              Confirm
            </button>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ForgotPassword;
