export const PROJECTS = [
  {
    id: "mypursu",
    title: "MyPursu",
    subtitle: "UPI Payments · Flutter App & Web",
    description:
      "A UPI payments product for merchants, their agents and customers, where merchants can run promotions and rewards through an in-app wallet. Built at Keyutech across both surfaces: the Flutter mobile app and the MERN-stack web app at mypursu.com, from React UI and REST integrations to iOS releases.",
    proofPoints: [
      "UPI payments for merchants, agents and customers",
      "Merchant wallet for promotions and rewards",
      "Flutter mobile app + MERN web app",
    ],
    tech: "Flutter, Dart, React.js, Node.js, Express.js, MongoDB, REST APIs",
    tags: ["Fintech", "Flutter", "MERN"],
    links: [{ label: "Visit mypursu.com", href: "https://mypursu.com", demo: true }],
    images: ["/assets/work/mypursu.svg"],
    imageAlts: ["MyPursu: UPI payments mobile app and web app"],
    metric: "UPI payments · merchant wallet & rewards · app + web",
  },
  {
    id: "mypursu-business",
    title: "MyPursu Business",
    subtitle: "business.mypursu.com · US–India Services",
    description:
      "A managed service platform for companies working between the US and India, combining UPI and bill payments, travel booking, Pack & Ship parcel shipping, a virtual Indian mailbox and concierge support in one account, with centralized request tracking and clear status updates.",
    proofPoints: [
      "Payments, travel, shipping and mailbox in one account",
      "Centralized request tracking with status updates",
      "Built for startups, SMEs and corporate teams",
    ],
    tech: "React.js, Node.js, Express.js, MongoDB, REST APIs",
    tags: ["B2B", "Fintech", "React.js"],
    links: [{ label: "Visit business.mypursu.com", href: "https://business.mypursu.com", demo: true }],
    images: ["/assets/work/mypursu-business.svg"],
    imageAlts: ["MyPursu Business: US–India business services dashboard"],
    metric: "Payments · travel · Pack & Ship · virtual mailbox",
  },
  {
    id: "coinyodha",
    title: "CoinYodha",
    subtitle: "Flutter App & Web",
    description:
      "CoinYodha, shipped at Keyutech as both a Flutter mobile app and a web app: responsive React UI on the web, a cross-platform mobile client, and REST APIs on a Node.js/Express backend, released through App Store Connect and TestFlight on iOS.",
    proofPoints: [
      "Cross-platform Flutter mobile app",
      "Companion web app on the MERN stack",
      "iOS releases via App Store Connect & TestFlight",
    ],
    tech: "Flutter, Dart, React.js, Node.js, Express.js, MongoDB",
    tags: ["Flutter", "MERN", "Mobile"],
    links: [{ label: "Visit coinyodha.com", href: "https://coinyodha.com", demo: true }],
    images: ["/assets/work/coinyodha.svg"],
    imageAlts: ["CoinYodha: mobile app and web app"],
    metric: "Mobile app + web app · Keyutech",
  },
  {
    id: "parchoon",
    title: "Parchoon App",
    subtitle: "Flutter Mobile App",
    description:
      "Parchoon, a cross-platform mobile app built with Flutter , wired to a Node.js/Express REST backend and shipped to iOS through App Store Connect and TestFlight.",
    tech: "Flutter, Dart, Node.js, Express.js, REST APIs, TestFlight",
    tags: ["Flutter", "Mobile", "REST APIs"],
    links: [],
    images: ["/assets/work/parchoon.svg"],
    imageAlts: ["Parchoon mobile app"],
    metric: "Flutter · iOS & Android",
  },
  {
    id: "keyutech-web",
    title: "Keyutech Web",
    subtitle: "keyutech.com · Company Website",
    description:
      "The company website for Keyutech, an IT consulting, software development and QA firm with offices in Fremont, Hyderabad and Indore. It presents the company's services and products such as Automation360 and MyPursu, built as a responsive, fast-loading React site.",
    tech: "React.js, JavaScript, Responsive Design, Nginx, SSL/HTTPS",
    tags: ["Website", "React.js", "Responsive"],
    links: [{ label: "Visit keyutech.com", href: "https://keyutech.com", demo: true }],
    images: ["/assets/work/keyutech-web.svg"],
    imageAlts: ["Keyutech company website"],
    metric: "Company site · services & products showcase",
  },
  {
    id: "avanti-tech",
    title: "Avanti Tech",
    subtitle: "Web Application",
    description:
      "A web project for Avanti Tech, built with responsive React.js components, REST API integration and a production deployment behind Nginx with SSL/HTTPS.",
    tech: "React.js, Node.js, Express.js, REST APIs, Nginx",
    tags: ["Web", "React.js", "Client Project"],
    links: [],
    images: ["/assets/work/avanti-tech.svg"],
    imageAlts: ["Avanti Tech web application"],
    metric: "Client web project",
  },
  {
    id: "realtime-chat",
    title: "Real-Time Chat",
    subtitle: "Flutter Mobile App · Socket.IO",
    description:
      "Built the real-time chat functionality for the product's companion Flutter app using Socket.IO: live messaging, typing indicators, and online/offline presence. I also own the iOS release path, managing builds and distribution through App Store Connect and TestFlight.",
    proofPoints: [
      "Live messaging over Socket.IO / WebSockets",
      "Typing indicators and online/offline presence",
      "Managed iOS builds via App Store Connect & TestFlight",
    ],
    tech: "Flutter, Dart, Socket.IO, Node.js, App Store Connect, TestFlight",
    tags: ["Flutter", "Socket.IO", "Real-Time"],
    links: [],
    images: ["/assets/work/realtime-chat.svg"],
    imageAlts: ["Real-time chat: mobile conversation with typing indicator and online presence"],
    metric: "Live messaging · typing indicators · presence · iOS releases",
  },
  {
    id: "production-infra",
    title: "Production Deployments",
    subtitle: "DigitalOcean · Hostinger VPS · Nginx",
    description:
      "Deployed and managed production releases across DigitalOcean and Hostinger VPS, with Nginx in front and SSL/HTTPS configured end to end. When production misbehaves, I trace it down: targeted debugging and code refactoring that resolved live issues and improved performance.",
    proofPoints: [
      "Ran production releases on DigitalOcean & Hostinger VPS",
      "Configured Nginx reverse proxy with SSL/HTTPS",
      "Resolved live issues through debugging and refactoring",
    ],
    tech: "DigitalOcean, Hostinger VPS, Nginx, SSL/HTTPS, Node.js, Git",
    tags: ["DevOps", "Nginx", "Performance"],
    links: [],
    images: ["/assets/work/production-infra.svg"],
    imageAlts: ["Production deploy terminal: build, Nginx reload and SSL certificate checks"],
    metric: "Nginx + SSL/HTTPS · production releases · live debugging",
  },
  {
    id: "ai-workflow",
    title: "AI-Augmented Development",
    subtitle: "Claude Code · GitHub Copilot · ChatGPT · Codespaces",
    description:
      "Adopted AI-assisted development tools across code review, debugging and refactoring. Pairing Claude Code, GitHub Copilot, ChatGPT and GitHub Codespaces with a review-first habit cut development time by an estimated 30-40% on repetitive and review-heavy tasks.",
    tech: "Claude Code, GitHub Copilot, ChatGPT, GitHub Codespaces",
    tags: ["AI Tooling", "Code Review", "Productivity"],
    links: [],
    images: ["/assets/work/ai-workflow.svg"],
    imageAlts: ["AI-assisted code review: a refactor diff with suggested changes"],
    metric: "~30-40% faster on repetitive & review-heavy tasks",
  },
  {
    id: "digital-india",
    title: "Digital India Internship",
    subtitle: "Software Developer Intern · Mar - Dec 2024",
    description:
      "Contributed roughly 20-30 feature updates and bug fixes across multiple modules over a 9-month internship: UI improvements, API integration, and testing/deployment support under senior developer guidance, using Git and issue tracking inside an Agile/Scrum workflow.",
    tech: "JavaScript, React.js, REST APIs, Git, Agile/Scrum",
    tags: ["Internship", "UI", "API Integration"],
    links: [],
    images: ["/assets/work/digital-india.svg"],
    imageAlts: ["Commit log from the Digital India internship: features and fixes across modules"],
    metric: "~20-30 features & fixes · 9 months · multiple modules",
  },
  {
    id: "ascii-portrait",
    title: "ASCII Portrait Renderer",
    subtitle: "This Site · Next.js · Canvas",
    description:
      "The portrait in the About section is not a photo. A build-time script masks out the backdrop, equalises the face and maps it onto a 120-column glyph ramp; at runtime a canvas renderer decodes it in, scrambles glyphs around your cursor, and glitches when idle. The source photo never ships.",
    tech: "Next.js, TypeScript, Canvas 2D, sharp, GSAP",
    tags: ["Next.js", "Canvas", "Creative Coding"],
    links: [{ label: "See it live", href: "/#about", demo: true }],
    images: ["/assets/work/ascii-portrait.svg"],
    imageAlts: ["ASCII portrait renderer: glyph ramp and decode pipeline"],
    metric: "120×77 glyph grid · cursor-reactive · zero photo bytes shipped",
  },
] as const;

export const FEATURED_PROJECTS = PROJECTS.slice(0, 3);
export const SECONDARY_PROJECTS = PROJECTS.slice(3);


export const BUILDING = [
  {
    id: "building-fintech",
    status: "Active",
    title: "Fintech Modules @ Keyutech",
    description:
      "Shipping new feature modules across the MERN web app and the Flutter companion app: REST integrations, real-time features over Socket.IO, and production hardening.",
    tags: ["MERN", "Flutter", "Socket.IO"],
    steps: ["SCOPE", "BUILD", "REVIEW", "RELEASE", "MONITOR"],
  },
  {
    id: "building-portfolio",
    status: "Shipping",
    title: "This Portfolio — ASCII & WebGL",
    description:
      "A Next.js + GSAP portfolio with a canvas ASCII renderer that turns a photo into a live, cursor-reactive glyph field, without ever shipping the photo.",
    tags: ["Next.js", "Canvas", "GSAP"],
    steps: ["SKETCH", "PROTOTYPE", "POLISH", "DEPLOY", "ITERATE"],
  },
] as const;

export type BuildingItem = (typeof BUILDING)[number];
