import { portfolioData } from "@/data/portfolio";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Skills
          </p>
          <h2 id="skills-heading" className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            Tools for building the first version.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {Object.entries(portfolioData.skills).map(([group, skills]) => (
            <article key={group} className="border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold capitalize text-zinc-950">{group}</h3>
              <ul className="mt-5 space-y-3">
                {skills.map((skill) => (
                  <li key={skill} className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-zinc-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
