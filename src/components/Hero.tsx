import { portfolioData } from "@/data/portfolio";

export default function Hero() {
  const { person } = portfolioData;

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            {person.role} / {person.location}
          </p>
          <h1
            id="home-heading"
            className="max-w-5xl text-5xl font-black leading-none tracking-tight text-zinc-950 sm:text-7xl lg:text-8xl"
          >
            {person.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-700 sm:text-2xl">
            {person.tagline}
          </p>
        </div>
        <aside
          aria-label="Current portfolio status"
          className="border-l-4 border-emerald-500 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Phase 1 Draft
          </p>
          <p className="mt-4 text-lg leading-7 text-zinc-800">
            Static responsive foundation with editable data, ready for real case studies and visual polish.
          </p>
        </aside>
      </div>
    </section>
  );
}
