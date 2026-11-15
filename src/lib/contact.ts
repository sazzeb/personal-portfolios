export function createEmailDraft(formData: FormData): string {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const subject = value("subject") || "Portfolio project enquiry";
  const body = [
    `Name: ${value("name")}`,
    `Email: ${value("email")}`,
    value("phone") ? `Phone: ${value("phone")}` : "",
    "",
    value("message"),
  ].join("\n");

  return `mailto:example@info.com?${new URLSearchParams({ subject, body })}`;
}
