export type Focus = {
  id: "backend" | "devops" | "cloud" | "open-source";
  name: string;
  description: string;
};

export type Technology = {
  id: string;
  name: string;
  description: string;
  /** Local or hosted original-color brand asset. */
  logo?: string;
};

export type TechnologyGroup = {
  id: string;
  name: string;
  technologies: readonly Technology[];
};

export type PullRequest = {
  repository: string;
  number: number;
  title: string;
  type: string;
  status: "merged" | "open" | "closed";
  problem: string;
  solution: string;
  url: string;
  /** Date the current status was verified on GitHub (YYYY-MM-DD). */
  verifiedOn: string;
};

export type ArchitectureNode = {
  id: string;
  name: string;
  kind: "interface" | "service" | "data" | "pipeline" | "infrastructure";
  description: string;
};

export type Architecture = {
  title: string;
  illustrative: boolean;
  nodes: readonly ArchitectureNode[];
  connections: readonly { from: string; to: string; label: string }[];
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  context: string;
  problem: string;
  implementation: string;
  decisions: readonly string[];
  technologies: readonly string[];
  repositoryUrl?: string;
  demoUrl?: string;
  article?: { label: string; url: string };
  architecture?: Architecture;
};

export type TimelineEntry = {
  id: string;
  kind: "Experience" | "Education" | "Certification";
  organization: string;
  title: string;
  period?: string;
  description?: string;
  evidence?: string;
};

export type Identity = { name: string | null; mark: string; role: string };

type Portfolio = {
  identity: Identity;
  hero: { title: string; accent: string; description: string };
  about: { title: string; accent: string; description: string };
  focus: readonly Focus[];
  technologyGroups: readonly TechnologyGroup[];
  contributions: readonly PullRequest[];
  projects: readonly Project[];
  timeline: readonly TimelineEntry[];
  achievements: readonly { name: string; result: string }[];
  contact: { email: string | null; links: readonly { label: string; url: string }[] };
};

const gitHub = "https://github.com/Chanuth412-pixel";
const upwork = "https://www.upwork.com/freelancers/~019b9c84e4a834fb9e";
const terraformArticle = "https://dev.to/chanuth_412/agentic-pipeline-to-convert-aws-infrastructure-to-terraform-29k4";
const freeIpaArticle = "https://dev.to/chanuth_412/running-freeipa-on-ubuntu-using-podman-part-2-step-by-step-deployment-3ngc";
const devicon = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

export const portfolio: Portfolio = {
  identity: { name: "Chanuth Abeynayake", mark: "CA", role: "Computer Engineering Undergraduate" },
  hero: {
    title: "Building",
    accent: "reliable systems.",
    description:
      "I’m Chanuth Abeynayake. I study Computer Engineering and work on backend software, infrastructure automation, and open source.",
  },
  about: {
    title: "The engineer",
    accent: "behind the work.",
    description:
      "I study Computer Engineering at the University of Peradeniya. My work spans freelance development, university infrastructure, and open-source contributions. I’m especially interested in how services are built, deployed, and maintained.",
  },
  focus: [
    {
      id: "backend",
      name: "Backend development",
      description: "Services, APIs, and the data models that connect them.",
    },
    {
      id: "devops",
      name: "DevOps",
      description: "Repeatable builds, automated deployments, and feedback from running software.",
    },
    {
      id: "cloud",
      name: "Cloud infrastructure",
      description: "How services are provisioned, run, and observed in the cloud.",
    },
    {
      id: "open-source",
      name: "Open source",
      description: "Working in the open through issues, small patches, and code review.",
    },
  ],
  technologyGroups: [
    {
      id: "backend",
      name: "Backend & data",
      technologies: [
        { id: "python", name: "Python", logo: `${devicon}/python/python-original.svg`, description: "Used for AWS infrastructure discovery and clinical time-series pipelines." },
        { id: "node", name: "Node.js", logo: `${devicon}/nodejs/nodejs-original.svg`, description: "Runs the Express APIs that handle GloveXcel rehabilitation data and the backend for Agrimate." },
        { id: "postgresql", name: "PostgreSQL", logo: `${devicon}/postgresql/postgresql-original.svg`, description: "Stores relational data in the GloveXcel application." },
        { id: "mongodb", name: "MongoDB", logo: `${devicon}/mongodb/mongodb-original.svg`, description: "Stores GloveXcel’s high-volume sensor data." },
      ],
    },
    {
      id: "cloud",
      name: "Cloud & automation",
      technologies: [
        { id: "aws", name: "AWS", logo: `${devicon}/amazonwebservices/amazonwebservices-original-wordmark.svg`, description: "Infrastructure discovery and deployment for the Terraform generation system." },
        { id: "terraform", name: "Terraform", logo: `${devicon}/terraform/terraform-original.svg`, description: "Defines generated AWS infrastructure and provisions virtual machines for the university’s internal platform." },
        { id: "ansible", name: "Ansible", logo: `${devicon}/ansible/ansible-original.svg`, description: "Automates Kubernetes cluster setup on provisioned virtual machines." },
        { id: "kubernetes", name: "Kubernetes", logo: `${devicon}/kubernetes/kubernetes-original.svg`, description: "The orchestration layer provisioned by the university’s internal developer platform." },
        { id: "podman", name: "Podman", logo: `${devicon}/podman/podman-original.svg`, description: "Runs the university FreeIPA container on AlmaLinux 9." },
      ],
    },
    {
      id: "applications",
      name: "Web & mobile",
      technologies: [
        { id: "react", name: "React", logo: `${devicon}/react/react-original.svg`, description: "Powers the browser interface for GloveXcel’s guided rehabilitation exercises." },
        { id: "astro", name: "Astro", logo: `${devicon}/astro/astro-original.svg`, description: "Used to build and maintain the Racoona website." },
        { id: "flutter", name: "Flutter", logo: `${devicon}/flutter/flutter-original.svg`, description: "Used to build Agrimate’s bilingual marketplace app." },
        { id: "firebase", name: "Firebase", logo: `${devicon}/firebase/firebase-original.svg`, description: "Provides NoSQL storage for Agrimate." },
      ],
    },
    {
      id: "ml",
      name: "Machine learning",
      technologies: [
        { id: "langgraph", name: "LangGraph", description: "Orchestrates the Terraform generation stages and shares state across them." },
        { id: "ollama", name: "Ollama", description: "Runs language models used by the infrastructure generation project." },
        { id: "pandas", name: "pandas", logo: `${devicon}/pandas/pandas-original.svg`, description: "Used in the clinical time-series research pipeline for data preparation and feature engineering." },
        { id: "scikit-learn", name: "scikit-learn", logo: `${devicon}/scikitlearn/scikitlearn-original.svg`, description: "Part of the model development and evaluation toolkit for clinical time-series research." },
      ],
    },
  ],
  contributions: [
    {
      repository: "pypa/build",
      number: 1283,
      title: "Fix troubleshooting hint when build isolation is disabled",
      type: "CLI fix",
      status: "merged",
      problem: "When build isolation was disabled and a backend was missing, the troubleshooting hint recommended an incompatible flag.",
      solution: "Passed the isolation setting into the error handler, limited the hint to valid flags, and updated the regression tests.",
      url: "https://github.com/pypa/build/pull/1283",
      verifiedOn: "2026-11-25",
    },
    {
      repository: "terrakube-io/terrakube",
      number: 3922,
      title: "fix(ui): correctly remove trailing .git from repository URLs",
      type: "UI fix",
      status: "merged",
      problem: "URL formatting could remove .git from a hostname or the middle of a repository name.",
      solution: "Restricted removal to the URL suffix and added regression tests for GitHub Pages, Gitea, and repository names containing .git.",
      url: "https://github.com/terrakube-io/terrakube/pull/3922",
      verifiedOn: "2026-11-25",
    },
    {
      repository: "grafana/loki",
      number: 26723,
      title: "fix(logcli): return format output write errors",
      type: "CLI fix",
      status: "open",
      problem: "LogCLI’s formatting path could fail to surface output write errors.",
      solution: "Proposes returning write errors from the formatter so callers can handle them.",
      url: "https://github.com/grafana/loki/pull/26723",
      verifiedOn: "2026-11-25",
    },
    {
      repository: "kubescape/kubescape",
      number: 5741,
      title: "fix(policy): return an error when no test cases are found",
      type: "Policy test fix",
      status: "open",
      problem: "The policy test command could complete without reporting that it found zero test cases.",
      solution: "Proposes reporting an error when no test cases are found.",
      url: "https://github.com/kubescape/kubescape/pull/5741",
      verifiedOn: "2026-11-25",
    },
  ],
  projects: [
    {
      id: "kubesmith",
      name: "Peracom Web Services",
      context: "University infrastructure",
      summary: "A self-service platform for provisioning Kubernetes clusters on Proxmox VE.",
      problem: "Provisioning virtual machines and configuring Kubernetes clusters required separate manual steps.",
      implementation: "Built an internal developer platform around a FastAPI service and web dashboard. Terraform provisions virtual machines in Proxmox VE, and Ansible configures Kubernetes. Prometheus and Grafana support monitoring and alerting.",
      decisions: ["Assign virtual machine lifecycle and cluster configuration to separate tools, Terraform and Ansible."],
      technologies: ["Proxmox VE", "Terraform", "Ansible", "Kubernetes", "FastAPI", "Prometheus", "Grafana"],
      repositoryUrl: "https://github.com/IsharaEkanayaka/kubesmith",
      architecture: {
        title: "Cluster provisioning path",
        illustrative: true,
        nodes: [
          { id: "dashboard", name: "Web Dashboard", kind: "interface", description: "The self-service interface for managing cluster requests." },
          { id: "api", name: "FastAPI", kind: "service", description: "Coordinates provisioning and exposes management operations to the dashboard." },
          { id: "terraform", name: "Terraform", kind: "pipeline", description: "Manages the lifecycle of virtual machines in Proxmox VE." },
          { id: "ansible", name: "Ansible", kind: "pipeline", description: "Configures Kubernetes on the provisioned virtual machines." },
          { id: "proxmox", name: "Proxmox VE", kind: "infrastructure", description: "Hosts the virtual machines provisioned for each cluster." },
          { id: "kubernetes", name: "Kubernetes", kind: "infrastructure", description: "The cluster configured and managed by the platform." },
        ],
        connections: [
          { from: "dashboard", to: "api", label: "HTTP" },
          { from: "api", to: "terraform", label: "VM provisioning" },
          { from: "terraform", to: "proxmox", label: "VM lifecycle" },
          { from: "api", to: "ansible", label: "Cluster setup" },
          { from: "ansible", to: "kubernetes", label: "Configuration" },
        ],
      },
    },
    {
      id: "tf-agent",
      name: "AI-Powered Infrastructure Generation",
      context: "Freelance client work",
      summary: "A multi-agent workflow that turns discovered AWS infrastructure into Terraform.",
      problem: "Existing AWS deployments take time to document and translate into reusable infrastructure code.",
      implementation: "A Python discovery step collects AWS resource configuration and relationships. A LangGraph workflow uses language models and retrieval-augmented generation to produce Terraform, with a validation step before delivery.",
      decisions: ["Derive resource relationships from AWS identifiers and split the generation stages into network, security, compute, and data.", "Support import mode for existing resources and clone mode for reusable configuration."],
      technologies: ["Python", "LangGraph", "Ollama", "AWS", "Terraform"],
      repositoryUrl: `${gitHub}/tf-agent/tree/main/tf%20agent`,
      article: { label: "Technical write-up", url: terraformArticle },
      architecture: {
        title: "Infrastructure generation workflow",
        illustrative: true,
        nodes: [
          { id: "aws", name: "AWS", kind: "infrastructure", description: "The existing environment scanned for resource configuration and real identifiers." },
          { id: "discovery", name: "Python discovery", kind: "service", description: "Scans resources using boto3 and compiles their relationships into a graph." },
          { id: "graph", name: "LangGraph", kind: "pipeline", description: "Runs the staged generation workflow, carrying resource metadata and progress forward." },
          { id: "validation", name: "Terraform validation", kind: "pipeline", description: "Checks the generated Terraform and makes validation feedback available to the workflow." },
        ],
        connections: [
          { from: "aws", to: "discovery", label: "Resource metadata" },
          { from: "discovery", to: "graph", label: "Resource graph" },
          { from: "graph", to: "validation", label: "Generated Terraform" },
        ],
      },
    },
    {
      id: "glovexcel",
      name: "GloveXcel",
      context: "University project",
      summary: "A wearable glove and browser application for guided hand rehabilitation at home.",
      problem: "Home exercises need a way to capture finger movement and share session progress remotely.",
      implementation: "ESP32 firmware filters finger sensor readings and sends them to the browser over Bluetooth Low Energy. A React interface visualizes movement and records sessions through Node.js and Express APIs.",
      decisions: ["Use BLE to transmit readings with lower power requirements.", "Use MongoDB for high-volume sensor data and PostgreSQL for relational records."],
      technologies: ["ESP32", "Bluetooth LE", "React", "Node.js", "PostgreSQL", "MongoDB", "AWS"],
      repositoryUrl: "https://github.com/cepdnaclk/e21-3yp-GloveXcel",
      architecture: {
        title: "Rehabilitation data flow",
        illustrative: true,
        nodes: [
          { id: "glove", name: "ESP32 glove", kind: "infrastructure", description: "Filters finger movement readings and streams them over Bluetooth Low Energy." },
          { id: "browser", name: "React interface", kind: "interface", description: "Shows guided exercises and visualizes movement in the browser." },
          { id: "api", name: "Express API", kind: "service", description: "Processes session data through asynchronous Node.js APIs." },
          { id: "mongo", name: "MongoDB", kind: "data", description: "Stores high-volume sensor readings." },
          { id: "postgres", name: "PostgreSQL", kind: "data", description: "Stores relational application data." },
        ],
        connections: [
          { from: "glove", to: "browser", label: "BLE readings" },
          { from: "browser", to: "api", label: "Session data" },
          { from: "api", to: "mongo", label: "Sensor data" },
          { from: "api", to: "postgres", label: "Relational data" },
        ],
      },
    },
    {
      id: "freeipa",
      name: "FreeIPA Identity Migration",
      context: "University infrastructure",
      summary: "A migration from legacy OpenLDAP to centralized identity management.",
      problem: "The university’s legacy OpenLDAP setup needed a centralized identity management system.",
      implementation: "Migrated the directory to FreeIPA, running it in Podman on AlmaLinux 9. Used Keycloak and Google Workspace for single sign-on.",
      decisions: ["Use Podman after encountering Docker compatibility issues with cgroups v2."],
      technologies: ["FreeIPA", "OpenLDAP", "Podman", "AlmaLinux", "Keycloak"],
      article: { label: "Deployment guide", url: freeIpaArticle },
    },
    {
      id: "agrimate",
      name: "Agrimate",
      context: "Mobile marketplace",
      summary: "A bilingual marketplace connecting farmers directly with customers.",
      problem: "Farmers needed a direct sales channel with support for crop care guidance and delivery routing.",
      implementation: "Built a Flutter app with a Node.js backend and Firebase storage. Combined weather forecasts and crop growth stages to generate localized care precautions.",
      decisions: ["Use a greedy nearest-neighbor heuristic to generate delivery routes."],
      technologies: ["Flutter", "Node.js", "Firebase", "OpenWeather"],
      repositoryUrl: `${gitHub}/agrimate`,
      article: { label: "Project write-up", url: "https://realworldsolutions-chan.blogspot.com/2025/10/making-marketplace-for-farmers-and.html" },
    },
    {
      id: "clinical-research",
      name: "Clinical Time-Series Prediction",
      context: "Ongoing undergraduate research",
      summary: "Supervised research on machine learning for multivariate clinical time series.",
      problem: "Clinical time-series prediction requires comparing sampling intervals and evaluating performance across patients.",
      implementation: "Developing pipelines for temporal feature engineering, data imputation, event labelling, and patient-wise validation. Comparing 30-, 60-, and 120-minute sampling intervals under the supervision of Dr. Upul Jayasinghe.",
      decisions: ["Compare AUROC and AUPRC alongside positive predictive value, sensitivity, and false-alarm rates."],
      technologies: ["Python", "pandas", "NumPy", "scikit-learn", "XGBoost", "LightGBM"],
    },
    {
      id: "racoona",
      name: "Racoona Website",
      context: "Freelance client work",
      summary: "An Astro website with contact forms and email delivery.",
      problem: "The client needed maintainable static pages and a working inquiry flow.",
      implementation: "Developed and maintained the Astro pages and integrated contact forms with Web3Forms and email delivery through Spacemail.",
      decisions: [],
      technologies: ["Astro", "JavaScript", "HTML", "CSS", "Web3Forms", "Spacemail"],
      repositoryUrl: `${gitHub}/racoona/tree/main/racoona-web`,
      demoUrl: "https://racoona.ai/",
    },
  ],
  timeline: [
    { id: "freelance", kind: "Experience", organization: "Upwork", title: "Freelance development", description: "Client projects include a Terraform generation workflow for AWS infrastructure and an Astro website with an inquiry flow." },
    { id: "university-infrastructure", kind: "Experience", organization: "University of Peradeniya", title: "University infrastructure projects", description: "Worked on an internal Kubernetes provisioning platform and a migration from OpenLDAP to FreeIPA." },
    { id: "university", kind: "Education", organization: "University of Peradeniya", title: "Computer Engineering", period: "Undergraduate", description: "Current GPA of 3.70, as listed on the résumé." },
    { id: "aws-essentials", kind: "Certification", organization: "Amazon Web Services", title: "AWS Cloud Technical Essentials", period: "November 2026", evidence: "https://www.coursera.org/account/accomplishments/verify/W9WC2AQTCH38" },
    { id: "learning-algorithms", kind: "Certification", organization: "DeepLearning.AI and Stanford University", title: "Advanced Learning Algorithms", period: "December 2024", evidence: "https://www.coursera.org/account/accomplishments/verify/D0Z4F1Z3V3RN" },
  ],
  achievements: [
    { name: "SLASSCOM Xcelerate Inter-University Hackathon 2026", result: "Team leader · Top 12 finalist" },
    { name: "SLIIT CodeFest 2026 · Innov IoT", result: "Team leader · Top 10 finalist" },
    { name: "SLT CodeBlast 2025", result: "Team leader · Top 10 finalist" },
  ],
  contact: {
    email: "chanuth412@gmail.com",
    links: [
      { label: "GitHub", url: gitHub },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/chanuth-abeynayake-459a95235" },
      { label: "Upwork", url: upwork },
    ],
  },
};
