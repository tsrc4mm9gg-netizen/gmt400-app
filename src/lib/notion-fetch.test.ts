import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotionUnavailableError, notionFetch, retryDelay } from './notion-fetch';

const originalFetch = global.fetch;
const token = 'test-token';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

const response = (status: number, retryAfter: string | null = null) =>
  new Response(null, { status, headers: retryAfter ? { 'retry-after': retryAfter } : {} });

describe('retryDelay', () => {
  it('respects numeric Retry-After', () => {
    expect(retryDelay(0, '2')).toBe(2000);
  });

  it('respects future HTTP-date Retry-After', () => {
    const now = 1_700_000_000_000;
    expect(retryDelay(0, 'Mon, 01 Jan 2024 00:00:10 GMT', now)).toBe(10_000);
  });

  it('uses exponential jittered backoff without Retry-After', () => {
    const delay = retryDelay(1, null, 0);
    expect(delay).toBeGreaterThanOrEqual(800);
    expect(delay).toBeLessThanOrEqual(1000);
  });

  it('rejects Retry-After beyond a safe timer range', () => {
    expect(() => retryDelay(0, '999999999999999')).toThrow(NotionUnavailableError);
  });
});

describe('notionFetch', () => {
  it('returns a successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200));
    global.fetch = fetchMock as typeof fetch;

    const result = await notionFetch('https://api.notion.com/v1/databases/x', { token });

    expect(result.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('retries 429 and returns the final response', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(429, '1')).mockResolvedValue(response(200));
    global.fetch = fetchMock as typeof fetch;

    const promise = notionFetch('https://api.notion.com/v1/databases/x', { token, revalidate: 0 });
    await vi.advanceTimersByTimeAsync(1000);
    const result = await promise;

    expect(result.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws NotionUnavailableError after exhausting attempts', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(503));
    global.fetch = fetchMock as typeof fetch;

    const promise = notionFetch('https://api.notion.com/v1/databases/x', { token, attempts: 2, revalidate: 0 });
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(promise).rejects.toBeInstanceOf(NotionUnavailableError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries network failures and logs the URL after the final attempt', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    global.fetch = fetchMock as typeof fetch;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const promise = notionFetch('https://api.notion.com/v1/databases/x', { token, attempts: 2, revalidate: 0 });
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(promise).rejects.toBeInstanceOf(NotionUnavailableError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('https://api.notion.com/v1/databases/x'), expect.anything());
  });

  it('returns non-retryable 404 without retrying', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(404));
    global.fetch = fetchMock as typeof fetch;

    const result = await notionFetch('https://api.notion.com/v1/databases/x', { token });

    expect(result.status).toBe(404);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
