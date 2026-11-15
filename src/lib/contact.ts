import { sammy } from "@/config/sammy";

export function createEmailDraft(formData: FormData): string {
  const value = (key: string) => String(formData.get(key) ?? "").trim();
  const subject = value("subject") || "Portfolio project enquiry";
  const body = [
    `Name: ${value("name")}`,
    `Email: ${value("email")}`,
    "",
    value("message"),
  ].join("\n");

  return `mailto:${sammy.contact.email}?${new URLSearchParams({ subject, body })}`;
}
