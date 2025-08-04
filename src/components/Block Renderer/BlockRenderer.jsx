import React from "react";
import QuestionBlock from "../QuestionBlock/QuestionBlock.jsx";
import { v4 as uuid } from "uuid";

export default function BlockRenderer({
  block,
  index,
  onUpdate,
  onDelete,
  focusPrevious,
  sectionColor,
}) {
  switch (block.type) {
    case "question":
      return (
        <QuestionBlock
          question={block}
          index={index}
          onUpdate={onUpdate}
          onDelete={onDelete}
          focusPrevious={focusPrevious}
        />
      );

    case "text":
      return (
        <textarea
          value={block.content}
          onChange={(e) => {
            onUpdate({ content: e.target.value });
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Enter text..."
          style={{
            width: "100%",
            resize: "none",
            overflow: "hidden",
            fontSize: "1rem",
            lineHeight: "1.5",
            minHeight: "50px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
      );

    case "image":
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10px 0",
          }}
        >
          <img
            src={block.src}
            alt={block.alt || "Uploaded"}
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              borderRadius: "8px",
            }}
          />
        </div>
      );

    case "video":
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "10px 0",
          }}
        >
          <video
            src={block.src}
            controls
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "350px",
              borderRadius: "8px",
              objectFit: "contain",
            }}
          />
        </div>
      );

    // ✅ Updated Section Block
    case "section":
      return (
        <div
          onClick={() => block.onSelect(block.id)}
          style={{
            backgroundColor: block.color || sectionColor,
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "12px",
            cursor: "pointer",
            border: block.isActive
              ? "2px solid #007bff"
              : "2px solid transparent",
          }}
        >
          {/* Section Title */}
          <h3 style={{ marginBottom: "12px" }}>
            {block.title || "Untitled Section"}
          </h3>

          {/* Render nested content: questions, text, images, videos */}
          {block.questions && block.questions.length > 0 && (
            <div style={{ marginLeft: "10px" }}>
              {block.questions.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: "10px" }}>
                  {q.type === "question" ? (
                    <QuestionBlock
                      question={q}
                      index={idx}
                      onUpdate={(newData) => {
                        const updatedQuestions = block.questions.map((ques) =>
                          ques.id === q.id ? { ...ques, ...newData } : ques
                        );
                        onUpdate({ questions: updatedQuestions });
                      }}
                      onDelete={() => {
                        const updatedQuestions = block.questions.filter(
                          (ques) => ques.id !== q.id
                        );
                        onUpdate({ questions: updatedQuestions });
                      }}
                    />
                  ) : q.type === "text" ? (
                    <textarea
                      value={q.content || ""}
                      onChange={(e) => {
                        const updatedQuestions = block.questions.map((ques) =>
                          ques.id === q.id
                            ? { ...ques, content: e.target.value }
                            : ques
                        );
                        onUpdate({ questions: updatedQuestions });
                      }}
                      placeholder="Enter text..."
                      style={{
                        width: "100%",
                        resize: "none",
                        overflow: "hidden",
                        fontSize: "1rem",
                        lineHeight: "1.5",
                        minHeight: "40px",
                        padding: "6px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                      }}
                    />
                  ) : q.type === "image" ? (
                    <img
                      src={q.src}
                      alt={q.alt || "Uploaded"}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "6px",
                      }}
                    />
                  ) : q.type === "video" ? (
                    <video
                      src={q.src}
                      controls
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        borderRadius: "6px",
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}

          
        </div>
      );

    default:
      return null;
  }
}
