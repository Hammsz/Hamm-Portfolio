import { portfolioData } from "@/data/portfolio";

export default function Works() {
  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="bg-zinc-950 px-5 py-20 text-white sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">
            Works
          </p>
          <h2 id="works-heading" className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Draft project slots.
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            These cards are placeholders for Muhammad Ilham&apos;s future real projects. They intentionally avoid external links and borrowed assets.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {portfolioData.projects.map((project) => (
            <article key={project.title} className="flex min-h-80 flex-col justify-between border border-white/15 bg-white/5 p-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                  {project.type}
                </p>
                <h3 className="mt-5 text-2xl font-bold">{project.title}</h3>
                <p className="mt-4 leading-7 text-zinc-300">{project.description}</p>
              </div>
              <ul aria-label={`${project.title} draft stack`} className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} className="rounded-full border border-white/20 px-3 py-1 text-sm text-zinc-200">
                    {item}
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

