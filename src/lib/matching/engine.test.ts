import { describe, it, expect } from "vitest";
import { computeMatch } from "@/lib/matching/engine";

describe("computeMatch", () => {
  it("scores an identical resume and job description near 100", () => {
    const text =
      "Experienced Python developer skilled in Django, PostgreSQL, Docker, AWS, and Agile methodologies.";
    const result = computeMatch(text, text);
    expect(result.score).toBe(100);
    expect(result.missingKeywords).toEqual([]);
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
  });

  it("identifies matched and missing keywords for a partial overlap", () => {
    const resume =
      "Software Engineer with experience in Python, FastAPI, PostgreSQL, and Docker. Used Agile and AWS.";
    const jd =
      "Looking for an engineer with TypeScript, Node.js, REST API, and SQL experience. Docker and AWS a plus. Agile team.";

    const result = computeMatch(resume, jd);

    expect(result.matchedKeywords).toEqual(
      expect.arrayContaining(["Docker", "AWS", "Agile"])
    );
    expect(result.missingKeywords).toEqual(
      expect.arrayContaining(["TypeScript", "Node.js", "REST API", "SQL"])
    );
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
  });

  it("falls back to general word overlap when the JD has no recognizable vocabulary", () => {
    const resume = "I enjoy long walks on the beach with my family every weekend.";
    const jd = "We seek someone who enjoys long walks on the beach with family every weekend.";

    const result = computeMatch(resume, jd);

    expect(result.matchedKeywords).toEqual([]);
    expect(result.missingKeywords).toEqual([]);
    expect(result.score).toBeGreaterThan(0); // general overlap still produces a signal
  });

  it("never returns a score outside 0-100", () => {
    const result = computeMatch("", "");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("handles completely unrelated resume and job description", () => {
    const resume = "Experienced pastry chef specializing in French desserts and cake decoration.";
    const jd =
      "Seeking a backend engineer with Kubernetes, PostgreSQL, and GraphQL experience for our platform team.";

    const result = computeMatch(resume, jd);
    expect(result.matchedKeywords).toEqual([]);
    expect(result.missingKeywords.length).toBeGreaterThan(0);
  });
});
