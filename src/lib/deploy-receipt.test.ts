import { describe, expect, it } from "vitest";
import { tryParseCreatedAccountIdFromDeployReturnData } from "./deploy-receipt";

describe("tryParseCreatedAccountIdFromDeployReturnData", () => {
  it("parses a 32-byte return buffer", () => {
    const id = "a".repeat(64);
    expect(tryParseCreatedAccountIdFromDeployReturnData(`0x${id}`)).toBe(id.toLowerCase());
  });

  it("uses the last 32 bytes when return data is longer", () => {
    const suffix = "b".repeat(64);
    expect(tryParseCreatedAccountIdFromDeployReturnData(`0x${"c".repeat(128)}${suffix}`)).toBe(
      suffix.toLowerCase(),
    );
  });

  it("returns null for empty or short data", () => {
    expect(tryParseCreatedAccountIdFromDeployReturnData(undefined)).toBe(null);
    expect(tryParseCreatedAccountIdFromDeployReturnData("0x")).toBe(null);
    expect(tryParseCreatedAccountIdFromDeployReturnData("0xabcd")).toBe(null);
  });
});
