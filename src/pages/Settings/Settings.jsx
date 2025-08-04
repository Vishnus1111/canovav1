import React from "react";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import styles from "./Settings.module.css";
import { useTheme } from "../../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      <ProfileSidebar />
      <div className={styles.content}>
        <h2>Settings</h2>
        <div className={styles.settingsBox}>
          <h4>Preferences</h4>
          <div className={styles.row}>
            <label>Theme</label>
            <select value={theme} onChange={(e) => toggleTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className={styles.row}>
            <label>Language</label>
            <select>
              <option value="eng">Eng</option>
              <option value="esp">Esp</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
