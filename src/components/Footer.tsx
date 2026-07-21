import { portfolioData } from "@/data/portfolio";

export default function Footer() {
  const { person } = portfolioData;

  return (
    <footer id="contact" aria-labelledby="contact-heading" className="border-t border-black/10 bg-white px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Contact
          </p>
          <h2 id="contact-heading" className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Start with a simple hello.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-zinc-700">
            Phase 1 uses a placeholder email only. Replace it with Muhammad Ilham&apos;s real contact before publishing.
          </p>
        </div>
        <address className="not-italic">
          <a
            href={`mailto:${person.email}`}
            className="inline-flex rounded-full bg-zinc-950 px-5 py-3 font-semibold text-white outline-none transition hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            aria-label={`Email ${person.name}`}
          >
            {person.email}
          </a>
        </address>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-black/10 pt-6 text-sm text-zinc-500">
        <p>Copyright 2026 Muhammad Ilham. Static portfolio draft.</p>
      </div>
    </footer>
  );
}

