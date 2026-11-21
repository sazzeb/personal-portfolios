"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import styles from "./admin.module.scss";
import recordsStyles from "./records.module.scss";
interface RecordItem {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role?: string;
  subject?: string;
  message?: string;
  forwarded_at?: string;
}
interface RecordsPage {
  records: RecordItem[];
  total: number;
  page: number;
  page_size: number;
}
const empty: RecordsPage = { records: [], total: 0, page: 1, page_size: 20 };
const date = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";
export function AdminRecords({ kind }: { kind: "inbox" | "users" }) {
  const [query, setQuery] = useState({ page: 1, search: "", refresh: 0 });
  const [draft, setDraft] = useState("");
  const [data, setData] = useState<RecordsPage>(empty);
  const [busy, setBusy] = useState(true),
    [error, setError] = useState("");
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    const parameters = new URLSearchParams({
      page: String(query.page),
      search: query.search,
    });
    fetch(`/api/auth/${kind}?${parameters}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.replace("/protected/login?reason=expired");
          return;
        }
        const result = await response.json();
        if (!response.ok || result.success !== true)
          throw new Error(result.message ?? "Unable to load records.");
        if (!Array.isArray(result.records) || !Number.isInteger(result.total))
          throw new Error("Unexpected server response.");
        if (!controller.signal.aborted) {
          setData(result);
          setError("");
        }
      })
      .catch((failure) => {
        if (!controller.signal.aborted) {
          setData(empty);
          setError(
            failure instanceof Error
              ? failure.message
              : "Unable to load records.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBusy(false);
      });
    return () => controller.abort();
  }, [kind, query]);
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal();
  }, [selected]);
  function move(page: number) {
    setBusy(true);
    setQuery((current) => ({ ...current, page }));
  }
  return (
    <section
      className={`${styles.card} ${styles.projectCard}`}
      aria-label={kind === "inbox" ? "Contact messages" : "User directory"}
      aria-busy={busy}
    >
      <div className={styles.cardHeading}>
        <div>
          <h2>
            {kind === "inbox"
              ? "Messages from your contact form"
              : "All registered accounts"}
          </h2>
          <p>
            {kind === "inbox"
              ? "Saved submissions after successful email forwarding."
              : "Account information only. Passwords and session secrets are never displayed."}
          </p>
        </div>
        <span className={styles.pill}>
          {data.total} {kind === "inbox" ? "messages" : "users"}
        </span>
      </div>
      <div className={recordsStyles.toolbar}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setBusy(true);
            setQuery((current) => ({
              page: 1,
              search: draft.trim(),
              refresh: current.refresh + 1,
            }));
          }}
        >
          <Search size={17} />
          <input
            aria-label={
              kind === "inbox" ? "Search contact messages" : "Search users"
            }
            placeholder={
              kind === "inbox"
                ? "Search sender, subject, or message…"
                : "Search name or email…"
            }
            value={draft}
            maxLength={100}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" disabled={busy}>
            Search
          </button>
        </form>
        <button
          className={styles.refresh}
          onClick={() => {
            setBusy(true);
            setQuery((current) => ({
              ...current,
              refresh: current.refresh + 1,
            }));
          }}
          disabled={busy}
        >
          <RefreshCw size={15} />
          Refresh list
        </button>
      </div>
      {error && (
        <p className={recordsStyles.error} role="alert">
          {error}
        </p>
      )}
      {busy && (
        <p className={recordsStyles.loading} role="status">
          Loading {kind === "inbox" ? "messages" : "users"}…
        </p>
      )}
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>{kind === "inbox" ? "SENDER" : "USER"}</th>
              <th>{kind === "inbox" ? "SUBJECT" : "ROLE"}</th>
              <th>RECEIVED / CREATED</th>
              {kind === "inbox" && <th>MESSAGE</th>}
            </tr>
          </thead>
          <tbody>
            {data.records.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={styles.projectIndex}>
                    {kind === "inbox" ? (
                      <Mail size={16} />
                    ) : (
                      <UserRound size={16} />
                    )}
                  </span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.email}</small>
                  </div>
                </td>
                <td>
                  {kind === "inbox" ? (
                    <span>{item.subject || "No subject"}</span>
                  ) : (
                    <span
                      className={
                        item.role === "admin"
                          ? recordsStyles.admin
                          : styles.published
                      }
                    >
                      {item.role === "admin" ? "Administrator" : "Member"}
                    </span>
                  )}
                </td>
                <td className={recordsStyles.timestamp}>
                  <time dateTime={item.created_at}>
                    {date(item.created_at)}
                  </time>
                </td>
                {kind === "inbox" && (
                  <td>
                    <button
                      className={recordsStyles.read}
                      onClick={() => setSelected(item)}
                      aria-label={`Read message from ${item.name}`}
                    >
                      Read message
                      <ChevronRight size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!busy && !error && !data.records.length && (
          <p className={styles.empty}>
            {query.search
              ? "No matching records. Try another search."
              : kind === "inbox"
                ? "No contact messages have been saved yet."
                : "No registered users found."}
          </p>
        )}
      </div>
      <div className={styles.tableFooter}>
        <span>
          {data.total
            ? `${(query.page - 1) * 20 + 1}–${Math.min(query.page * 20, data.total)} of ${data.total}`
            : "0 records"}
        </span>
        <div className={recordsStyles.pagination}>
          <button
            aria-label="Previous page"
            disabled={busy || query.page <= 1}
            onClick={() => move(query.page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span>Page {query.page}</span>
          <button
            aria-label="Next page"
            disabled={busy || query.page * 20 >= data.total}
            onClick={() => move(query.page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className={recordsStyles.message}
        aria-labelledby="contact-message-title"
        onClose={() => setSelected(null)}
      >
        <div className={recordsStyles.messageHeading}>
          <span>
            <Mail size={18} />
            CONTACT MESSAGE
          </span>
          <button
            aria-label="Close message"
            onClick={() => dialog.current?.close()}
          >
            <X size={21} />
          </button>
        </div>
        {selected && (
          <>
            <h2 id="contact-message-title">
              {selected.subject || "No subject"}
            </h2>
            <p className={recordsStyles.sender}>
              {selected.name} · {selected.email}
            </p>
            <time dateTime={selected.created_at}>
              {date(selected.created_at)}
            </time>
            <div className={recordsStyles.messageBody}>{selected.message}</div>
            <a
              className={recordsStyles.reply}
              href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent("Re: " + (selected.subject ?? "Your message"))}`}
            >
              Reply by email
            </a>
          </>
        )}
      </dialog>
    </section>
  );
}
