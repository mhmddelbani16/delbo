import { describe, it, expect } from "vitest";
import { containsKeyword, tokenizeSignificantWords } from "@/lib/matching/normalize";

describe("containsKeyword", () => {
  it("matches a plain word case-insensitively", () => {
    expect(containsKeyword("i love docker and kubernetes", "Docker")).toBe(true);
    expect(containsKeyword("I LOVE DOCKER", "docker")).toBe(true);
  });

  it("does not match a substring inside a longer word", () => {
    expect(containsKeyword("i enjoy javascript", "Java")).toBe(false);
  });

  it("matches terms containing regex special characters", () => {
    expect(containsKeyword("experience with c++ and node.js", "C++")).toBe(true);
    expect(containsKeyword("experience with c++ and node.js", "Node.js")).toBe(true);
    expect(containsKeyword("familiar with ci/cd pipelines", "CI/CD")).toBe(true);
  });

  it("matches multi-word phrases", () => {
    expect(containsKeyword("skilled in machine learning basics", "Machine Learning")).toBe(true);
  });

  it("returns false when the term is absent", () => {
    expect(containsKeyword("i only know python", "Rust")).toBe(false);
  });

  it("matches terms adjacent to punctuation", () => {
    expect(containsKeyword("tools: docker, aws, git.", "Docker")).toBe(true);
  });
});

describe("tokenizeSignificantWords", () => {
  it("drops short words and common stopwords", () => {
    const words = tokenizeSignificantWords("we are looking for a strong candidate with experience");
    expect(words).not.toContain("are");
    expect(words).not.toContain("for");
    expect(words).toContain("looking");
    expect(words).toContain("candidate");
  });

  it("strips punctuation before tokenizing", () => {
    const words = tokenizeSignificantWords("backend, frontend, and databases!");
    expect(words).toContain("backend");
    expect(words).toContain("frontend");
    expect(words).toContain("databases");
  });

  it("returns an empty array for empty input", () => {
    expect(tokenizeSignificantWords("")).toEqual([]);
  });
});
