import { Suspense } from "react";
import type { Metadata } from "next";
import { requireDashboard } from "@/lib/server-session";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
async function AuthorizedDashboard() {
  const data = await requireDashboard();
  if (!data)
    return (
      <main id="main-content" style={{ padding: 48 }}>
        <h1>Workspace temporarily unavailable</h1>
        <p>Your session could not be verified. Reload the page to try again.</p>
      </main>
    );
  return <AdminDashboard initial={data} />;
}
export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main
          id="main-content"
          style={{ minHeight: "100vh", padding: 48 }}
          role="status"
        >
          Verifying your workspace…
        </main>
      }
    >
      <AuthorizedDashboard />
    </Suspense>
  );
}
