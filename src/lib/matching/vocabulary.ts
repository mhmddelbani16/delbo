// The matching engine only ever looks for terms in this list (plus a
// generic word-overlap fallback in engine.ts). Keeping this as one
// editable list — rather than scattering strings through the engine
// logic — is what makes the "why did I get this score" question
// answerable, and what makes the list easy to grow later.
//
// Phrases are matched as whole phrases; single words are matched as
// whole words (so "AI" doesn't match inside "maintain").

export const KEYWORD_VOCABULARY: string[] = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "PHP", "Ruby", "Swift", "Kotlin", "SQL",

  // Web / frameworks
  "React", "Next.js", "Vue", "Angular", "Node.js", "Express", "FastAPI",
  "Django", "Flask", "Spring Boot", "REST API", "GraphQL", "HTML", "CSS",
  "Tailwind",

  // Data / infra
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS",
  "Azure", "Google Cloud", "CI/CD", "Git", "GitHub", "Linux", "Terraform",
  "Microservices",

  // AI / ML
  "Machine Learning", "Deep Learning", "Data Analysis", "Data Science",
  "TensorFlow", "PyTorch", "LLM", "NLP",

  // QA / testing
  "Playwright", "Selenium", "Manual Testing", "Test Automation", "QA",
  "Unit Testing", "Automated Testing",

  // Process / methodology
  "Agile", "Scrum", "Kanban", "Project Management", "Product Management",
  "Stakeholder Management", "Cross-functional",

  // Business / general professional
  "Leadership", "Communication", "Customer Service", "Sales", "Marketing",
  "SEO", "Content Strategy", "Negotiation", "Budgeting", "Forecasting",
  "Data Entry", "Bookkeeping", "Accounting", "Recruiting", "Onboarding",
  "Training", "Public Speaking", "Copywriting", "Social Media",

  // Design
  "UI/UX", "Figma", "Adobe Photoshop", "Adobe Illustrator", "Prototyping",

  // Soft/role-general terms
  "Problem Solving", "Team Collaboration", "Time Management",
  "Analytical Skills", "Attention to Detail",
];
