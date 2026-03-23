import styles from "./page.module.css";

const principles = [
  {
    title: "Signal over noise",
    body: "Avrai is being shaped around clear recommendations, real context, and less algorithmic clutter.",
  },
  {
    title: "Plans with texture",
    body: "The product direction is about helping people move from browsing to actually going somewhere meaningful.",
  },
  {
    title: "Built to evolve",
    body: "This site now lives in a Vercel-ready codebase so updates can happen quickly, cleanly, and with AI in the loop.",
  },
];

const roadmap = [
  "Launch a clear public-facing homepage for avrai.org.",
  "Add product story, waitlist, and contact flows.",
  "Expand the site as the broader Avrai product direction sharpens.",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.orbA} />
      <div className={styles.orbB} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Avrai.org is being rebuilt</p>
          <h1>
            A sharper digital front door for the next shape of going out.
          </h1>
          <p className={styles.lede}>
            This repository is the new public site for Avrai, moved into a
            Vercel-friendly setup so the website can evolve faster than it ever
            could inside a site builder.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#direction">
              See the direction
            </a>
            <a className={styles.secondary} href="mailto:reis@avrai.org">
              Contact
            </a>
          </div>
        </section>

        <section className={styles.statement}>
          <p>
            Avrai is about finding better nights, better places, and better
            reasons to leave the house. The website should feel like the same
            idea: clear, alive, and worth returning to.
          </p>
        </section>

        <section className={styles.principles} id="direction">
          {principles.map((item) => (
            <article className={styles.card} key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>

        <section className={styles.roadmap}>
          <div className={styles.roadmapIntro}>
            <p className={styles.sectionLabel}>Current buildout</p>
            <h2>The site starts simple, then expands with the product.</h2>
          </div>
          <ol className={styles.timeline}>
            {roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <footer className={styles.footer}>
          <span>avrai.org</span>
          <span>Now running from a GitHub + Vercel workflow</span>
        </footer>
      </main>
    </div>
  );
}
