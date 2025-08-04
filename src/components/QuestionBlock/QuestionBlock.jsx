import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./QuestionBlock.module.css";
import downArrowIcon from "../../assets/down arrow.png";

const QUESTION_TYPES = [
  { key: "short", label: "Short Answer" },
  { key: "long", label: "Long Answer" },
  { key: "mcq", label: "Multiple Choice" },
  { key: "checkbox", label: "Checkbox" },
  { key: "dropdown", label: "Dropdown" },
  { key: "file", label: "File Upload" },
  { key: "date", label: "Date" },
  { key: "linear", label: "Linear Scale" },
  { key: "rating", label: "Rating" },
];

const QuestionBlock = ({
  question,
  index,
  onUpdate,
  onDelete,
  focusPrevious,
}) => {
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [draftText, setDraftText] = useState(question.text || "");

  const questionInputRef = useRef(null);

  const [editingOptionIdx, setEditingOptionIdx] = useState(null);
  const optionRefs = useRef([]);

  const [selectedOption, setSelectedOption] = useState(
    question.selectedOption ?? null
  );
  const [selectedIndexes, setSelectedIndexes] = useState(
    Array.isArray(question.selectedIndexes) ? question.selectedIndexes : []
  );

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateInputRef = useRef(null);
  const [ratingHover, setRatingHover] = useState(0);

  const [showConditionEditor, setShowConditionEditor] = useState(false);


  // Sync props to state
  // Sync props to state
  useEffect(() => {
    setSelectedOption(question.selectedOption ?? null);
    setSelectedIndexes(
      Array.isArray(question.selectedIndexes) ? question.selectedIndexes : []
    );
  }, [question.selectedOption, question.selectedIndexes]);

  // Initialize options when type changes
  useEffect(() => {
    if (
      question.questionType === "dropdown" &&
      (!question.options || question.options.length < 1)
    ) {
      onUpdate({
        ...question,
        options: [""],
        selectedOption: null,
        selectedIndexes: [],
      });
    } else if (
      ["mcq", "checkbox"].includes(question.questionType) &&
      (!question.options || question.options.length < 2)
    ) {
      onUpdate({
        ...question,
        options: ["", ""],
        selectedOption: null,
        selectedIndexes: [],
      });
    } else if (
      !["mcq", "checkbox", "dropdown"].includes(question.questionType) &&
      question.options?.length
    ) {
      onUpdate({
        ...question,
        options: [],
        selectedOption: null,
        selectedIndexes: [],
      });
    }
  }, [question.questionType, onUpdate]);

  useEffect(() => {
    if (editingQuestion) {
      questionInputRef.current?.focus();
      questionInputRef.current?.select();
    }
  }, [editingQuestion]);

  useEffect(() => {
    if (datePickerOpen && dateInputRef.current?.setFocus) {
      dateInputRef.current.setFocus(); // ✅ Works if supported
    }
  }, [datePickerOpen]);

  const saveQuestionText = () => {
    const txt = draftText.trim();
    onUpdate({ ...question, text: txt || question.text || "" });
    setEditingQuestion(false);
  };

  const handleQuestionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveQuestionText();
      optionRefs.current[0]?.focus();
    } else if (e.key === "Backspace" && draftText === "") {
      e.preventDefault();
      onDelete(index);
      focusPrevious?.(index - 1);
    } else if (e.key === "Escape") {
      setDraftText(question.text || "");
      setEditingQuestion(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    // ✅ Validate file count
    if (files.length > question.maxFiles) {
      toast.error(`You can upload up to ${question.maxFiles} files only!`);
      return;
    }

    // ✅ Validate file type and size
    const invalidFiles = files.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const isAllowed = question.allowedFileTypes?.includes(ext);
      const isSizeValid = file.size / 1024 / 1024 <= question.maxFileSize;
      return !isAllowed || !isSizeValid;
    });

    if (invalidFiles.length > 0) {
      toast.error("Some files are invalid (type or size). Please check.");
      return;
    }

    // ✅ Prepare metadata for DB (no raw file object stored)
    const fileMetadata = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type,
      lastModified: file.lastModified,
      previewURL: URL.createObjectURL(file), // useful for showing preview in UI
    }));

    // ✅ Save metadata to state (DB-ready)
    onUpdate({
      ...question,
      answer: fileMetadata,
    });

    toast.success("Files validated and ready for upload!");
  };

  const handleOptionChange = (idx, val) => {
    const opts = [...(question.options || [])];
    opts[idx] = val;
    onUpdate({ ...question, options: opts });
  };

  const handleOptionKeyDown = (e, idx) => {
    const opts = [...(question.options || [])];
    if (e.key === "Enter") {
      e.preventDefault();
      opts.splice(idx + 1, 0, "");
      onUpdate({ ...question, options: opts });
      setTimeout(() => setEditingOptionIdx(idx + 1), 10);
    } else if (e.key === "Backspace" && opts[idx].trim() === "") {
      e.preventDefault();
      const min = question.questionType === "dropdown" ? 1 : 2;
      if (opts.length > min) {
        opts.splice(idx, 1);
        const newSel =
          question.questionType === "checkbox"
            ? selectedIndexes
                .filter((i) => i !== idx)
                .map((i) => (i > idx ? i - 1 : i))
            : null;
        setSelectedIndexes(newSel || []);
        onUpdate({
          ...question,
          options: opts,
          selectedOption:
            question.questionType === "dropdown"
              ? null
              : question.selectedOption,
          selectedIndexes: newSel || [],
        });
        setTimeout(() => setEditingOptionIdx(Math.max(idx - 1, 0)), 10);
      }
    } else if (e.key === "Escape") {
      setEditingOptionIdx(null);
    }
  };

  useEffect(() => {
    const opts = question.options || [];
    if (opts.at(-1) === "") optionRefs.current[opts.length - 1]?.focus();
  }, [question.options]);

  const toggleSelection = (idx) => {
    if (question.questionType === "mcq") {
      setSelectedOption(idx);
      onUpdate({ ...question, selectedOption: idx });
    } else if (question.questionType === "checkbox") {
      const newSel = selectedIndexes.includes(idx)
        ? selectedIndexes.filter((i) => i !== idx)
        : [...selectedIndexes, idx];
      setSelectedIndexes(newSel);
      onUpdate({ ...question, selectedIndexes: newSel });
    } else if (question.questionType === "dropdown") {
      onUpdate({ ...question, selectedOption: idx });
    }
  };

  const renderOptions = () => {
    const opts = question.options || [];

    // MCQ
    if (question.questionType === "mcq") {
      return (
        <div className={styles.optionsSection}>
          {opts.map((opt, idx) => (
            <div key={idx} className={styles.optionRow}>
              <div
                className={styles.customRadio}
                onClick={() => toggleSelection(idx)}
              >
                {selectedOption === idx && (
                  <div className={styles.radioInnerCircle} />
                )}
              </div>
              {editingOptionIdx === idx ? (
                <input
                  ref={(el) => (optionRefs.current[idx] = el)}
                  className={styles.optionInput}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  onBlur={() => setEditingOptionIdx(null)}
                  onKeyDown={(e) => handleOptionKeyDown(e, idx)}
                  autoFocus
                />
              ) : (
                <span
                  className={styles.optionText}
                  onClick={() => setEditingOptionIdx(idx)}
                >
                  {opt || `Option ${idx + 1}`}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Checkbox
    if (question.questionType === "checkbox") {
      return (
        <div className={styles.optionsSection}>
          {opts.map((opt, idx) => (
            <div key={idx} className={styles.optionRow}>
              <div
                className={styles.customCheckbox}
                onClick={() => toggleSelection(idx)}
              >
                {selectedIndexes.includes(idx) && (
                  <div className={styles.checkboxTick} />
                )}
              </div>
              {editingOptionIdx === idx ? (
                <input
                  ref={(el) => (optionRefs.current[idx] = el)}
                  className={styles.optionInput}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  onBlur={() => setEditingOptionIdx(null)}
                  onKeyDown={(e) => handleOptionKeyDown(e, idx)}
                  autoFocus
                />
              ) : (
                <span
                  className={styles.optionText}
                  onClick={() => setEditingOptionIdx(idx)}
                >
                  {opt || `Option ${idx + 1}`}
                </span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Dropdown
    // Dropdown
    if (question.questionType === "dropdown") {
      const opts = question.options || [];

      const handleDropdownOptionKeyDown = (e, idx) => {
        const updatedOpts = [...opts];

        if (e.key === "Enter") {
          e.preventDefault();
          updatedOpts.splice(idx + 1, 0, "");
          onUpdate({ ...question, options: updatedOpts });
          setTimeout(() => setEditingOptionIdx(idx + 1), 10);
        } else if (e.key === "Backspace" && updatedOpts[idx].trim() === "") {
          e.preventDefault();
          if (updatedOpts.length > 1) {
            updatedOpts.splice(idx, 1);
            const newSelected =
              selectedOption === idx
                ? null
                : selectedOption > idx
                ? selectedOption - 1
                : selectedOption;
            setSelectedOption(newSelected);
            onUpdate({
              ...question,
              options: updatedOpts,
              selectedOption: newSelected,
            });
            setTimeout(() => setEditingOptionIdx(Math.max(idx - 1, 0)), 10);
          }
        } else if (e.key === "Escape") {
          setEditingOptionIdx(null);
        }
      };

      return (
        <div className={styles.dropdownWrapper}>
          {/* Dropdown Header */}
          <div
            className={styles.dropdownHeader}
            onClick={() => setDatePickerOpen((open) => !open)}
          >
            {selectedOption !== null
              ? opts[selectedOption]
              : "Select an option"}
            <span className={styles.dropdownArrow}>▾</span>
          </div>

          {/* Dropdown Menu */}
          {datePickerOpen && (
            <div className={styles.dropdownMenu}>
              {opts.map((opt, idx) => (
                <div
                  key={idx}
                  className={`${styles.dropdownMenuItem} ${
                    selectedOption === idx ? styles.selected : ""
                  }`}
                  onClick={() => {
                    if (editingOptionIdx !== idx) {
                      setSelectedOption(idx); // single click selects
                      onUpdate({ ...question, selectedOption: idx });
                    }
                  }}
                  onDoubleClick={() => setEditingOptionIdx(idx)} // double click to edit
                >
                  {editingOptionIdx === idx ? (
                    <input
                      ref={(el) => (optionRefs.current[idx] = el)}
                      className={styles.optionInput}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      onBlur={() => setEditingOptionIdx(null)}
                      onKeyDown={(e) => handleDropdownOptionKeyDown(e, idx)}
                      autoFocus
                    />
                  ) : (
                    <span>{opt || `Drop Down Option ${idx + 1}`}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Date
    if (question.questionType === "date") {
      let selectedDate = null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(question.answer || "")) {
        const parsed = parseISO(question.answer);
        if (!isNaN(parsed)) selectedDate = parsed;
      }
      return (
        <div>
          {!datePickerOpen ? (
            <div
              className={styles.dateBox}
              onClick={() => setDatePickerOpen(true)}
            >
              {selectedDate ? (
                selectedDate.toLocaleDateString("en-GB")
              ) : (
                <span className={styles.datePlaceholder}>Select a date</span>
              )}
            </div>
          ) : (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                const out =
                  date instanceof Date && !isNaN(date)
                    ? date.toISOString().slice(0, 10)
                    : "";
                onUpdate({ ...question, answer: out });
                setDatePickerOpen(false);
              }}
              ref={dateInputRef}
              inline
              dateFormat="dd/MM/yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(2100, 11, 31)}
              onClickOutside={() => setDatePickerOpen(false)}
            />
          )}
        </div>
      );
    }

    // File Upload
    // File Upload
    if (question.questionType === "file") {
      const fileTypesRow1 = ["image", "pdf", "ppt", "document"];
      const fileTypesRow2 = ["video", "zip", "audio", "spreadsheet"];

      const handleFileCountChange = (e) => {
        const value = Number(e.target.value);
        if (value >= 0) {
          onUpdate({ ...question, maxFiles: value });
        }
      };

      const handleFileSizeChange = (e) => {
        const value = Number(e.target.value);
        if (value > 100) {
          toast.error("Max file size cannot exceed 100 MB");
        } else {
          onUpdate({ ...question, maxFileSize: value });
        }
      };

      const toggleFileType = (type) => {
        const updatedTypes = question.allowedFileTypes?.includes(type)
          ? question.allowedFileTypes.filter((t) => t !== type)
          : [...(question.allowedFileTypes || []), type];

        onUpdate({ ...question, allowedFileTypes: updatedTypes });
      };

      return (
        <div className={styles.fileUploadSection}>
          {/* Line 1: Number of Files + Types */}
          <div className={styles.fileRow}>
            <label className={styles.label}>Number of Files:</label>
            <input
              type="number"
              min="1"
              className={styles.smallInput}
              value={question.maxFiles || ""}
              onChange={handleFileCountChange}
            />
            <div className={styles.fileTypesRow}>
              {fileTypesRow1.map((type) => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={question.allowedFileTypes?.includes(type) || false}
                    onChange={() => toggleFileType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Line 2: Max File Size + Types */}
          <div className={styles.fileRow}>
            <label className={styles.label}>Max File Size:</label>
            <input
              type="number"
              min="1"
              className={styles.smallInput}
              value={question.maxFileSize || ""}
              onChange={handleFileSizeChange}
            />
            <span className={styles.mbLabel}>MB</span>
            <div className={styles.fileTypesRow}>
              {fileTypesRow2.map((type) => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={question.allowedFileTypes?.includes(type) || false}
                    onChange={() => toggleFileType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Linear
    if (question.questionType === "linear") {
      const min = 0;
      const max = 10;
      const value = typeof question.answer === "number" ? question.answer : 5;
      return (
        <div className={styles.linearSection}>
          <div className={styles.linearWrap}>
            <span className={styles.linearMin}>{min}</span>
            <div className={styles.sliderBox}>
              <input
                type="range"
                className={styles.linearSlider}
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={(e) =>
                  onUpdate({ ...question, answer: Number(e.target.value) })
                }
              />
              <div className={styles.linearSliderValue}>{value}</div>
            </div>
            <span className={styles.linearMax}>{max}</span>
          </div>
        </div>
      );
    }

    // Rating
    if (question.questionType === "rating") {
      const maxStars = 5;
      const value = Number(question.answer) || 0;
      const Star = ({ i }) => (
        <span
          className={`${styles.star} ${
            i <= (ratingHover || value) ? styles.starFilled : styles.starEmpty
          }`}
          onClick={() => onUpdate({ ...question, answer: i })}
          onMouseEnter={() => setRatingHover(i)}
          onMouseLeave={() => setRatingHover(0)}
        >
          ★
        </span>
      );
      return (
        <div className={styles.ratingSection}>
          <div className={styles.starRow}>
            {[...Array(maxStars)].map((_, i) => (
              <Star key={i + 1} i={i + 1} />
            ))}
          </div>
          <div className={styles.ratingValue}>{value > 0 ? value : ""}</div>
        </div>
      );
    }

    // Short / Long Answer
    if (question.questionType === "short") {
      return (
        <input
          className={styles.shortInput}
          placeholder="Short answer"
          value={question.answer || ""}
          onChange={(e) => onUpdate({ ...question, answer: e.target.value })}
        />
      );
    }

    if (question.questionType === "long") {
      return (
        <textarea
          className={styles.longInput}
          placeholder="Long answer"
          rows={3}
          value={question.answer || ""}
          onChange={(e) => onUpdate({ ...question, answer: e.target.value })}
        />
      );
    }

    return null;
  };

  const selectedType = QUESTION_TYPES.find(
    (t) => t.key === question.questionType
  );

  return (
    <div className={styles.qBlock}>
      <div className={styles.qHeader}>
        <span className={styles.serialNum}>{index + 1}.</span>
        {editingQuestion ? (
          <input
            ref={questionInputRef}
            className={styles.questionInput}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onBlur={saveQuestionText}
            onKeyDown={handleQuestionKeyDown}
            maxLength={110}
          />
        ) : (
          <span
            className={styles.questionText}
            role="textbox"
            tabIndex={0}
            onClick={() => setEditingQuestion(true)}
            onKeyDown={(e) => e.key === "Enter" && setEditingQuestion(true)}
          >
            {question.text || "Enter your question"}
          </span>
        )}
        <div className={styles.dropdownWrap}>
          <button
            className={styles.dropdownButton}
            aria-haspopup="listbox"
            aria-expanded={typeMenuOpen}
            onClick={(e) => {
              e.preventDefault();
              setTypeMenuOpen((open) => !open);
            }}
          >
            {selectedType ? selectedType.label : "Select Type"}
          </button>
          {typeMenuOpen && (
            <div className={styles.typeMenu} role="listbox">
              {QUESTION_TYPES.map((t) => (
                <div
                  key={t.key}
                  role="option"
                  aria-selected={selectedType?.key === t.key}
                  className={styles.typeMenuItem}
                  onClick={() => {
                    onUpdate({
                      ...question,
                      questionType: t.key, // ✅ Correctly update the field used everywhere
                      options:
                        t.key === "dropdown"
                          ? [""]
                          : ["mcq", "checkbox"].includes(t.key)
                          ? ["", ""]
                          : [],
                      answer: t.key === "linear" ? 5 : "",
                      selectedOption: null,
                      selectedIndexes: [],
                    });

                    setTypeMenuOpen(false);
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {renderOptions()}
    </div>
  );
};

export default QuestionBlock;
