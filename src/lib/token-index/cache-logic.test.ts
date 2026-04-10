import { describe, expect, it } from "vitest";
import { defaultTokenIndexCacheTtlSeconds, isCacheFresh, tokenIndexCacheFileBaseName } from "./cache-logic";

describe("tokenIndexCacheFileBaseName", () => {
  it("sanitizes network id", () => {
    expect(tokenIndexCacheFileBaseName("testnet", 0, 10)).toBe("testnet_0_10");
    expect(tokenIndexCacheFileBaseName("mainnet", 100, 200)).toBe("mainnet_100_200");
  });
});

describe("isCacheFresh", () => {
  it("respects ttl", () => {
    const t0 = "2026-01-01T00:00:00.000Z";
    expect(isCacheFresh(t0, 60, Date.parse("2026-01-01T00:00:30.000Z"))).toBe(true);
    expect(isCacheFresh(t0, 60, Date.parse("2026-01-01T00:01:30.000Z"))).toBe(false);
  });

  it("rejects invalid iso", () => {
    expect(isCacheFresh("not-a-date", 60)).toBe(false);
  });

  it("rejects non-positive ttl", () => {
    expect(isCacheFresh("2026-01-01T00:00:00.000Z", 0)).toBe(false);
  });
});

describe("defaultTokenIndexCacheTtlSeconds", () => {
  it("defaults to 600 when env unset", () => {
    const a = process.env.TOKEN_INDEX_CACHE_TTL_SEC;
    const b = process.env.TOKEN_INDEX_CACHE_TTL_SECONDS;
    delete process.env.TOKEN_INDEX_CACHE_TTL_SEC;
    delete process.env.TOKEN_INDEX_CACHE_TTL_SECONDS;
    expect(defaultTokenIndexCacheTtlSeconds()).toBe(600);
    if (a !== undefined) process.env.TOKEN_INDEX_CACHE_TTL_SEC = a;
    if (b !== undefined) process.env.TOKEN_INDEX_CACHE_TTL_SECONDS = b;
  });
});
