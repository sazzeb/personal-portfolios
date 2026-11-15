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
    label: "Blog",
    href: "/blog",
    children: [
      { label: "Blog Classic", href: "/blog" },
      { label: "Blog Column 3", href: "/blog?layout=grid" },
      { label: "Blog Details", href: "/blog/inspiring-the-world" },
    ],
  },
  {
    label: "Project",
    href: "/projects",
    children: [
      { label: "Project", href: "/projects" },
      { label: "Project Style 2", href: "/projects?layout=cards" },
      { label: "Project Style 3", href: "/projects?layout=grid" },
      { label: "Project Details", href: "/projects/digital-transformation" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
