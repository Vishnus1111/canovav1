import React, { useState } from "react";
import styles from "./SaveModal.module.css";

const SaveModal = ({ onClose, projectName, userEmail, formData }) => {
  const [mails, setMails] = useState([userEmail]); // Owner added by default
  const [newMail, setNewMail] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [formLink, setFormLink] = useState("");

  const handleAddMail = () => {
    if (!newMail.trim()) return;
    if (!mails.includes(newMail)) {
      setMails([...mails, newMail]);
      setIsRestricted(true);
    }
    setNewMail("");
  };

  const generateLink = (formName) => {
    const slug = formName?.toLowerCase().replace(/\s+/g, "-") || "form";
    const rand = Math.random().toString(36).substring(2, 8);
    return `${slug}-${rand}`;
  };

  const handlePublish = async () => {
    const generatedLink = generateLink(formData?.formName || "form");
    const fullLink = `https://canova/forms/${generatedLink}`;

    const payload = {
      projectName: projectName || "Default Project",
      formName: formData?.formName || "Untitled Form",
      type: "form",
      link: generatedLink,
      pages: formData?.pages || [], // ✅ Directly use as sent from FormPage
      conditions: formData?.conditions || {},
      createdBy: formData?.createdBy,
      status: "published",
    };

    console.log(
      "✅ Payload being sent to backend:",
      JSON.stringify(payload, null, 2)
    );

    try {
      const res = await fetch("http://localhost:5000/api/forms/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFormLink(fullLink);
        setIsPublished(true);
      } else {
        alert("❌ Failed to save form: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error publishing:", error);
      alert("❌ Failed to connect to server.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formLink);
    alert("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Form Link",
          text: "Here’s the form link:",
          url: formLink,
        })
        .catch(() => alert("Sharing canceled or not supported."));
    } else {
      alert("Sharing options: WhatsApp, Email, etc. (to be implemented)");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {!isPublished ? (
          <>
            <h2>Publish</h2>

            {!projectName && (
              <div className={styles.inputGroup}>
                <label>Save to:</label>
                <input type="text" placeholder="Enter Project Name" />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Responders:</label>
              <p>Anyone with the Link</p>
            </div>

            <div className={styles.inputGroup}>
              <label>Share:</label>
              <div className={styles.mailList}>
                {mails.map((mail, idx) => (
                  <div key={idx} className={styles.mailItem}>
                    {mail} {idx === 0 && "(Owner)"}
                  </div>
                ))}
              </div>
              <div className={styles.addMailRow}>
                <input
                  type="email"
                  placeholder="Add Email"
                  value={newMail}
                  onChange={(e) => setNewMail(e.target.value)}
                />
                <button onClick={handleAddMail}>+ Add Mail</button>
              </div>
            </div>

            <button className={styles.publishBtn} onClick={handlePublish}>
              Publish
            </button>
          </>
        ) : (
          <>
            <h2>Share</h2>
            <div className={styles.inputGroup}>
              <label>Form Link:</label>
              <p className={styles.copyLinkText} onClick={handleCopyLink}>
                Copy the Link
              </p>
            </div>
            <button className={styles.publishBtn} onClick={handleShare}>
              Share
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SaveModal;
