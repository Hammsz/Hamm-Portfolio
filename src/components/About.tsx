import { portfolioData } from "@/data/portfolio";

export default function About() {
  const { person } = portfolioData;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-y border-black/10 bg-white px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            About
          </p>
          <h2 id="about-heading" className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            A practical frontend profile in progress.
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-8 text-zinc-700">
          <p>{person.summary}</p>
          <p className="font-semibold text-zinc-950">{person.availability}</p>
        </div>
      </div>
    </section>
  );
}
