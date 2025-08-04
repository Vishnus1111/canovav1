import React, { useState } from "react";
import styles from "./UploadModal.module.css";
import { toast } from "react-toastify";

export default function UploadModal({ type, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const validateFile = (file) => {
    if (!file) return;
    const isImage = type === "image";
    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg", "image/gif"];

    // ✅ File type validation
    if (isImage && !allowedImageTypes.includes(file.type)) {
      return toast.error("Only image files (PNG, JPG, WEBP) are allowed.");
    }
    if (!isImage && !allowedVideoTypes.includes(file.type)) {
      return toast.error("Only video files (MP4, WEBM, OGG, GIF) are allowed.");
    }

    // ✅ File size validation
    if (isImage && file.size > 25 * 1024 * 1024) {
      return toast.error("Image file size limit is 25 MB.");
    }
    if (!isImage && file.size > 200 * 1024 * 1024) {
      return toast.error("Video file size limit is 200 MB.");
    }

    setFile(file); // ✅ Store valid file
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    // ✅ Pass the file object (with URL handled outside)
    onUpload(file);

    // ✅ Success feedback
    toast.success(`${type === "image" ? "Image" : "Video"} uploaded successfully!`);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{type === "image" ? "Upload Image" : "Upload Video"}</h2>

        {/* Drag-and-drop area */}
        <div
          className={styles.dropZone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>📂 Drag & drop your {type} here or</p>
          <label className={styles.browseBtn}>
            Browse File
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
              accept={type === "image" ? "image/*" : "video/*"}
            />
          </label>
        </div>

        {/* Preview section */}
        {file && (
          <div className={styles.previewBox}>
            {type === "image" ? (
              <img src={URL.createObjectURL(file)} alt="Preview" />
            ) : (
              <video src={URL.createObjectURL(file)} controls />
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className={styles.modalActions}>
          <button onClick={handleUpload} className={styles.uploadBtn}>
            Upload
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
