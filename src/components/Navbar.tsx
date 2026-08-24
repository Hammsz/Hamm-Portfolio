import { portfolioData } from "@/data/portfolio";

export default function Navbar() {
  return (
    <header className="site-header">
      <nav aria-label="Primary navigation" className="site-container site-nav">
        <div className="nav-side nav-side-left">
          <a href="#home" className="nav-menu-link">Menu</a>
        </div>
        <a href="#home" className="brand outline-none focus-visible:ring-2 focus-visible:ring-purple">
          MI<span aria-hidden="true">.</span>
        </a>
        <ul className="nav-links">
          {portfolioData.navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link">{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-side nav-side-right">
          <a href="#contact" className="nav-contact">Let&apos;s talk <span aria-hidden="true">↗</span></a>
        </div>
      </nav>
    </header>
  );
}
