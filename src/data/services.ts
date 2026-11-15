import type { Service } from "@/types/portfolio";

export const sectionDescription =
  "AI and machine learning grounded in software engineering: predictive " +
  "models, scalable applications, and reliable cloud infrastructure, supported " +
  "by applied projects and enterprise development experience.";

export const services: readonly Service[] = [
  {
    slug: "web-design",
    title: "AI & Machine Learning",
    technologies: "Python · PyTorch · Scikit-learn",
    icon: "ai",
    description:
      "Predictive modeling, deep learning, NLP, and information retrieval, backed by applied AI projects.",
  },
  {
    slug: "ui-ux-design",
    title: "Full-Stack Engineering",
    technologies: "React · Next.js · TypeScript",
    icon: "fullStack",
    description:
      "Scalable web applications combining responsive interfaces, backend services, and real-time collaboration.",
  },
  {
    slug: "web-research",
    title: "Backend & APIs",
    technologies: "Django · NestJS · PostgreSQL",
    icon: "backend",
    description:
      "Reliable APIs, microservices, database migrations, and caching for enterprise applications.",
  },
  {
    slug: "marketing",
    title: "Cloud & DevOps",
    technologies: "AWS · Docker · Kubernetes",
    icon: "cloud",
    description:
      "Cloud infrastructure, automated deployments, CI/CD pipelines, and application monitoring.",
  },
];

export const serviceHighlights = [
  {
    title: "AI (Machine Learning) Engineer",
    description:
      "Developing predictive maintenance models with MLP, LSTM, and TCN; " +
      "applying machine learning to email threat detection, essay grading, " +
      "and performance classification.",
  },
  {
    title: "Full-Stack & Backend Engineering",
    description:
      "Building applications with React, Next.js, Django, and NestJS. " +
      "Delivering APIs, real-time workflows, and database solutions across " +
      "MTN, NogicJQS, and ZandaTax.",
  },
  {
    title: "Cloud Infrastructure & DevOps",
    description:
      "Working with AWS, Docker, Kubernetes, and Terraform; automating " +
      "CI/CD with Jenkins and GitHub Actions, and monitoring applications " +
      "with Prometheus and Grafana.",
  },
] as const;

export const expertise = [
  {
    title: "AI (Machine Learning)",
    count: "Predictive Models & Deep Learning",
    icon: "ai",
    description:
      "Building engine remaining-life prediction models, NLP applications, " +
      "and classification systems with Python, PyTorch, and Scikit-learn.",
    slug: "web-design",
  },
  {
    title: "Full-Stack Engineering",
    count: "Web Applications & APIs",
    icon: "code",
    description:
      "Delivering React and Next.js interfaces, Django and NestJS services, " +
      "and real-time workflows for enterprise applications.",
    slug: "ui-ux-design",
  },
  {
    title: "Cloud & DevOps",
    count: "Infrastructure & Deployment",
    icon: "cloud",
    description:
      "Automating deployments with AWS, Docker, Kubernetes, Terraform, " +
      "Jenkins, and GitHub Actions, with Prometheus and Grafana monitoring.",
    slug: "marketing",
  },
] as const;
