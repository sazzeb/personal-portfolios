import type { SkillGroup } from "@/types/portfolio";

export const skillGroups: readonly SkillGroup[] = [
  {
    title: "AI (Machine Learning) Engineer",
    skills: [
      {
        label: "Machine Learning",
        detail: "Python · Scikit-learn · Predictive Analytics",
      },
      { label: "Deep Learning", detail: "PyTorch · MLP · LSTM · TCN" },
      {
        label: "NLP & Information Retrieval",
        detail: "NLTK · Tokenization · Inverted Indexing",
      },
      {
        label: "Data Analysis & Model Evaluation",
        detail: "Pandas · NumPy · SciPy · Matplotlib",
      },
    ],
  },
  {
    title: "Software & Cloud Engineering",
    skills: [
      {
        label: "Full-Stack Development",
        detail: "React · Next.js · TypeScript",
      },
      {
        label: "Backend & APIs",
        detail: "Django · NestJS · Laravel · REST APIs",
      },
      { label: "Databases & Caching", detail: "PostgreSQL · MongoDB · Redis" },
      { label: "Cloud & DevOps", detail: "AWS · Docker · Kubernetes · CI/CD" },
    ],
  },
];

export const careerExperience = {
  years: 10,
  suffix: "+",
  description:
    "Building full-stack applications, backend systems, and cloud infrastructure " +
    "since 2016, with experience at MTN (Mobile Telephone Network Group Limited), " +
    "NogicJQS (Nigeria Oil and Gas Industry Content Joint Qualification System), " +
    "and ZandaTax. Applying that engineering foundation " +
    "to AI and machine learning.",
} as const;

// Project count and employer-specific outcomes reported in the supplied résumé.
export const statistics = [
  { value: 6, suffix: "", label: "Applied AI & Computing Projects" },
  { value: 75, suffix: "%", label: "Migration Performance Gain at ZandaTax" },
  { value: 50, suffix: "%", label: "Server Load Reduction at MTN" },
  {
    value: 40,
    suffix: "%",
    label: "Approval Process Efficiency Gain at NogicJQS",
  },
] as const;

export const education = [
  {
    title: "MS in Artificial Intelligence",
    years: "January 2025 – December 2026 (Expected)",
    description:
      "University of North Texas, Denton. In progress, with applied projects " +
      "in deep learning, predictive analytics, and information retrieval.",
  },
  {
    title: "AAS in Computer Information Systems",
    years: "February 2022 – May 2024",
    description:
      "Houston Community College. Associate of Applied Science in Computer " +
      "Information Systems.",
  },
  {
    title: "B.Eng. in Electrical/Electronic Engineering",
    years: "January 2011 – December 2016",
    description:
      "University of Port Harcourt. Bachelor of Engineering in " +
      "Electrical/Electronic Engineering.",
  },
] as const;

export const experience = [
  {
    company: "Independent AI & Machine Learning Projects",
    role: "AI (Machine Learning) Engineer — Personal Projects",
    years: "January 2025 – Present",
    description:
      "Building NASA C-MAPSS remaining-life prediction models with MLP, LSTM, " +
      "and TCN, alongside projects in performance classification, watermarking, " +
      "information retrieval, email threat detection, and automated essay grading.",
  },
  {
    company: "ZandaTax (EnrolledAgent.com)",
    role: "Full Stack Engineer",
    years: "January 2022 – September 2024",
    description:
      "Developed tax and bookkeeping platforms with Django, NestJS, and React. " +
      "Led data migration from AWS RDS to MongoDB Atlas and improved API " +
      "performance, Redis caching, monitoring, and CI/CD workflows.",
  },
  {
    company: "MTN (Mobile Telephone Network Group Limited)",
    role: "Full Stack Developer / Live Support Engineer",
    years: "November 2018 – December 2021",
    description:
      "Built telecom transaction platforms, employee scheduling tools, and " +
      "reporting dashboards. Migrated applications to React and Django, " +
      "reduced server load, and improved failed-transaction management.",
  },
  {
    company:
      "NogicJQS (Nigeria Oil and Gas Industry Content Joint Qualification System)",
    role: "Full Stack Developer",
    years: "February 2016 – October 2018",
    description:
      "Developed government approval workflows, oil-and-gas logistics tools, " +
      "banking registration and transaction microservices, and an e-commerce " +
      "front end using React, TypeScript, and Next.js.",
  },
] as const;
