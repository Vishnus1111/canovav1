import React, { useState } from "react";
import styles from "./FormPreview.module.css";

const FormPreview = ({ formData, onBackToEdit }) => {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [showFileModal, setShowFileModal] = useState(false);

  const { title, pages, pageBlocks, bgColor, sectionColor } = formData;

  const handleNextPage = () => {
    if (currentPreviewPage < pages.length - 1) {
      setCurrentPreviewPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPreviewPage > 0) {
      setCurrentPreviewPage((prev) => prev - 1);
    }
  };

  const currentBlocks = pageBlocks[currentPreviewPage] || [];
  const isLastPage = currentPreviewPage === pages.length - 1;

  // Place this inside FormPreview, before renderBlocksWithSections
  const renderBlockOutsideSection = (block, index) => {
    if (block.type === "question") {
      return (
        <div key={block.id} className={styles.blockWrapper}>
          <QuestionBlock
            block={block}
            index={index}
            openFileModal={() => setShowFileModal(true)}
          />
        </div>
      );
    } else if (["image", "video", "text"].includes(block.type)) {
      return <MediaBlock key={block.id} block={block} />;
    }
    return null;
  };

  const renderBlocksWithSections = () => {
    const rendered = [];

    currentBlocks.forEach((block, index) => {
      if (block.type === "section") {
        // ✅ Render section with its internal questions/media (if present)
        rendered.push(
          <SectionBlock
            key={block.id}
            section={block}
            blocks={block.questions || []} // ✅ Pull questions from section.questions
            sectionColor={sectionColor}
            openFileModal={() => setShowFileModal(true)}
          />
        );
      } else {
        // ✅ Render blocks outside any section
        rendered.push(renderBlockOutsideSection(block, index));
      }
    });

    return rendered;
  };

  return (
    <div className={styles.previewContainer}>
      {/* Form Preview */}
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
      <div className={styles.formPreview}>
        <div
          className={styles.formContainer}
          style={{ backgroundColor: bgColor }}
        >
          <div className={styles.formTitle}>
            <h1>{title}</h1>
          </div>
          <div className={styles.blocksContainer}>
            {renderBlocksWithSections()}

            {/* Fallback content if no blocks */}
            {currentBlocks.length === 0 && (
              <div
                style={{ color: "white", padding: "20px", textAlign: "center" }}
              >
                No content added to this page yet
              </div>
            )}
          </div>

          {/* Form End Message or Next Button */}
          {isLastPage && currentBlocks.length === 0 ? (
            <div className={styles.formEndMessage}>
              <h2>Form Completed!</h2>
              <p>Thank you for your responses.</p>
            </div>
          ) : (
            <div className={styles.formNextContainer}>
              {!isLastPage ? (
                <button className={styles.formNextBtn} onClick={handleNextPage}>
                  Next
                </button>
              ) : (
                <div className={styles.formEndText}>Form is ended</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      {showFileModal && (
        <div className={styles.fileModalOverlay}>
          <div className={styles.fileModal}>
            <button
              className={styles.closeModal}
              onClick={() => setShowFileModal(false)}
            >
              ✕
            </button>
            <h3>Upload</h3>
            <p>Drag & drop files to upload</p>
            <div className={styles.uploadBox}>
              <p>Consider upto 200 MB</p>
              <button className={styles.browseBtn}>Browse Files</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.previewNavigation}>
        <div className={styles.leftNavigation}>
          <button className={styles.backToEditBtn} onClick={onBackToEdit}>
            Back to Edit
          </button>
        </div>
        <div className={styles.rightNavigation}>
          <div className={styles.pageNavigation}>
            {currentPreviewPage > 0 && (
              <button className={styles.prevBtn} onClick={handlePrevPage}>
                Previous
              </button>
            )}
            {/* Next button moved inside form container */}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ SectionBlock Component
const SectionBlock = ({ section, blocks, sectionColor, openFileModal }) => {
  return (
    <div
      className={styles.sectionBlock}
      style={{ backgroundColor: section.color || sectionColor }}
    >
      <div className={styles.sectionHeader}>
        <h3>{section.title || "Untitled Section"}</h3>
      </div>
      <div className={styles.sectionContent}>
        {blocks.length > 0 ? (
          blocks.map((block, idx) => {
            if (block.type === "question") {
              return (
                <QuestionBlock
                  key={block.id || idx}
                  block={block}
                  index={idx}
                  openFileModal={openFileModal}
                />
              );
            } else if (["image", "video", "text"].includes(block.type)) {
              return <MediaBlock key={block.id || idx} block={block} />;
            }
            return null;
          })
        ) : (
          <div className={styles.emptySection}>
            No questions in this section
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ QuestionBlock Component (Preview)
const QuestionBlock = ({ block, index, openFileModal }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [linearValue, setLinearValue] = useState(5);

  // Debug logging
  console.log("QuestionBlock props:", { block, index });

  if (!block) {
    return null;
  }

  return (
    <div className={styles.questionInSection}>
      <label style={{ color: "#333", fontSize: "16px", fontWeight: "600" }}>
        Q{index + 1}. {block.text || "Untitled Question"}
      </label>

      {/* Short Answer */}
      {block.questionType === "short" && (
        <input
          type="text"
          className={styles.shortInput}
          placeholder="Your answer..."
        />
      )}

      {/* Long Answer */}
      {block.questionType === "long" && (
        <textarea
          className={styles.longInput}
          placeholder="Your answer..."
          rows={4}
        />
      )}

      {/* Multiple Choice (MCQ) */}
      {block.questionType === "mcq" && (
        <div className={styles.optionsSection}>
          {block.options && block.options.length > 0 ? (
            block.options.map((option, idx) => (
              <div key={idx} className={styles.optionRow}>
                <div
                  className={styles.customRadio}
                  onClick={() => setSelectedOption(idx)}
                >
                  {selectedOption === idx && (
                    <div className={styles.radioInnerCircle} />
                  )}
                </div>
                <span className={styles.optionText}>
                  {option || `Option ${idx + 1}`}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.noOptions}>No options available</div>
          )}
        </div>
      )}

      {/* Checkbox */}
      {block.questionType === "checkbox" && (
        <div className={styles.optionsSection}>
          {block.options && block.options.length > 0 ? (
            block.options.map((option, idx) => (
              <div key={idx} className={styles.optionRow}>
                <div
                  className={styles.customCheckbox}
                  onClick={() => {
                    const newSelection = selectedIndexes.includes(idx)
                      ? selectedIndexes.filter((i) => i !== idx)
                      : [...selectedIndexes, idx];
                    setSelectedIndexes(newSelection);
                  }}
                >
                  {selectedIndexes.includes(idx) && (
                    <div className={styles.checkboxTick} />
                  )}
                </div>
                <span className={styles.optionText}>
                  {option || `Option ${idx + 1}`}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.noOptions}>No options available</div>
          )}
        </div>
      )}

      {/* Dropdown */}
      {block.questionType === "dropdown" && (
        <div className={styles.dropdownWrapper}>
          <div
            className={styles.dropdownHeader}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedOption !== null &&
            block.options &&
            block.options[selectedOption]
              ? block.options[selectedOption]
              : "Select an option"}
            <span className={styles.dropdownArrow}>▾</span>
          </div>
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {block.options && block.options.length > 0 ? (
                block.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`${styles.dropdownMenuItem} ${
                      selectedOption === idx ? styles.selected : ""
                    }`}
                    onClick={() => {
                      setSelectedOption(idx);
                      setDropdownOpen(false);
                    }}
                  >
                    {option || `Option ${idx + 1}`}
                  </div>
                ))
              ) : (
                <div className={styles.dropdownMenuItem}>
                  No options available
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      {block.questionType === "rating" && (
        <div className={styles.ratingSection}>
          <div className={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  star <= (ratingHover || ratingValue)
                    ? styles.starFilled
                    : styles.starEmpty
                }`}
                onClick={() => setRatingValue(star)}
                onMouseEnter={() => setRatingHover(star)}
                onMouseLeave={() => setRatingHover(0)}
              >
                ★
              </span>
            ))}
          </div>
          <div className={styles.ratingValue}>
            {ratingValue > 0 ? ratingValue : ""}
          </div>
        </div>
      )}

      {/* Linear Scale */}
      {block.questionType === "linear" && (
        <div className={styles.linearSection}>
          <div className={styles.linearWrap}>
            <span className={styles.linearMin}>0</span>
            <div className={styles.sliderBox}>
              <input
                type="range"
                className={styles.linearSlider}
                min={0}
                max={10}
                step={1}
                value={linearValue}
                onChange={(e) => setLinearValue(Number(e.target.value))}
              />
              <div className={styles.linearSliderValue}>{linearValue}</div>
            </div>
            <span className={styles.linearMax}>10</span>
          </div>
        </div>
      )}

      {/* File Upload */}
      {block.questionType === "file" && (
        <button className={styles.fileUploadBtn} onClick={openFileModal}>
          Upload File
        </button>
      )}

      {/* Date */}
      {block.questionType === "date" && (
        <div className={styles.dateBox}>
          <span className={styles.datePlaceholder}>Select a date</span>
        </div>
      )}
    </div>
  );
};

// ✅ MediaBlock Component
const MediaBlock = ({ block }) => (
  <div className={styles.blockWrapper}>
    {block.type === "text" && <p>{block.content}</p>}
    {block.type === "image" && <img src={block.src} alt={block.alt} />}
    {block.type === "video" && <video controls src={block.src} />}
  </div>
);

export default FormPreview;
