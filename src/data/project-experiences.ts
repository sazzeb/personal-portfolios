import type { Project } from "@/types/portfolio";

export interface ExperienceProject extends Project {
  platform: string;
  platformLabel: string;
  role: string;
  period: string;
  companyAbout: string;
  summary: string;
  technologies: string;
  contributions: readonly string[];
  achievements: readonly string[];
  screenshots: readonly {
    path: string;
    width: number;
    height: number;
  }[];
}

export const experienceProjects: readonly ExperienceProject[] = [
  {
    slug: "zandatax",
    title: "ZandaTax (EnrolledAgent.com)",
    category: "Tax Technology & Full-Stack Engineering",
    image: "/images/project/enrolledagent/enrolled_1.png",
    imageAlt: "EnrolledAgent.com public tax-professional platform",
    imageWidth: 2550,
    imageHeight: 1289,
    platform: "https://enrolledagent.com/",
    platformLabel: "Visit EnrolledAgent.com",
    role: "Full Stack Engineer",
    period: "January 2022 – September 2024",
    companyAbout:
      "EnrolledAgent.com connects taxpayers with enrolled agents for tax services, " +
      "including preparation, planning, and representation. My CV identifies this " +
      "work under ZandaTax (EnrolledAgent.com).",
    summary:
      "Developed tax-management and bookkeeping applications spanning Django " +
      "backends, React interfaces, real-time collaboration, database migration, " +
      "caching, and automated delivery workflows.",
    technologies:
      "Python, Django, JavaScript, TypeScript, React, NestJS, PostgreSQL, Redis, " +
      "AWS RDS, MongoDB Atlas, Docker, Kubernetes, Jenkins, GitHub Actions, " +
      "Jest, Cypress, Prometheus, Grafana",
    contributions: [
      "Led development of an application connecting enrolled agents and tax filers, with real-time collaboration through NestJS and sockets.",
      "Created bookkeeping applications for 17 business clients using PostgreSQL, Redis, and automated workflows.",
      "Migrated millions of records from AWS RDS to MongoDB Atlas and refactored database interactions and high-frequency API endpoints.",
      "Upgraded React dependencies, tuned Redis configurations and scripts, and added logging and monitoring.",
      "Streamlined CI/CD with Jenkins and GitHub Actions, containerized environments, and automated Jest and Cypress testing.",
    ],
    achievements: [
      "75% improvement in speed and performance after the database migration.",
      "25% faster data retrieval following Redis optimization, and 20% faster API transaction processing.",
      "20% reduction in front-end load times through React refactoring and dependency upgrades.",
      "30% shorter deployment time and 35% fewer deployment errors through delivery automation and testing.",
      "30% reduction in debugging time with logging and monitoring; bookkeeping workflows contributed to a reported 35% profit increase.",
    ],
    screenshots: [
      {
        path: "/images/project/enrolledagent/enrolled_2.png",
        width: 2543,
        height: 1284,
      },
      {
        path: "/images/project/enrolledagent/enrolled_3.png",
        width: 2549,
        height: 1363,
      },
      {
        path: "/images/project/enrolledagent/enrolled_4.png",
        width: 2552,
        height: 1365,
      },
    ],
  },
  {
    slug: "mtn",
    title: "MTN (Mobile Telephone Network Group Limited)",
    category: "Telecommunications & Enterprise Applications",
    image: "/images/project/mtn/mtn_1.png",
    imageAlt: "MTN public corporate website",
    imageWidth: 2561,
    imageHeight: 1361,
    platform: "https://www.mtn.ng/",
    platformLabel: "Visit MTN Nigeria",
    role: "Full Stack Developer / Live Support Engineer",
    period: "November 2018 – December 2021",
    companyAbout:
      "MTN is a telecommunications group. Its Nigerian platform offers mobile " +
      "voice, data, broadband, and digital services for individual and business users.",
    summary:
      "Built telecom transaction applications, operational support tools, employee " +
      "scheduling systems, and reporting dashboards. My work included frontend " +
      "modernization and an incremental backend migration that preserved service availability.",
    technologies:
      "JavaScript, TypeScript, Python, React, Next.js, Node.js, NestJS, Django, " +
      "Laravel, Pandas, NumPy, XML APIs",
    contributions: [
      "Developed the DataReset application for telecom purchases, serving thousands of users across multiple countries.",
      "Transitioned a CodeIgniter server-rendered application to a React SPA with Node.js and TypeScript integration.",
      "Built a server-management application to identify and resolve failed transactions before escalation.",
      "Migrated the PHP backend to Django incrementally, with old and new services operating concurrently during the transition.",
      "Created employee scheduling tools with NestJS and Next.js, plus Pandas and NumPy reporting workflows for marketing and management.",
    ],
    achievements: [
      "50% reduction in server load after the React SPA transition.",
      "Over 85% improvement in efficiency from proactive failed-transaction management.",
      "Zero downtime during the PHP-to-Django backend migration.",
      "Over 40% increase in employee productivity through the scheduling application.",
      "A Laravel and React interface for phone XML APIs supported a reported 34% annual profit increase; marketing reporting supported over 30% quarterly profit growth.",
    ],
    screenshots: [
      { path: "/images/project/mtn/mtn_2.png", width: 2555, height: 1368 },
      { path: "/images/project/mtn/mtn_3.png", width: 2556, height: 1354 },
      { path: "/images/project/mtn/mtn_4.png", width: 2551, height: 1377 },
      { path: "/images/project/mtn/mtn_5.png", width: 2501, height: 1286 },
    ],
  },
  {
    slug: "nogicjqs",
    title:
      "NogicJQS (Nigeria Oil and Gas Industry Content Joint Qualification System)",
    category: "Government Workflows & Industry Platforms",
    image: "/images/project/nogicjqs/nogicjqs_1.png",
    imageAlt: "NOGIC JQS public industry qualification platform",
    imageWidth: 2541,
    imageHeight: 1371,
    platform: "https://nogicjqs.gov.ng/",
    platformLabel: "Visit NogicJQS",
    role: "Full Stack Developer",
    period: "February 2016 – October 2018",
    companyAbout:
      "NOGIC JQS is the Nigerian oil and gas industry's content registration and " +
      "joint qualification platform. It supports contractor pre-qualification, " +
      "capability verification, and industry skills information under the NCDMB.",
    summary:
      "Developed multi-level approval workflows, logistics applications, and " +
      "microservices. My CV also records banking integration and e-commerce " +
      "frontend work undertaken during this role.",
    technologies:
      "React, TypeScript, Next.js, Redux, WebSockets, Tailwind CSS, PWA, " +
      "Microservices, OTP Transaction Workflows",
    contributions: [
      "Built a hierarchical government approval system with approval and rejection processes across departments.",
      "Created logistics tooling to monitor domestic and international oil-related activities.",
      "Developed an FCMB registration microservice and integrated microservices with existing banking platforms.",
      "Implemented an OTP-based transaction microservice to simplify user operations.",
      "Scaffolded the Bitmarte e-commerce front end with React, TypeScript, Next.js, Redux, WebSockets, PWA capabilities, and Tailwind CSS.",
    ],
    achievements: [
      "40% improvement in approval-process efficiency and 30% improvement in compliance.",
      "45% improvement in logistics tracking and reporting efficiency.",
      "50% improvement in user accessibility through the FCMB registration microservice.",
      "35% reduction in process redundancies through banking-platform integration, with user testing contributing to 25% higher satisfaction.",
      "30% faster e-commerce development through reusable scaffolding, and 40% improvement in user experience for OTP transaction workflows.",
    ],
    screenshots: [
      {
        path: "/images/project/nogicjqs/nogicjqs_2.png",
        width: 2565,
        height: 1383,
      },
      {
        path: "/images/project/nogicjqs/nogicjqs_3.png",
        width: 2552,
        height: 1367,
      },
      {
        path: "/images/project/nogicjqs/nogicjqs_4.png",
        width: 2550,
        height: 1336,
      },
      {
        path: "/images/project/nogicjqs/nogicjqs_5.png",
        width: 1897,
        height: 1353,
      },
    ],
  },
];
