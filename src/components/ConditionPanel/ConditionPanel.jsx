import React from "react";

const ConditionPanel = ({ question, pages, onSave }) => {
  const [selectedValue, setSelectedValue] = React.useState("");
  const [goToPage, setGoToPage] = React.useState("");
  const [otherwisePage, setOtherwisePage] = React.useState("");

  const isOptionBased = ["mcq", "checkbox", "dropdown"].includes(question.questionType);

  const handleSave = () => {
    if (!goToPage && !otherwisePage) return;

    onSave({
      answer: selectedValue,
      goToPage,
      otherwisePage,
    });
  };

  return (
    <div style={{ padding: "1rem", background: "#f7f7f7", borderRadius: "8px" }}>
      <h4>Set Condition</h4>

      {/* Value to check */}
      {isOptionBased ? (
        <>
          <label>Choose option to match:</label>
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="">-- Select --</option>
            {(question.options || []).map((opt, idx) => (
              <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label>Enter value to match:</label>
          <input
            type="text"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          />
        </>
      )}

      {/* Page on match */}
      <label>If matched, go to:</label>
      <select value={goToPage} onChange={(e) => setGoToPage(e.target.value)}>
        <option value="">-- Select Page --</option>
        {pages.map((p, idx) => (
          <option key={idx} value={p.pageId || p.title || `Page ${idx + 1}`}>
            {p.title || `Page ${idx + 1}`}
          </option>
        ))}
      </select>

      {/* Page if not matched */}
      <label>If not matched, go to:</label>
      <select
        value={otherwisePage}
        onChange={(e) => setOtherwisePage(e.target.value)}
      >
        <option value="">-- Select Page --</option>
        {pages.map((p, idx) => (
          <option key={idx} value={p.pageId || p.title || `Page ${idx + 1}`}>
            {p.title || `Page ${idx + 1}`}
          </option>
        ))}
      </select>

      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        Save Condition
      </button>
    </div>
  );
};

export default ConditionPanel;
