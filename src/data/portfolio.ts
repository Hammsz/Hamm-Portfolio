export type SocialLink = {
  label: string;
  href: string | null;
};

export type SkillGroup = {
  id: string;
  label: string;
  summary: string;
  skills: string[];
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
    availability: "Available for selected internships, freelance builds, and collaboration.",
    emailLabel: "contact pending",
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Works", href: "#works" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { label: "GitHub", href: null },
    { label: "LinkedIn", href: null },
    { label: "Email", href: null },
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
      summary: "Core browser and React skills for building structured user interfaces.",
      skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
    },
    {
      id: "interface",
      label: "Interface",
      summary: "Layout, responsive behavior, and accessibility practices for everyday product screens.",
      skills: ["Tailwind CSS", "Responsive Design", "Semantic HTML", "Keyboard Focus", "Component Layout"],
    },
    {
      id: "tools",
      label: "Tools",
      summary: "Working tools for version control, handoff, documentation, and implementation workflow.",
      skills: ["Git", "GitHub", "VS Code", "Figma Basics", "Code Review Basics"],
    },
  ] satisfies SkillGroup[],
  statements: ["You focus", "I handle", "It flows"],
};

export type PortfolioData = typeof portfolioData;
