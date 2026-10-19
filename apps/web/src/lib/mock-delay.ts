/**
 * Simulates network latency for mock API calls.
 * @param ms Delay in milliseconds. Default is 800ms.
 */
export async function mockDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
