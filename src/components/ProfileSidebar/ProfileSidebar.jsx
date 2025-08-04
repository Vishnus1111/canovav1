import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./ProfileSidebar.module.css";
import profilesettingsicon from "../../assets/settings/settingsprofile.png";

const ProfileSidebar = ({ user }) => {
  const navigate = useNavigate();
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img
          src={require("../../assets/Logo.png")}
          alt="Logo"
          className={styles.logo}
        />
        <img
          src={require("../../assets/Company Name.png")}
          alt="Company Name"
          className={styles.companyLogo}
        />
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileAvatar}>{firstLetter}</div>
        <p className={styles.profileName}>{user?.name || "Your name"}</p>
        <p className={styles.profileEmail}>{user?.email || "yourname@gmail.com"}</p>
      </div>

      <div className={styles.navMenu}>
        <div className={styles.navRow}>
          <img
            src={require("../../assets/settings/settingsprofile.png")}
            alt="Profile Settings"
            className={styles.settingsIcon}
          />
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            My Profile
          </NavLink>
          <img
            src={require("../../assets/settings/chevron-right.png")}
            alt="Settings"
            className={styles.arrow2}
          />
        </div>

        <div className={styles.navRow}>
          <img
            src={require("../../assets/settings/settings-01.png")}
            alt="Settings"
            className={styles.settingsIcon}
          />
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            Settings
          </NavLink>
          <img
            src={require("../../assets/settings/chevron-right.png")}
            alt="Settings"
            className={styles.arrow2}
          />
        </div>
      </div>

      <div className={styles.logoutRow} onClick={() => navigate("/")}>
        <img
          src={require("../../assets/settings/log-out-04.png")}
          alt="Logout"
          className={styles.settingsIcon}
        />
        <button className={styles.logoutBtn}>Log Out</button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
