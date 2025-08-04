import { Link } from "react-router-dom";
import React, { useState } from 'react';
import styles from "./Login.module.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // ✅ Prevent duplicate requests
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            // ✅ Call backend login API
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Invalid credentials"); // ✅ backend sends "error"
                setLoading(false);
            } else {
                // ✅ Save token & user details in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                toast.success("Login successful! Redirecting...", {
                    onClose: () => navigate('/dashboard'),
                    autoClose: 2000
                });
            }
        } catch (error) {
            toast.error("Server error");
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <img src={require("../assets/canovatag.png")} alt="Canova Tag" className={styles.canovaTag} />
            <div className={styles.card}>
                <h2 className={styles.title}>Welcome CANOVA 👋</h2>
                <p className={styles.subtitle}>
                    Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="Example@email.com"
                            className={styles.input}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="at least 8 characters"
                                className={styles.input}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    <div className="forgotPassword">
                        <Link to="/forgotpassword" className={styles.forgotPasswordLink}>Forgot Password?</Link>
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className={styles.footerText}>
                    Don’t you have an account?{" "}
                    <Link to="/signup" className={styles.link}>
                        Sign up
                    </Link>
                </p>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
}

export default Login;
