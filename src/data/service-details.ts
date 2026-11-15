interface ServiceEngagement {
  organization: string;
  role: string;
  period: string;
  work: string;
  achievements: readonly string[];
}

interface ServiceDetail {
  overview: string;
  technologies: string;
  context: string;
  engagements: readonly ServiceEngagement[];
  approach: string;
}

// Employer attribution, dates, and outcomes follow the updated CV.
export const serviceDetails: Readonly<Record<string, ServiceDetail>> = {
  "web-design": {
    overview:
      "My AI and machine learning work combines data preparation, model development, " +
      "and evaluation with a software engineering foundation. These examples are " +
      "independent personal projects, rather than AI work attributed to an employer.",
    technologies: "Python, PyTorch, Scikit-learn, Pandas, NumPy, MATLAB, C++17",
    context: "Independent AI & computing projects · January 2025–Present",
    engagements: [
      {
        organization: "Personal Project — NASA C-MAPSS Predictive Maintenance",
        role: "AI (Machine Learning) Engineer",
        period: "January 2025–Present · Personal project portfolio",
        work:
          "Developed aircraft-engine remaining useful life prediction workflows using " +
          "NASA C-MAPSS sensor data. Built reusable preprocessing for normalization, " +
          "feature selection, noise reduction, and sliding-window sequences, then " +
          "implemented MLP, LSTM, and temporal convolutional network models.",
        achievements: [
          "Created configurable training and evaluation workflows for FD001–FD004, with model checkpoints and performance visualizations.",
          "Designed an asymmetric loss function that penalizes remaining-life overestimation to reflect predictive-maintenance risk.",
        ],
      },
      {
        organization:
          "Personal Projects — Classification & Natural Language Processing",
        role: "Machine Learning & NLP Development",
        period: "2025–Present · Personal project portfolio",
        work:
          "Applied label distribution learning to tennis performance classification; " +
          "extended an email classification application to distinguish spam, ham, phishing, " +
          "and harmful content; and developed an automated essay-grading system using " +
          "writing features, Lasso Regression, and Decision Tree models.",
        achievements: [
          "Compared five statistical learning methods for tennis performance using classification error, KL divergence, and cosine similarity.",
          "Combined probability outputs from two email classifiers to produce ensemble labels and confidence scores.",
          "Evaluated essay-score prediction with MAE, MSE, and R² across K–12, college, and graduate-level writing categories.",
        ],
      },
      {
        organization:
          "Personal Projects — Information Retrieval & Image Watermarking",
        role: "C++17, Python & MATLAB Development",
        period: "January 2025–Present · Personal project portfolio",
        work:
          "Built a C++17 information retrieval engine with parsing, tokenization, " +
          "stopword removal, Porter stemming, and forward and inverted indexes. " +
          "Developed a separate image-watermarking application using Haar discrete " +
          "wavelet transforms in MATLAB and Python.",
        achievements: [
          "Implemented document-term indexing and term-frequency tracking for efficient term lookup.",
          "Supported watermark embedding, extraction, and verification, with PSNR, SSIM, BER, and NCC evaluation.",
        ],
      },
    ],
    approach:
      "Start with the prediction or retrieval problem, prepare reproducible data " +
      "pipelines, compare suitable baselines, and evaluate with task-specific metrics. " +
      "Keep training configurations, checkpoints, and visualizations reusable so " +
      "experiments can be inspected and repeated.",
  },
  "ui-ux-design": {
    overview:
      "I build full-stack applications that connect responsive interfaces with APIs, " +
      "databases, and real-time workflows. My professional experience spans tax services, " +
      "telecommunications, government approval systems, and e-commerce interfaces.",
    technologies:
      "React, Next.js, TypeScript, JavaScript, Django, NestJS, Laravel, WebSockets",
    context: "ZandaTax · MTN · NogicJQS",
    engagements: [
      {
        organization: "ZandaTax (EnrolledAgent.com)",
        role: "Full Stack Engineer",
        period: "January 2022–September 2024",
        work:
          "Led development of a Django application connecting enrolled agents and tax " +
          "filers. Built bookkeeping applications for 17 business clients and implemented " +
          "real-time collaboration using JavaScript, TypeScript, NestJS, and sockets. " +
          "Refactored React interfaces and upgraded front-end dependencies.",
        achievements: [
          "Developed a platform connecting 65,000 enrolled agents with tax filers, as reported in the CV.",
          "Reported a 20% reduction in front-end load times through refactoring and dependency upgrades.",
          "Bookkeeping applications and automated workflows contributed to a reported 35% profit increase.",
        ],
      },
      {
        organization: "MTN (Mobile Telephone Network Group Limited)",
        role: "Full Stack Developer / Live Support Engineer",
        period: "November 2018–December 2021",
        work:
          "Developed telecom data-purchase applications serving thousands of users " +
          "across multiple countries. Replaced a CodeIgniter server-rendered interface " +
          "with a React single-page application backed by Node.js and TypeScript. " +
          "Built employee scheduling tools using NestJS and Next.js.",
        achievements: [
          "Reported a 50% reduction in server load after the React SPA transition.",
          "The internal scheduling application increased employee productivity by over 40%, according to the CV.",
          "Delivered a Laravel and React interface for phone XML APIs, associated with a reported 34% annual profit increase.",
        ],
      },
      {
        organization:
          "NogicJQS (Nigeria Oil and Gas Industry Content Joint Qualification System)",
        role: "Full Stack Developer",
        period: "February 2016–October 2018",
        work:
          "Developed a multi-level government approval system and logistics tools for " +
          "domestic and international oil-related activities. Scaffolded the Bitmarte " +
          "e-commerce front end with React, TypeScript, Next.js, Redux, WebSockets, " +
          "PWA capabilities, and Tailwind CSS.",
        achievements: [
          "Reported a 40% process-efficiency improvement from the hierarchical approval system.",
          "The logistics application improved tracking and reporting efficiency by a reported 45%.",
          "Reusable e-commerce scaffolding increased development speed by a reported 30%.",
        ],
      },
    ],
    approach:
      "Define the user workflow and API contract together, build reusable interface " +
      "components, and handle loading, validation, and real-time updates explicitly. " +
      "Measure application behavior across the interface, backend, and database " +
      "instead of optimizing a single layer in isolation.",
  },
  "web-research": {
    overview:
      "My backend work focuses on reliable APIs, microservices, transaction workflows, " +
      "data migration, and caching. The examples below explain where these systems " +
      "were used and the business or operational improvements reported in my CV.",
    technologies:
      "Python, Django, NestJS, Laravel, PostgreSQL, MongoDB, Redis, REST APIs",
    context: "ZandaTax · MTN · NogicJQS",
    engagements: [
      {
        organization: "ZandaTax (EnrolledAgent.com)",
        role: "Full Stack Engineer",
        period: "January 2022–September 2024",
        work:
          "Built tax-management and bookkeeping services using Django, PostgreSQL, " +
          "and Redis. Led migration of millions of records from AWS RDS to MongoDB " +
          "Atlas, refactored database interactions, tuned Redis configurations and " +
          "scripts, and optimized APIs handling high-frequency tax transactions.",
        achievements: [
          "Reported a 75% improvement in speed and performance following the AWS RDS-to-MongoDB Atlas migration.",
          "Redis tuning increased data-retrieval speed by a reported 25%.",
          "API endpoint optimization improved transaction-processing speed by a reported 20% during peak tax workloads.",
        ],
      },
      {
        organization: "MTN (Mobile Telephone Network Group Limited)",
        role: "Full Stack Developer / Live Support Engineer",
        period: "November 2018–December 2021",
        work:
          "Developed backend services for telecom purchases and a server-management " +
          "application for detecting and resolving failed transactions before escalation. " +
          "Migrated a PHP backend to Django through incremental transitions, allowing " +
          "the old and new services to operate concurrently during migration.",
        achievements: [
          "Completed the PHP-to-Django migration with zero downtime, as stated in the CV.",
          "The failed-transaction management application improved operational efficiency by over 85%, according to the CV.",
          "Built reporting workflows with Pandas and NumPy to support marketing analysis and management dashboards.",
        ],
      },
      {
        organization:
          "NogicJQS (Nigeria Oil and Gas Industry Content Joint Qualification System)",
        role: "Full Stack Developer",
        period: "February 2016–October 2018",
        work:
          "Implemented hierarchical approval and rejection workflows across departments. " +
          "Developed an FCMB registration microservice and an OTP-based transaction " +
          "microservice, and integrated services with existing banking platforms.",
        achievements: [
          "Government approval workflows improved process efficiency by a reported 40% and compliance by 30%.",
          "The FCMB registration service improved user accessibility by a reported 50%.",
          "Cross-platform microservice integration reduced process redundancies by a reported 35%.",
        ],
      },
    ],
    approach:
      "Model the data and transaction lifecycle first, then define API boundaries, " +
      "validation, failure handling, and monitoring. For migrations, use staged " +
      "transitions and inspect data behavior before cutover. Optimize database " +
      "queries and caching against the actual application workload.",
  },
  marketing: {
    overview:
      "I work on cloud infrastructure, deployment automation, and observability " +
      "alongside application development. My CV lists AWS, Docker, Kubernetes, " +
      "Terraform, Jenkins, and GitHub Actions; the employer-specific examples " +
      "below identify where the documented work and outcomes occurred.",
    technologies:
      "AWS, Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, Prometheus, Grafana",
    context: "ZandaTax · MTN",
    engagements: [
      {
        organization: "ZandaTax (EnrolledAgent.com)",
        role: "Full Stack Engineer",
        period: "January 2022–September 2024",
        work:
          "Streamlined CI/CD pipelines using Jenkins and GitHub Actions, with Docker " +
          "and Kubernetes for environment management. Introduced Jest and Cypress " +
          "testing into the delivery workflow and added Prometheus and Grafana " +
          "logging and monitoring to improve operational visibility.",
        achievements: [
          "Deployment pipeline improvements reduced deployment time by a reported 30%.",
          "Automated testing reduced deployment errors by a reported 35%.",
          "Monitoring and logging reduced debugging time by a reported 30%.",
        ],
      },
      {
        organization: "MTN (Mobile Telephone Network Group Limited)",
        role: "Full Stack Developer / Live Support Engineer",
        period: "November 2018–December 2021",
        work:
          "Worked on application operations and live support, including failed-transaction " +
          "monitoring, server-management tools, and a staged PHP-to-Django migration. " +
          "The migration kept both backend environments available during the transition " +
          "to maintain continuity for active users.",
        achievements: [
          "Reported zero downtime during the backend migration.",
          "Proactive transaction-management tooling improved efficiency by over 85%, according to the CV.",
          "A React SPA transition reduced server load by a reported 50%.",
        ],
      },
    ],
    approach:
      "Keep application delivery repeatable with version-controlled workflows, " +
      "automated tests, and consistent environments. Use monitoring to shorten " +
      "diagnosis, and plan migrations around service continuity. Measure delivery " +
      "improvements through deployment time, failure rates, and operational visibility.",
  },
};
