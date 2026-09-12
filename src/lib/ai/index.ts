import type { AIProvider } from "@/lib/ai/AIProvider";
import { CloudflareAIProvider } from "@/lib/ai/CloudflareAIProvider";

export function getAIProvider(): AIProvider {
  return new CloudflareAIProvider();
}
