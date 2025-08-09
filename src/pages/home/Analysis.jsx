import React, { useEffect, useState } from "react";
import styles from "./Analysis.module.css"; // Create a CSS file for styling
import axios from "axios";
import API_BASE_URL from '../../config';

const Analysis = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`${API_BASE_URL}/api/forms/user/` + user._id);
        setForms(res.data);
      } catch (error) {
        console.error("Failed to fetch forms:", error);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className={styles.analysisContainer}>
      <h2>Form Analytics</h2>
      {forms.length === 0 ? (
        <p>No forms found.</p>
      ) : (
        forms.map((form) => (
          <div key={form._id} className={styles.formCard}>
            <h3>{form.formName}</h3>
            <p>Project: {form.projectName || "N/A"}</p>
            <p>Created At: {new Date(form.createdAt).toLocaleDateString()}</p>
            <p>Status: {form.status}</p>
            <div className={styles.placeholder}>
              Analytics not available – no responses found.
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Analysis;
