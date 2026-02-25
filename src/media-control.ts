import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type MediaControlDebugInfo = {
  query: string | null;
  stdout: string;
  stderr: string;
  error: string | null;
  payload: unknown | null;
  binary: string | null;
  attempts: string[];
  isNotInstalled: boolean;
};

function isMissingBinaryError(error: unknown): boolean {
  const code =
    error && typeof error === "object" && "code" in error ? String((error as { code?: unknown }).code || "") : "";
  if (code === "ENOENT") {
    return true;
  }

  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message || "")
      : String(error || "");
  return message.includes("ENOENT") || message.toLowerCase().includes("not found");
}

function readStringField(payload: unknown, key: string): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

export function formatNowPlayingSearchQuery(payload: unknown): string | null {
  const title = readStringField(payload, "title");
  const artist = readStringField(payload, "artist");

  if (!title) {
    return null;
  }

  return [title, artist].filter(Boolean).join(" ");
}

export async function inspectNowPlaying(): Promise<MediaControlDebugInfo> {
  if (process.platform !== "darwin") {
    return {
      query: null,
      stdout: "",
      stderr: "",
      error: "media-control is only supported on macOS",
      payload: null,
      binary: null,
      attempts: [],
      isNotInstalled: false,
    };
  }

  const candidates = [
    "media-control",
    "/opt/homebrew/bin/media-control",
    "/usr/local/bin/media-control",
    "/opt/local/bin/media-control",
    "/opt/homebrew/opt/media-control/bin/media-control",
    "/usr/local/opt/media-control/bin/media-control",
  ];
  const attempts: string[] = [];
  let missingBinaryAttempts = 0;
  const envPath = [process.env.PATH, "/opt/homebrew/bin", "/usr/local/bin", "/opt/local/bin"].filter(Boolean).join(":");

  for (const mediaControlBinary of candidates) {
    try {
      const { stdout, stderr } = await execFileAsync(mediaControlBinary, ["get"], {
        timeout: 3000,
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          PATH: envPath,
        },
      });

      const payload = JSON.parse(stdout) as unknown;
      return {
        query: formatNowPlayingSearchQuery(payload),
        stdout,
        stderr,
        error: null,
        payload,
        binary: mediaControlBinary,
        attempts,
        isNotInstalled: false,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isMissingBinaryError(error)) {
        missingBinaryAttempts += 1;
      }
      attempts.push(`${mediaControlBinary}: ${message}`);
    }
  }
  const isNotInstalled = missingBinaryAttempts === candidates.length;

  return {
    query: null,
    stdout: "",
    stderr: "",
    error: attempts.at(-1) || "Failed to execute media-control",
    payload: null,
    binary: null,
    attempts,
    isNotInstalled,
  };
}
