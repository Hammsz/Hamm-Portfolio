export type SocialLink = {
  platform: "github" | "linkedin" | "instagram";
  label: string;
  href: string | null;
};

export type SkillGroup = {
  id: string;
  label: string;
  summary: string;
  skills: string[];
};

export type NavigationItem = {
  label: string;
  href: `#${string}`;
};

export const portfolioData = {
  brandName: "ILHAM",
  fullName: "Muhammad Ilham",
  person: {
    role: "Frontend Developer",
    location: "Indonesia",
    tagline: "Building focused, responsive, and maintainable digital interfaces.",
    summary:
      "Muhammad Ilham is preparing a portfolio centered on practical frontend work, clear user flows, and carefully structured interfaces. This copy is Phase 1 draft content and should be replaced with verified personal details before publishing.",
    about: [
      "I’m Muhammad Ilham, a Computer Science student and frontend developer focused on building clear, responsive, and maintainable digital experiences. I enjoy turning ideas into practical interfaces with thoughtful structure, accessible interactions, and careful attention to detail.",
      "My work centers on React, Next.js, TypeScript, and modern CSS. I approach each project with curiosity and discipline, balancing visual polish with performance, usability, and code that remains easy to evolve.",
    ],
    availability: "Available for selected internships, freelance builds, and collaboration.",
    contactEmail: "your-email@example.com",
    emailLabel: "contact pending",
  },
  hero: {
    microcopyLeft: "Computer Science Student & Developer",
    microcopyRight: "Building ideas into useful experiences",
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Works", href: "#works" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavigationItem[],
  menuWords: ["CREATE", "FOCUS", "DETAIL", "SHAPES", "CRAFTED", "CURIOUS"],
  socialLinks: [
    { platform: "github", label: "GitHub", href: null },
    { platform: "linkedin", label: "LinkedIn", href: null },
    { platform: "instagram", label: "Instagram", href: null },
  ] satisfies SocialLink[],
  services: [
    {
      number: "01",
      title: "Responsive Websites",
      description:
        "Draft service for building clean pages that hold their shape across desktop, tablet, and mobile screens.",
    },
    {
      number: "02",
      title: "Interface Implementation",
      description:
        "Draft service for turning approved layouts into semantic React components with readable structure.",
    },
    {
      number: "03",
      title: "Frontend Maintenance",
      description:
        "Draft service for improving consistency, spacing, accessibility, and component organization in existing projects.",
    },
    {
      number: "04",
      title: "Accessible Foundations",
      description:
        "Draft service for basic keyboard support, meaningful landmarks, clear labels, and visible focus states.",
    },
    {
      number: "05",
      title: "Performance Readiness",
      description:
        "Draft service for lightweight static sections, stable media areas, and content that can grow safely later.",
    },
  ],
  projects: [
    {
      title: "Portfolio Case Study Draft",
      type: "Draft project",
      description:
        "A placeholder for a future personal portfolio case study. Replace this with a real project narrative, screenshots, and measured outcomes.",
      meta: "Personal site / Phase draft",
      cta: "Details pending",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Dashboard Interface Draft",
      type: "Draft project",
      description:
        "A placeholder for an admin or analytics interface project. No external product, client, or reference identity is represented here.",
      meta: "Interface concept / Draft",
      cta: "Case study pending",
      stack: ["React", "Responsive UI", "Components"],
    },
    {
      title: "Learning Archive Draft",
      type: "Draft project",
      description:
        "A placeholder for selected learning projects that can later show Muhammad Ilham's growth, decisions, and frontend fundamentals.",
      meta: "Learning work / Draft",
      cta: "Archive pending",
      stack: ["HTML", "CSS", "JavaScript"],
    },
  ],
  skillGroups: [
    {
      id: "frontend",
      label: "Frontend",
      summary: "Typed, component-driven interfaces with responsive styling and motion.",
      skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "GSAP"],
    },
    {
      id: "backend",
      label: "Backend",
      summary: "Server applications, APIs, and relational data foundations.",
      skills: ["Node.js", "Express.js", "Python", "PostgreSQL", "REST API"],
    },
    {
      id: "devops",
      label: "DevOps",
      summary: "Containerized delivery, automation, Linux, and web-server operations.",
      skills: ["Docker", "GitHub Actions", "Linux", "Nginx"],
    },
    {
      id: "tools",
      label: "Tools",
      summary: "Tools for collaboration, API testing, design handoff, and verification.",
      skills: ["Git", "GitHub", "Postman", "Figma", "Jest"],
    },
  ] satisfies SkillGroup[],
  skillOrder: [
    "React",
    "Node.js",
    "Docker",
    "Git",
    "PostgreSQL",
    "TypeScript",
    "GitHub Actions",
    "GitHub",
    "Linux",
    "Next.js",
    "Python",
    "Postman",
    "Figma",
    "REST API",
    "GSAP",
    "Nginx",
    "Tailwind CSS",
    "Express.js",
    "Jest",
  ],
  statements: ["You focus", "I handle", "It flows"],
};

export type PortfolioData = typeof portfolioData;
