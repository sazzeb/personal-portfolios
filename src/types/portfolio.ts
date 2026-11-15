export interface NavigationLink {
  label: string;
  href: string;
  children?: readonly NavigationLink[];
}

export type ServiceIcon = "ai" | "fullStack" | "backend" | "cloud";

export interface Service {
  slug: string;
  title: string;
  technologies: string;
  icon: ServiceIcon;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
}

export interface Article {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  author: string;
  date: string;
}

export interface Skill {
  label: string;
  detail: string;
}

export interface SkillGroup {
  title: string;
  skills: readonly Skill[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
}
