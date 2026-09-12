import { describe, it, expect } from "vitest";
import { parseTailoredResume, stripCodeFences } from "@/lib/ai/parseTailoredResponse";

const VALID_RESUME = {
  summary: "Backend engineer focused on scalable APIs.",
  skills: ["Python", "Docker"],
  experience: [
    { title: "Software Engineer", company: "Acme", bullets: ["Built APIs"] },
  ],
  projects: [],
  education: [],
  gaps: ["TypeScript"],
};

describe("parseTailoredResume — AI structured-response validation", () => {
  it("parses clean valid JSON", () => {
    const result = parseTailoredResume(JSON.stringify(VALID_RESUME));
    expect(result).not.toBeNull();
    expect(result?.summary).toBe(VALID_RESUME.summary);
  });

  it("parses JSON wrapped in markdown code fences", () => {
    const raw = "```json\n" + JSON.stringify(VALID_RESUME) + "\n```";
    const result = parseTailoredResume(raw);
    expect(result).not.toBeNull();
    expect(result?.skills).toEqual(VALID_RESUME.skills);
  });

  it("parses JSON wrapped in fences with no language tag", () => {
    const raw = "```\n" + JSON.stringify(VALID_RESUME) + "\n```";
    expect(parseTailoredResume(raw)).not.toBeNull();
  });

  it("returns null for unparseable output (not JSON at all)", () => {
    const raw = "Sure! Here's the tailored resume you asked for.";
    expect(parseTailoredResume(raw)).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    const incomplete = { summary: "Missing everything else" };
    expect(parseTailoredResume(JSON.stringify(incomplete))).toBeNull();
  });

  it("returns null when a field has the wrong type", () => {
    const wrongType = { ...VALID_RESUME, skills: "Python, Docker" }; // should be an array
    expect(parseTailoredResume(JSON.stringify(wrongType))).toBeNull();
  });

  it("defaults optional arrays (projects, education, gaps) when omitted", () => {
    const minimal = {
      summary: "A summary.",
      skills: ["Python"],
      experience: [],
    };
    const result = parseTailoredResume(JSON.stringify(minimal));
    expect(result?.projects).toEqual([]);
    expect(result?.education).toEqual([]);
    expect(result?.gaps).toEqual([]);
  });
});

describe("stripCodeFences", () => {
  it("extracts content from a fenced block", () => {
    expect(stripCodeFences("```json\n{\"a\":1}\n```").trim()).toBe('{"a":1}');
  });

  it("returns the original text when there are no fences", () => {
    expect(stripCodeFences("plain text")).toBe("plain text");
  });
});
