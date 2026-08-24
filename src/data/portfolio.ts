export const portfolioData = {
  person: {
    name: "Muhammad Ilham",
    role: "Frontend Developer",
    location: "Indonesia",
    tagline: "Building clear, responsive, and maintainable web interfaces.",
    summary:
      "Muhammad Ilham is shaping a portfolio focused on practical web development, clean UI, and thoughtful user experiences. This content is a Phase 1 draft and can be updated as real projects and achievements are finalized.",
    availability: "Open to internships, freelance work, and collaboration.",
    email: "muhammad.ilham@example.com",
  },
  socialLinks: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Email", href: "mailto:muhammad.ilham@example.com" },
  ],
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Works", href: "#works" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
  services: [
    {
      title: "Responsive Websites",
      description:
        "Draft service: creating static and dynamic pages that adapt cleanly across desktop, tablet, and mobile screens.",
    },
    {
      title: "Interface Implementation",
      description:
        "Draft service: turning approved layouts into semantic, accessible, and maintainable React components.",
    },
    {
      title: "Frontend Maintenance",
      description:
        "Draft service: improving structure, readability, and consistency in existing frontend codebases.",
    },
    {
      title: "Accessible Interfaces",
      description:
        "Draft service: shaping clear interfaces with semantic structure, keyboard support, and readable interaction states.",
    },
    {
      title: "Performance Foundations",
      description:
        "Draft service: organizing frontend delivery for quick loading, stable layouts, and maintainable future growth.",
    },
  ],
  projects: [
    {
      title: "Personal Portfolio Draft",
      type: "Draft project",
      description:
        "A placeholder project for Muhammad Ilham's future portfolio case study. Replace this with a real project summary before publishing.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Dashboard Interface Concept",
      type: "Draft project",
      description:
        "A draft card for a future dashboard or admin interface project. Metrics, screenshots, and links are intentionally not included yet.",
      stack: ["React", "UI Design", "Responsive Layout"],
    },
    {
      title: "Learning Project Archive",
      type: "Draft project",
      description:
        "A placeholder for selected learning projects that show growth, problem solving, and frontend fundamentals.",
      stack: ["HTML", "CSS", "JavaScript"],
    },
  ],
  skills: {
    frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
    styling: ["Tailwind CSS", "Responsive Design", "Accessibility Basics"],
    tools: ["Git", "GitHub", "VS Code", "Figma Basics"],
  },
};

export type PortfolioData = typeof portfolioData;
