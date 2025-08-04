// FormPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import UploadModal from "../../components/UploadModal/UploadModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormPreview from "../../components/FormPreview/FormPreview";

import styles from "./FormPage.module.css";
import FormPageSidebar from "../../components/FormPageSidebar/FormPageSidebar.jsx";
import EditableText from "../../components/EditableText.jsx";
import BlockRenderer from "../../components/Block Renderer/BlockRenderer.jsx";
import ConditionModal from "../../components/ConditionModal/ConditionModal.jsx";

import addQuestionIcon from "../../assets/options1/Add Question.png";
import addTextIcon from "../../assets/options1/Add Text.png";
import addConditionIcon from "../../assets/options1/Add Condition.png";
import addImageIcon from "../../assets/options1/Add Image.png";
import addVideoIcon from "../../assets/options1/Add Video.png";
import addSectionIcon from "../../assets/options1/Add Sections.png";

import SaveModal from "../../components/SaveModal/SaveModal.jsx";

import QuestionBlock from "../../components/QuestionBlock/QuestionBlock.jsx";

const FormPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName, formName, type } = location.state || {};

  const [pages, setPages] = useState([
    { id: uuid(), name: "Page 01" },
    { id: uuid(), name: "Page 02" },
  ]);

  const [answers, setAnswers] = useState({});
  const [showQ2, setShowQ2] = useState(false);
  const handleQ1Change = (e) => {
    const value = e.target.value;
    setAnswers((prev) => ({ ...prev, Q1: value }));
    if (value === "Option 01") {
      setShowQ2(true);
    } else {
      setShowQ2(false);
    }
  };

  const [conditions, setConditions] = useState({});
  const [showFlow, setShowFlow] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageBlocks, setPageBlocks] = useState({});
  const [title, setTitle] = useState(formName || "Untitled Form");
  const [bgColor, setBgColor] = useState("#B6B6B6");

  const containerRef = useRef(null);

  const [uploadType, setUploadType] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [sectionColor, setSectionColor] = useState("#B6B6B6");
  const [activeSectionId, setActiveSectionId] = useState(null);

  // ✅ Unified modal states
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  // ✅ Add this missing state
  const [showPreview, setShowPreview] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);

  const [activeTool, setActiveTool] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // ✅ Sync blocks per page
  useEffect(() => {
    setPageBlocks((prev) => ({ ...prev, [currentPage]: blocks }));
  }, [blocks, currentPage]);

  const addQuestion = () => {
    const newQuestion = {
      id: uuid(),
      type: "question",
      questionType: "short",
      text: "",
      options: [],
    };

    setBlocks((prev) => {
      if (activeSectionId) {
        return prev.map((block) =>
          block.id === activeSectionId && block.type === "section"
            ? { ...block, questions: [...(block.questions || []), newQuestion] }
            : block
        );
      }
      return [...prev, newQuestion];
    });
  };

  const addText = () => {
    const newText = { id: uuid(), type: "text", content: "" };
    setBlocks((prev) => {
      if (activeSectionId) {
        return prev.map((block) =>
          block.id === activeSectionId && block.type === "section"
            ? { ...block, questions: [...(block.questions || []), newText] }
            : block
        );
      }
      return [...prev, newText];
    });
  };

  const addSection = () =>
    setBlocks((prev) => [
      ...prev,
      {
        id: uuid(),
        type: "section",
        title: "Section title",
        color: sectionColor,
        questions: [],
      },
    ]);

  const addImage = () => {
    const newImage = { id: uuid(), type: "image", src: "", alt: "" };
    setBlocks((prev) => {
      if (activeSectionId) {
        return prev.map((block) =>
          block.id === activeSectionId && block.type === "section"
            ? { ...block, questions: [...(block.questions || []), newImage] }
            : block
        );
      }
      return [...prev, newImage];
    });
  };

  const addImageBlock = (pageId, imageMeta) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === pageId
          ? {
              ...p,
              blocks: [
                ...p.blocks,
                { id: uuid(), type: "image", data: imageMeta },
              ],
            }
          : p
      )
    );
  };

  const addVideo = () => {
    const newVideo = { id: uuid(), type: "video", src: "" };
    setBlocks((prev) => {
      if (activeSectionId) {
        return prev.map((block) =>
          block.id === activeSectionId && block.type === "section"
            ? { ...block, questions: [...(block.questions || []), newVideo] }
            : block
        );
      }
      return [...prev, newVideo];
    });
  };

  const updateBlock = (id, newData) =>
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...newData } : b))
    );

  const deleteBlock = (id) =>
    setBlocks((prev) => prev.filter((b) => b.id !== id));

  const handlePageSwitch = (idx) => {
    setPageBlocks((prev) => ({ ...prev, [currentPage]: blocks }));
    setCurrentPage(idx);
    setBlocks(pageBlocks[pages[idx].id] || []);
  };

  // ✅ Open Condition Modal handler
  const handleOpenConditionModal = (question = null) => {
    setActiveQuestion(question);
    setConditionModalOpen(true);
  };

  // ✅ Add this missing function
  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  // ✅ Add this condition at the beginning of return
  if (showPreview) {
    return (
      <FormPreview
        formData={{
          title,
          pages,
          pageBlocks,
          bgColor,
          sectionColor,
        }}
        onBackToEdit={handleBackToEdit}
      />
    );
  }

  if (showSaveModal) {
    console.log(
      "✅ Payload to backend:",
      JSON.stringify(
        {
          projectName,
          formName,
          type: "form",
          pages: pages.map((page, index) => ({
            id: page.id,
            blocks: (pageBlocks[index] || []).map((block) => ({
              id: block.id,
              type: block.type,
              data: block.data,
            })),
          })),
          conditions,
          createdBy: JSON.parse(localStorage.getItem("user"))?._id,
        },
        null,
        2
      )
    );
  }

  return (
    <div className={styles.container}>
      {/* ✅ Sidebar */}
      <FormPageSidebar
        pages={pages}
        setPages={setPages}
        currentPage={currentPage}
        onPageSelect={handlePageSwitch}
      />

      <div className={styles.mainWrapper}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <EditableText
            text={title}
            onChange={setTitle}
            className={styles.formTitle}
            inputClassName={styles.formTitleInput}
            maxLength={42}
          />

          {/* ✅ Update this section */}
          <div className={styles.topBarButtons}>
            <button className={styles.previewBtn} onClick={handlePreview}>
              Preview
            </button>
            <button
              className={styles.saveBtn}
              onClick={() => setShowSaveModal(true)}
            >
              Save
            </button>
          </div>
        </div>

        {/* Content Row */}
        <div className={styles.contentRow}>
          {!showFlow ? (
            <>
              {/* Form Builder Area */}
              <div className={styles.formBuilderArea}>
                {blocks.map((block, i) => {
                  if (block.type === "question") {
                    return (
                      <QuestionBlock
                        key={block.id}
                        question={block.data || block} // ✅ Handles both `data` or direct structure
                        index={i}
                        onUpdate={(updatedQuestion) => {
                          setPages((prev) =>
                            prev.map((page) =>
                              page.id === pages[currentPage].id
                                ? {
                                    ...page,
                                    blocks: (page.blocks || []).map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: updatedQuestion }
                                        : b
                                    ),
                                  }
                                : page
                            )
                          );
                          setBlocks((prev) =>
                            prev.map((b) =>
                              b.id === block.id
                                ? { ...b, data: updatedQuestion }
                                : b
                            )
                          );
                        }}
                      />
                    );
                  }

                  if (
                    block.type === "image" ||
                    block.type === "video" ||
                    block.type === "section" ||
                    block.type === "text"
                  ) {
                    return (
                      <BlockRenderer
                        key={block.id}
                        block={{
                          ...block,
                          isActive: block.id === activeSectionId,
                          onSelect: (id) => {
                            setActiveSectionId((prev) =>
                              prev === id ? null : id
                            );
                          },
                        }}
                        index={i}
                        onUpdate={(newData) => updateBlock(block.id, newData)}
                        onDelete={() => deleteBlock(block.id)}
                        sectionColor={sectionColor}
                      />
                    );
                  }

                  return null;
                })}
              </div>

              {/* Right Sidebar */}
              <div className={styles.rightPanel}>
                <div className={styles.actionStack}>
                  <button className={styles.actionBtn} onClick={addQuestion}>
                    <img src={addQuestionIcon} alt="Add Question" />
                  </button>
                  <button className={styles.actionBtn} onClick={addText}>
                    <img src={addTextIcon} alt="Add Text" />
                  </button>
                  <button
                    className={styles.optionButton}
                    onClick={() => {
                      // Pick the last question block OR allow global condition if no question
                      const lastQuestion = [...blocks]
                        .reverse()
                        .find((b) => b.type === "question");
                      handleOpenConditionModal(
                        lastQuestion || {
                          id: "global",
                          text: "Global Condition",
                          questionType: "short",
                        }
                      );
                    }}
                  >
                    <img src={addConditionIcon} alt="Add Condition" />
                  </button>

                  <button
                    className={styles.actionBtn}
                    onClick={() => setUploadType("image")}
                  >
                    <img src={addImageIcon} alt="Add Image" />
                  </button>

                  <button
                    className={styles.actionBtn}
                    onClick={() => setUploadType("video")}
                  >
                    <img src={addVideoIcon} alt="Add Video" />
                  </button>
                  <button className={styles.actionBtn} onClick={addSection}>
                    <img src={addSectionIcon} alt="Add Sections" />
                  </button>

                  {/* Color Pickers */}
                  <div className={styles.colorPickContainer}>
                    <div>
                      <label>Background Color</label>
                      <div className={styles.colorRow}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                        />
                        <span>{bgColor.toUpperCase()} | 100%</span>
                      </div>
                    </div>
                    <div>
                      <label>Section Color</label>
                      <div className={styles.colorRow}>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={sectionColor}
                          onChange={(e) => setSectionColor(e.target.value)}
                        />
                        <span>{sectionColor.toUpperCase()} | 100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom-Aligned Next Button */}
                <button
                  className={styles.nextBtn}
                  onClick={() => setShowFlow(true)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            // Flow Diagram View
            <div className={styles.flowView} ref={containerRef}>
              <div
                className={styles.flowInner}
                style={{ height: `${pages.length * 200}px` }}
              >
                <svg
                  className={styles.flowSvg}
                  style={{ height: `${pages.length * 200}px` }}
                >
                  {pages.map((_, idx) => {
                    if (idx < pages.length - 1) {
                      return (
                        <line
                          key={idx}
                          x1="50%"
                          y1={150 + idx * 160}
                          x2="50%"
                          y2={150 + (idx + 1) * 160}
                          stroke="black"
                          strokeDasharray="6,6"
                          strokeWidth="2"
                        />
                      );
                    }
                    return null;
                  })}
                </svg>

                {/* Page Nodes */}
                <div className={styles.nodesWrapper}>
                  {pages.map((page, idx) => (
                    <div
                      key={idx}
                      id={`page-node-${idx}`}
                      className={styles.pageNode}
                      style={{
                        top: `${100 + idx * 160}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <h4>{page.name}</h4>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`${styles.nextBtn} ${styles.flowNextBtn}`}
                onClick={() => navigate("/save")}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* ✅ Removed old modal completely */}

        {/* Upload Modal */}
        {uploadType && (
          <>
            <div
              className={`${styles.formBuilderArea} ${
                uploadType ? styles.blur : ""
              }`}
            ></div>

            <UploadModal
              type={uploadType}
              onClose={() => setUploadType(null)}
              onUpload={(file) => {
                const fileURL = URL.createObjectURL(file);

                const newBlock =
                  uploadType === "image"
                    ? {
                        id: uuid(),
                        type: "image",
                        src: fileURL,
                        alt: file.name,
                      }
                    : { id: uuid(), type: "video", src: fileURL };

                setBlocks((prev) => {
                  if (activeSectionId) {
                    return prev.map((block) =>
                      block.id === activeSectionId && block.type === "section"
                        ? {
                            ...block,
                            questions: [...(block.questions || []), newBlock],
                          }
                        : block
                    );
                  }

                  return [...prev, newBlock];
                });

                toast.success(
                  `${
                    uploadType === "image" ? "Image" : "Video"
                  } uploaded successfully!`
                );
                setUploadType(null);
              }}
            />
          </>
        )}

        {/* ✅ Correct Condition Modal */}
        {conditionModalOpen && (
          <ConditionModal
            question={activeQuestion}
            pages={pages}
            onClose={() => setConditionModalOpen(false)}
            onSave={(conditionData) => {
              setConditions((prev) => ({
                ...prev,
                [activeQuestion?.id || "global"]: conditionData,
              }));
              setConditionModalOpen(false);
            }}
          />
        )}

        {/* Log the payload just before rendering JSX */}
        {showSaveModal && (
          <SaveModal
            onClose={() => setShowSaveModal(false)}
            projectName={projectName}
            userEmail={JSON.parse(localStorage.getItem("user"))?.email}
            formData={{
              projectName,
              formName,
              type: "form",
              pages: pages.map((page) => ({
                id: page.id,
                blocks: Array.isArray(pageBlocks[page.id])
                  ? pageBlocks[page.id]
                  : JSON.parse(pageBlocks[page.id] || "[]"),
              })),
              conditions,
              createdBy: JSON.parse(localStorage.getItem("user"))?._id,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FormPage;
