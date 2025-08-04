import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email either from navigation state or from localStorage (fallback)
  const email = location.state?.email || localStorage.getItem("resetEmail") || "";
  console.log("Reset Password Email:", email);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!email) {
      toast.error("Email missing! Please retry forgot password flow.");
      return;
    }

    console.log("📤 Reset Password Request Payload:", { email, newPassword });

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Password reset successful!");
        localStorage.removeItem("resetEmail"); // ✅ Clear stored email after reset
        navigate("/");
      } else {
        toast.error(data.error || "Error resetting password");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  return (
    <div className={styles.container}>
      <img
        src={require("../../assets/canovatag.png")}
        alt="Canova Tag"
        className={styles.canovaTag}
      />

      <div className={styles.card}>
        <h2 className={styles.title}>Reset Your Password 🔒</h2>
        <p className={styles.subtitle}>
          Please enter your new password and confirm it below.
        </p>

        <div className={styles.inputWrapper}>
          <label className={styles.label}>New Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="at least 8 characters"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </span>
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <label className={styles.label}>Confirm Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="re-enter password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </span>
          </div>
        </div>

        <button
          className={styles.button}
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ResetPassword;
