import type { AIProvider, TailorResult, TailorResumeInput } from "@/lib/ai/AIProvider";
import { TAILOR_SYSTEM_PROMPT, buildTailorUserPrompt, buildRepairPrompt } from "@/lib/ai/prompt";
import { parseTailoredResume } from "@/lib/ai/parseTailoredResponse";

const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const REQUEST_TIMEOUT_MS = 30_000;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

class ProviderError extends Error {
  constructor(public reason: "quota_exceeded" | "unavailable") {
    super(reason);
  }
}

export class CloudflareAIProvider implements AIProvider {
  async tailorResume(input: TailorResumeInput): Promise<TailorResult> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_AI_API_TOKEN;

    if (!accountId || !apiToken) {
      // Not configured yet — fail the same way an outage would, rather
      // than crashing the request.
      return { success: false, reason: "unavailable" };
    }

    const messages: ChatMessage[] = [
      { role: "system", content: TAILOR_SYSTEM_PROMPT },
      { role: "user", content: buildTailorUserPrompt(input) },
    ];

    try {
      let raw = await this.callModel(accountId, apiToken, messages);
      let parsed = parseTailoredResume(raw);

      if (!parsed) {
        // One repair/retry maximum, per spec — never loop.
        const repairMessages: ChatMessage[] = [
          ...messages,
          { role: "assistant", content: raw },
          { role: "user", content: buildRepairPrompt(raw) },
        ];
        raw = await this.callModel(accountId, apiToken, repairMessages);
        parsed = parseTailoredResume(raw);
      }

      if (!parsed) {
        return { success: false, reason: "invalid_response" };
      }

      return { success: true, data: parsed };
    } catch (error) {
      if (error instanceof ProviderError) {
        return { success: false, reason: error.reason };
      }
      return { success: false, reason: "unavailable" };
    }
  }

  private async callModel(
    accountId: string,
    apiToken: string,
    messages: ChatMessage[]
  ): Promise<string> {
    const model = process.env.CLOUDFLARE_AI_MODEL || DEFAULT_MODEL;
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
    } catch {
      throw new ProviderError("unavailable");
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 429) {
      throw new ProviderError("quota_exceeded");
    }

    if (!response.ok) {
      throw new ProviderError("unavailable");
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new ProviderError("unavailable");
    }

    const text = extractResponseText(body);
    if (text === null) {
      throw new ProviderError("unavailable");
    }

    return text;
  }
}

function extractResponseText(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const result = (body as Record<string, unknown>).result;
  if (typeof result !== "object" || result === null) return null;
  const response = (result as Record<string, unknown>).response;
  return typeof response === "string" ? response : null;
}
