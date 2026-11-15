import type { NavigationLink } from "@/types/portfolio";

export const navigation: readonly NavigationLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Service", href: "/services" },
      { label: "Service Details", href: "/services/web-design" },
    ],
  },
  {
    label: "Project",
    href: "/projects",
    children: [
      { label: "Project", href: "/projects" },
      { label: "AI (Machine Learning)", href: "/projects/ai-machine-learning" },
      { label: "ZandaTax", href: "/projects/zandatax" },
      { label: "MTN", href: "/projects/mtn" },
      { label: "NogicJQS", href: "/projects/nogicjqs" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
