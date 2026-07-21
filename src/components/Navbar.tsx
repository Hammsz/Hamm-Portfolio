import { portfolioData } from "@/data/portfolio";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-stone-50/90 backdrop-blur">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8"
      >
        <a
          href="#home"
          className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-950 outline-none transition hover:text-emerald-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4"
        >
          Muhammad Ilham
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {portfolioData.navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 outline-none transition hover:bg-zinc-950 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full border border-zinc-950 px-4 py-2 text-sm font-semibold text-zinc-950 outline-none transition hover:bg-zinc-950 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
