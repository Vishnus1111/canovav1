import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ConditionModal.module.css";

const ConditionModal = ({ question, pages, onSave, onClose }) => {
  const [keywords, setKeywords] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [minValue, setMinValue] = useState("");
  const [truePage, setTruePage] = useState("");
  const [falsePage, setFalsePage] = useState("");

  // ✅ Prevent rendering modal if no question selected
  if (!question) return null;

  const handleSave = () => {
    onSave({
      type: question.questionType,
      keywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
      selectedOption,
      selectedCheckboxes,
      fileTypes,
      dateRange,
      minValue: minValue ? Number(minValue) : "",
      redirect: { truePage, falsePage },
    });
    onClose();
  };

  const toggleCheckbox = (idx) => {
    setSelectedCheckboxes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleFileType = (type) => {
    setFileTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3>Set Condition for "{question.text || "Untitled Question"}"</h3>

        {/* ✅ Short/Long Answer Keywords */}
        {["short", "long"].includes(question.questionType) && (
          <input
            type="text"
            placeholder="Enter keywords, separated by commas"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className={styles.input}
          />
        )}

        {/* ✅ Multiple Choice (MCQ) */}
        {question.questionType === "mcq" && (
          <div className={styles.optionList}>
            {question.options.map((opt, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  name="mcqCondition"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                />
                {opt || `Option ${idx + 1}`}
              </label>
            ))}
          </div>
        )}

        {/* ✅ Checkbox */}
        {question.questionType === "checkbox" && (
          <div className={styles.optionList}>
            {question.options.map((opt, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  checked={selectedCheckboxes.includes(idx)}
                  onChange={() => toggleCheckbox(idx)}
                />
                {opt || `Option ${idx + 1}`}
              </label>
            ))}
          </div>
        )}

        {/* ✅ Dropdown */}
        {question.questionType === "dropdown" && (
          <div className={styles.optionList}>
            {question.options.map((opt, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  name="dropdownCondition"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                />
                {opt || `Option ${idx + 1}`}
              </label>
            ))}
          </div>
        )}

        {/* ✅ File Upload */}
        {question.questionType === "file" && (
          <div className={styles.optionList}>
            {["image", "pdf", "ppt", "document", "video", "zip", "audio", "spreadsheet"].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={fileTypes.includes(type)}
                  onChange={() => toggleFileType(type)}
                />
                {type.toUpperCase()}
              </label>
            ))}
          </div>
        )}

        {/* ✅ Date Range */}
        {question.questionType === "date" && (
          <div className={styles.dateRow}>
            <DatePicker
              selected={dateRange[0]}
              onChange={(update) => setDateRange(update)}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              selectsRange
              placeholderText="Select date range"
            />
          </div>
        )}

        {/* ✅ Linear Scale / Rating */}
        {["linear", "rating"].includes(question.questionType) && (
          <input
            type="number"
            placeholder="Enter minimum value"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            className={styles.input}
          />
        )}

        {/* ✅ Redirect Pages */}
        <div className={styles.redirectSection}>
          <label>
            If True → Go to:
            <select value={truePage} onChange={(e) => setTruePage(e.target.value)}>
              <option value="">Select Page</option>
              {pages.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            If False → Go to:
            <select value={falsePage} onChange={(e) => setFalsePage(e.target.value)}>
              <option value="">Select Page</option>
              {pages.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* ✅ Modal Buttons */}
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveBtn}>
            Add Condition
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionModal;
