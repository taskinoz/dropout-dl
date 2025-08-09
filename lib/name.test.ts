import { formatName } from "./name";
import {test, expect} from 'bun:test'

test("formatName", () => {
  expect(formatName("cash-n-guns")).toBe("Cash N Guns");
});
