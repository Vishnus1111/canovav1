// src/components/EditableText/EditableText.jsx
import React, { useState, useRef, useEffect } from 'react';

const EditableText = ({
  text,
  onChange,
  className,
  inputClassName,
  maxLength = 42,
  placeholder = "Enter text...",
  style,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const inputRef = useRef();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const save = () => {
    if (draft.trim()) {
      onChange(draft.trim());
    }
    setEditing(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') {
      setDraft(text);
      setEditing(false);
    }
  };

  return editing ? (
    <input
      ref={inputRef}
      value={draft}
      className={inputClassName}
      style={style}
      onChange={e => setDraft(e.target.value)}
      maxLength={maxLength}
      onBlur={save}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  ) : (
    <span
      className={className}
      style={style}
      onDoubleClick={() => setEditing(true)}
      title="Double-click to edit"
    >
      {text}
    </span>
  );
};

export default EditableText;
