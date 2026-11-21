import isEmail from "validator/lib/isEmail";
export const authRoutes = {
  login: "/protected/login",
  register: "/protected/register",
  forgot: "/protected/forgot-password",
  reset: "/protected/reset-password",
  account: "/protected/admin",
};
export function nameError(value: string): string {
  const name = value.normalize("NFC").trim();
  return name.length <= 100 &&
    (name.match(/\p{L}/gu)?.length ?? 0) >= 2 &&
    /^[\p{L}\p{M} '.’\-]+$/u.test(name)
    ? ""
    : "Use at least two letters; spaces, apostrophes and hyphens are welcome.";
}
export function emailError(value: string): string {
  return isEmail(value.trim(), {
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false,
  }) && !/\.(invalid|test|localhost|local)$/i.test(value.trim())
    ? ""
    : "Enter a complete email address, such as name@example.com.";
}
let factory: Promise<import("@zxcvbn-ts/core").ZxcvbnFactory> | undefined;
export async function passwordStrength(password: string, inputs: string[]) {
  factory ??= Promise.all([
    import("@zxcvbn-ts/core"),
    import("@zxcvbn-ts/language-common"),
    import("@zxcvbn-ts/language-en"),
  ]).then(
    ([core, common, en]) =>
      new core.ZxcvbnFactory({
        translations: en.translations,
        graphs: common.adjacencyGraphs,
        dictionary: { ...common.dictionary, ...en.dictionary },
      }),
  );
  return /password|p[a@]ssw[o0]rd|qwerty|letmein|welcome|changeme/i.test(
    password,
  ) || password.trim().toLowerCase() === "correct horse battery staple"
    ? 0
    : (await factory).check(password, [...inputs, "Eko Samuel"]).score;
}
