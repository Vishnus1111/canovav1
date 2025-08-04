// src/components/Sidebar/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img src={require("../../assets/Logo.png")} alt="Logo" className={styles.logo} />
                <img src={require("../../assets/Company Name.png")} alt="Company Name" className={styles.companyLogo} />
            </div>

            <ul className={styles.sidebarList}>
                <li className={`${styles.sidebarItem} ${styles.active}`}>
                    <img src={require("../../assets/home.png")} alt="Home" />
                    <span>Home</span>
                </li>
                <li className={styles.sidebarItem} onClick={() => navigate('/analysis')}>
                    <img src={require("../../assets/analysis.png")} alt="Analysis" />
                    <span>Analysis</span>
                </li>
                <li className={styles.sidebarItem} onClick={() => navigate('/projects')}>
                    <img src={require("../../assets/projects.png")} alt="Projects" />
                    <span>Projects</span>
                </li>
            </ul>

            {/* ✅ Profile Footer Button */}
            <div 
                className={styles.sidebarFooter} 
                onClick={() => navigate('/profile')} // <-- Navigate to ProfilePage
                style={{ cursor: "pointer" }}
            >
                <img src={require("../../assets/profileicon.png")} className='profilebtn' alt="Profile" />
                <h4>Profile</h4>
            </div>
        </div>
    );
};

export default Sidebar;
