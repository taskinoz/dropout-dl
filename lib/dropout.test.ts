import { test, expect } from "bun:test";
import { getCookies } from "./dropout";

test("getCookies returns error if credentials are empty", async () => {
  await expect(getCookies('', '')).rejects.toThrow();
});
