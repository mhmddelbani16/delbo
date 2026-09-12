import { z } from "zod";

// This is the contract between the AI layer and everything downstream
// (preview UI, DOCX export). Validating against it means we never trust
// unstructured model output directly.

export const experienceEntrySchema = z.object({
  title: z.string(),
  company: z.string(),
  bullets: z.array(z.string()),
});

export const projectEntrySchema = z.object({
  name: z.string(),
  bullets: z.array(z.string()),
});

export const educationEntrySchema = z.object({
  degree: z.string(),
  institution: z.string(),
  details: z.array(z.string()).optional().default([]),
});

export const tailoredResumeSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(experienceEntrySchema),
  projects: z.array(projectEntrySchema).default([]),
  education: z.array(educationEntrySchema).default([]),
  gaps: z.array(z.string()).default([]),
});

export type TailoredResume = z.infer<typeof tailoredResumeSchema>;
