import { portfolioData } from "@/data/portfolio";
import Clock from "@/components/Clock";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation placeholder">
        <div className="nav-slot nav-left">
          <button className="menu-trigger" type="button" aria-label="Menu placeholder for future navigation">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <a className="wordmark" href="#home" aria-label={`${portfolioData.brandName} home`}>
          {portfolioData.brandName}
        </a>
        <div className="nav-slot nav-right">
          <Clock />
        </div>
      </nav>
    </header>
  );
}
