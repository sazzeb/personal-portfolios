import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/page-banner";
import { BlogSection } from "@/components/sections/blog-section";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <main id="main-content">
      <PageBanner title="Blog" />
      <BlogSection showHeading={false} />
    </main>
  );
}
