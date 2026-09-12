import type { Metadata } from "next";
import { TailorFlow } from "@/components/features/TailorFlow";

export const metadata: Metadata = {
  title: "Add your resume — Delbo",
};

export default function AppPage() {
  return <TailorFlow />;
}
