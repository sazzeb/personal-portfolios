import { expect, test } from "@playwright/test";
import {
  emailError,
  nameError,
  passwordStrength,
} from "../../src/lib/auth-validation";

test("name validator accepts international names and rejects markup and controls", () => {
  for (const value of ["José O’Neil", "Eko Samuel", "李 明"])
    expect(nameError(value)).toBe("");
  for (const value of ["", "123", "A", "<script>", "John\nDoe"])
    expect(nameError(value)).not.toBe("");
});
test("email validator supports plus addressing and rejects malformed addresses", () => {
  for (const value of ["person+tag@example.com", "  Person@EXAMPLE.com  "])
    expect(emailError(value)).toBe("");
  for (const value of [
    "person@",
    "a..b@example.com",
    "a b@example.com",
    "person@localhost",
    "a@example.invalid",
  ])
    expect(emailError(value)).not.toBe("");
});
test("strength estimator rejects common patterns and accepts unique passphrases", async () => {
  for (const value of [
    "Password123456789!",
    "aaaaaaaaaaaaaaaaaaaa",
    "12345678901234567890",
    "correct horse battery staple",
  ])
    expect(await passwordStrength(value, [])).toBeLessThan(3);
  expect(
    await passwordStrength("Velvet! orbital canoe 92 quartz", []),
  ).toBeGreaterThanOrEqual(3);
});
