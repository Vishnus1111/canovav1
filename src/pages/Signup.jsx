import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import styles from "./Signup.module.css";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import API_BASE_URL from '../config';

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (loading) return; // ⛔ Prevent multiple submissions
        setLoading(true);     // ⏳ Start loading

        // ✅ Fixed: Use FormData or direct refs instead of array indices
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // ✅ Basic validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill all fields.");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // ✅ Correct API endpoint for signup
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Signup failed");
                setLoading(false);
            } else {
                // ✅ Show success toast immediately
                toast.success("Signup successful! Redirecting to login...", {
                    onClose: () => {
                        navigate("/");
                    },
                    autoClose: 2000,
                });

                // ✅ Reset form fields
                document.querySelector('form').reset();
                
                // ✅ Backup navigation in case toast fails
                setTimeout(() => {
                    navigate("/");
                }, 2500);
                
                // ✅ Reset loading state after a short delay to show the toast
                setTimeout(() => {
                    setLoading(false);
                }, 100);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error("Server error. Please try again later.");
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

                <form className={styles.form} onSubmit={handleSignup}>
                    <div>
                        <label className={styles.label}>Name</label>
                        <input type="text" name="name" placeholder="Name" className={styles.input} required />
                    </div>

                    <div>
                        <label className={styles.label}>Email</label>
                        <input type="email" name="email" placeholder="Example@email.com" className={styles.input} required />
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Create Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={styles.input}
                                required
                                placeholder="at least 8 characters"
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </span>
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Confirm Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                className={styles.input}
                                placeholder="at least 8 characters"
                                required
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowConfirm((prev) => !prev)}
                            >
                                <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </span>
                        </div>
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>
                </form>

                <p className={styles.footerText}>
                    Already have an account?{" "}
                    <Link to="/" className={styles.link}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
