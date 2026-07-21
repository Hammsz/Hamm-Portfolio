import { portfolioData } from "@/data/portfolio";

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
          Services
        </p>
        <h2 id="services-heading" className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
          Focused frontend support.
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {portfolioData.services.map((service, index) => (
          <article key={service.title} className="border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-emerald-700">0{index + 1}</p>
            <h3 className="mt-5 text-2xl font-bold text-zinc-950">{service.title}</h3>
            <p className="mt-4 leading-7 text-zinc-700">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
