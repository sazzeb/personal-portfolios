import type { Article, Project, Testimonial } from "@/types/portfolio";
import { sammy } from "@/config/sammy";
import { experienceProjects } from "@/data/project-experiences";

export const projects: readonly Project[] = [
  {
    slug: "ai-machine-learning",
    title: "AI (Machine Learning) Engineer Project",
    category: "Personal Projects · Details Coming Soon",
    image: "",
    imageAlt: "",
    deferred: true,
  },
  ...experienceProjects,
];

export const articles: readonly Article[] = [
  {
    slug: "inspiring-the-world",
    title: "Inspiring the World, One Project at a Time for the man",
    image: "blog/blog-img-1.jpg",
    imageAlt: "Creative professionals collaborating on a design project",
    author: "Mesbah",
    date: "April 10",
  },
  {
    slug: "bring-your-ideas-to-life",
    title: "Let’s bring your ideas to life! Contact me, and let’s",
    image: "blog/blog-img-2.jpg",
    imageAlt: "Design team discussing ideas in a creative studio",
    author: "Mesbah",
    date: "April 10",
  },
  {
    slug: "approach-and-dedication",
    title: "Each one showcases my approach and dedication man",
    image: "blog/blog-img-3.jpg",
    imageAlt: "A designer working on a digital creative project",
    author: "Mesbah",
    date: "April 10",
  },
];

// Professional highlights based on the supplied CV, rather than client endorsements.
export const testimonials: readonly Testimonial[] = [
  {
    id: "applied-ai",
    quote:
      "Developing predictive maintenance models with deep learning, " +
      "from sensor preprocessing to remaining useful life prediction.",
    name: sammy.name,
    role: "AI (Machine Learning) Engineer · Personal Projects",
    image: "transparent/04_office_headphones_background_transparent.png",
  },
  {
    id: "enterprise-engineering",
    quote:
      "Building scalable applications, APIs, and cloud workflows across " +
      "telecom, financial services, and government systems.",
    name: sammy.name,
    role: "Full-Stack & Cloud Engineering",
    image: "transparent/01_formal_suit_background_transparent.png",
  },
  {
    id: "research-to-software",
    quote:
      "Combining software engineering with applied AI projects in " +
      "information retrieval, email threat detection, and essay grading.",
    name: sammy.name,
    role: "Applied AI & Software Engineering",
    image: "transparent/02_Studio_Holding_MacBook_Pro_2025_transparent.png",
  },
];
