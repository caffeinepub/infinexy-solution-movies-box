/**
 * Retries a backend call when the canister is stopped (IC0508).
 * Waits 2s, 4s, 6s between attempts (up to 3 retries).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      const isStopped =
        msg.includes("IC0508") ||
        msg.includes("is stopped") ||
        msg.includes("canister is stopped");

      if (isStopped && attempt < retries) {
        const delay = (attempt + 1) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
  }
  // unreachable
  throw new Error("Retry exhausted");
}
