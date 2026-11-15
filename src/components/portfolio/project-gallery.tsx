"use client";

import { useSearchParams } from "next/navigation";
import { ProjectCollection } from "./project-collection";

export function ProjectGallery() {
  const searchParams = useSearchParams();
  const layout = searchParams.get("layout") ?? "default";

  return <ProjectCollection layout={layout} />;
}
