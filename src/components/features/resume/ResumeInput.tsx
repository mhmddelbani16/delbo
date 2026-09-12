"use client";

import { useRef, useState } from "react";
import {
  validateResumeFile,
  validateResumeText,
} from "@/utils/validation";

export type ResumeInputValue =
  | { mode: "paste"; text: string; file: null }
  | { mode: "upload"; text: ""; file: File | null };

export function ResumeInput({
  onChange,
}: {
  onChange: (value: ResumeInputValue & { isValid: boolean }) => void;
}) {
  const [mode, setMode] = useState<"paste" | "upload">("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function switchMode(next: "paste" | "upload") {
    setMode(next);
    setError(null);
    if (next === "paste") {
      setFile(null);
      const result = validateResumeText(text);
      onChange({ mode: "paste", text, file: null, isValid: result.valid });
    } else {
      setText("");
      onChange({ mode: "upload", text: "", file, isValid: file !== null });
    }
  }

  function handleTextChange(value: string) {
    setText(value);
    const result = validateResumeText(value);
    setError(value.length === 0 ? null : result.valid ? null : result.message);
    onChange({ mode: "paste", text: value, file: null, isValid: result.valid });
  }

  function handleFileSelect(selected: File | null) {
    if (!selected) {
      setFile(null);
      setError(null);
      onChange({ mode: "upload", text: "", file: null, isValid: false });
      return;
    }

    const result = validateResumeFile(selected);
    if (!result.valid) {
      setFile(null);
      setError(result.message);
      onChange({ mode: "upload", text: "", file: null, isValid: false });
      return;
    }

    setFile(selected);
    setError(null);
    onChange({ mode: "upload", text: "", file: selected, isValid: true });
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          Your resume
        </h2>
        <div className="flex rounded-lg border border-line p-1 text-sm">
          <button
            type="button"
            onClick={() => switchMode("paste")}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              mode === "paste"
                ? "bg-primary text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Paste text
          </button>
          <button
            type="button"
            onClick={() => switchMode("upload")}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              mode === "upload"
                ? "bg-primary text-white"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Upload DOCX
          </button>
        </div>
      </div>

      <div className="mt-4">
        {mode === "paste" ? (
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste your resume text here"
            rows={10}
            className="w-full resize-y rounded-lg border border-line bg-paper p-4 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-paper px-6 py-10 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files?.[0] ?? null;
              handleFileSelect(dropped);
            }}
          >
            <p className="text-sm text-ink-muted">
              {file ? (
                <span className="font-medium text-ink">{file.name}</span>
              ) : (
                "Drag a .docx file here, or"
              )}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
            >
              {file ? "Choose a different file" : "Browse files"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-ink-muted">.docx only, up to 5MB</p>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
