import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { TailoredResume } from "@/types/resume";
import type { ContactInfo } from "@/lib/parsing/contact";

const FONT = "Calibri";
const SECTION_SPACING_BEFORE = 280;
const SECTION_SPACING_AFTER = 120;

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: SECTION_SPACING_BEFORE, after: SECTION_SPACING_AFTER },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "0F172A" },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        font: FONT,
        color: "0F172A",
      }),
    ],
  });
}

function bodyText(
  text: string,
  options: { bold?: boolean; size?: number; color?: string } = {}
): TextRun {
  return new TextRun({
    text,
    size: options.size ?? 22,
    font: FONT,
    color: options.color ?? "000000",
    bold: options.bold ?? false,
  });
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [bodyText(text)],
  });
}

export async function generateResumeDocx(
  resume: TailoredResume,
  contact: ContactInfo
): Promise<Buffer> {
  const children: Paragraph[] = [];

  // Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: contact.name,
          bold: true,
          size: 40,
          font: FONT,
          color: "000000",
        }),
      ],
    })
  );

  // Contact line
  const contactLine = [contact.email, contact.phone].filter(Boolean).join("  |  ");
  if (contactLine) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [bodyText(contactLine, { size: 20, color: "3F3F3F" })],
      })
    );
  }

  // Summary
  if (resume.summary) {
    children.push(sectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [bodyText(resume.summary)],
      })
    );
  }

  // Skills
  if (resume.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [bodyText(resume.skills.join("  •  "))],
      })
    );
  }

  // Experience
  if (resume.experience.length > 0) {
    children.push(sectionHeading("Experience"));
    for (const entry of resume.experience) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            bodyText(entry.title, { bold: true }),
            bodyText(entry.company ? `  —  ${entry.company}` : ""),
          ],
        })
      );
      for (const bullet of entry.bullets) {
        children.push(bulletParagraph(bullet));
      }
    }
  }

  // Projects
  if (resume.projects.length > 0) {
    children.push(sectionHeading("Projects"));
    for (const entry of resume.projects) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [bodyText(entry.name, { bold: true })],
        })
      );
      for (const bullet of entry.bullets) {
        children.push(bulletParagraph(bullet));
      }
    }
  }

  // Education
  if (resume.education.length > 0) {
    children.push(sectionHeading("Education"));
    for (const entry of resume.education) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            bodyText(entry.degree, { bold: true }),
            bodyText(entry.institution ? `  —  ${entry.institution}` : ""),
          ],
        })
      );
      for (const detail of entry.details) {
        children.push(bulletParagraph(detail));
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 22, color: "000000" },
        },
      },
    },
  });

  return Packer.toBuffer(doc);
}
