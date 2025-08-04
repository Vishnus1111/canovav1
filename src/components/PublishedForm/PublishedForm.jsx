import React, { useState } from "react";

const PublishedForm = ({ formConfig }) => {
  // ✅ Always declare hooks at the top
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  // If formConfig is missing, return "Form Not Found"
  if (!formConfig) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Form Not Found</h2>
        <p>This form is unavailable or was not published properly.</p>
      </div>
    );
  }

  const { title, isRestricted, allowedEmails } = formConfig;

  // ✅ Ask for email if restricted and email not yet set
  if (isRestricted && !currentUserEmail) {
    const email = prompt("Enter your email to access the form:");
    if (email) setCurrentUserEmail(email);
  }

  // ✅ Restriction check
  if (isRestricted && currentUserEmail && !allowedEmails.includes(currentUserEmail)) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to view this form.</p>
      </div>
    );
  }

  // ✅ Show form content
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{title}</h2>
      <p>Welcome to the form! (UI Simulation)</p>
    </div>
  );
};

export default PublishedForm;
