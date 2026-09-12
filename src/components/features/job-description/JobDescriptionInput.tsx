"use client";

import { useState } from "react";
import { validateJobDescription } from "@/utils/validation";

export function JobDescriptionInput({
  onChange,
}: {
  onChange: (value: { text: string; isValid: boolean }) => void;
}) {
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);

  const result = validateJobDescription(text);
  const showError = touched && text.length > 0 && !result.valid;

  function handleChange(value: string) {
    setText(value);
    if (!touched) setTouched(true);
    onChange({ text: value, isValid: validateJobDescription(value).valid });
  }

  return (
    <div className="rounded-xl border border-line bg-surface p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Job description
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Paste the full posting for the role you&rsquo;re applying to.
      </p>

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Paste the job description here"
        rows={12}
        className="mt-4 w-full resize-y rounded-lg border border-line bg-paper p-4 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
      />

      {showError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {result.message}
        </p>
      )}
    </div>
  );
}
