// src/components/FormSidebar/FormPageSidebar.jsx
import React from "react";
import EditableText from "../EditableText";
import styles from "./FormPageSidebar.module.css";
import plusIcon from "../../assets/Add New Page.png";
import { useNavigate } from 'react-router-dom';

const FormPageSidebar = ({ pages, setPages, currentPage, onPageSelect }) => {
  const navigate = useNavigate();

  // Handle page name changes
  const updatePageName = (idx, newName) => {
    setPages((pgs) =>
      pgs.map((pg, i) => (i === idx ? { ...pg, name: newName } : pg))
    );
  };

  // Handle add new page
  const addPage = () => {
    const newPageIndex = pages.length;
    setPages([...pages, { name: `Page ${newPageIndex + 1}` }]);
  };

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
      <div className={styles.pagesList}>
        {pages.map((page, idx) => (
          <div
            key={idx}
            className={`${styles.pageItem} ${
              currentPage === idx ? styles.active : ""
            }`}
            onClick={() => onPageSelect(idx)} // ✅ Call page switch callback
          >
            <EditableText
              text={page.name}
              onChange={(name) => updatePageName(idx, name)}
              className={styles.pageName}
              inputClassName={styles.pageInput}
              maxLength={30}
            />
          </div>
        ))}
        <div className={styles.addPageWrapper}>
          <div className={styles.addPageBtn} onClick={addPage} title="Add page">
            <img src={plusIcon} alt="Add page" />
          </div>
        </div>
      </div>
      <button className={styles.profileBtn} onClick={() => navigate('/profile')}>
        <img src={require("../../assets/profileicon.png")} alt="Profile" />
        <span>Profile</span>
      </button>
    </div>
  );
};

export default FormPageSidebar;
