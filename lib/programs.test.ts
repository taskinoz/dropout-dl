import { checkInstalledPrograms } from "./programs";
import { test, expect } from "bun:test";

test('checkInstalledPrograms', async () => {
  await expect(checkInstalledPrograms()).rejects.toThrow();
});
