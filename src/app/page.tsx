import { SiteShell } from "@/components/site-shell";
import { ProngSystem } from "@/components/prong-system";
import { WaitlistForm } from "@/components/waitlist-form";
import styles from "./page.module.css";

const heroStats = [
  { label: "Architecture", value: "3 prongs" },
  { label: "Inference target", value: "<200ms" },
  { label: "Model footprint", value: "<20MB" },
  { label: "Release mode", value: "eval-gated" },
];

const systemLanes = [
  {
    label: "Applications",
    body: "Discovery, planning, reservations, and operator workflows.",
  },
  {
    label: "Runtime",
    body: "Identity, consent, policy, transport, rollout, and recovery.",
  },
  {
    label: "Reality model",
    body: "State, scoring, simulation, and next-action planning.",
  },
];

const signalPath = ["Places", "Lists", "Groups", "Operations"];

const overviewCards = [
  {
    title: "User product",
    body: "AVRAI helps people discover places, build lists, coordinate plans, and follow through in the real world.",
  },
  {
    title: "Operator product",
    body: "The same stack supports reservations, host tooling, venue operations, and local workflow intelligence.",
  },
  {
    title: "Privacy runtime",
    body: "Identity, consent, transport, and rollout stay in a control plane instead of being scattered across app code.",
  },
  {
    title: "Learning system",
    body: "The reality model improves ranking and planning from saves, visits, returns, and attendance outcomes.",
  },
];

const stack = [
  {
    label: "Product surfaces",
    title: "Consumer and operator applications",
    items: [
      "Discovery, lists, shared planning, reservations, and local workflow tools",
      "Shared contracts across mobile products, operator tools, and the public web",
    ],
  },
  {
    label: "Control plane",
    title: "Identity, policy, transport, and release",
    items: [
      "Consent, authorization, encrypted transport, rollout, rollback, and recovery",
      "Inference, sync, and operator actions execute through runtime gates",
    ],
  },
  {
    label: "Decision models",
    title: "Compact models for ranking and planning",
    items: [
      "State representation, scoring, transition prediction, and planning",
      "Local-first inference with bounded training, evaluation, and promotion",
    ],
  },
  {
    label: "Security + cloud",
    title: "Narrow cloud responsibilities",
    items: [
      "Model delivery, encrypted sync, observability, and privacy-preserving aggregation",
      "Security services and key management for local-first and distributed operation",
    ],
  },
];

const modelBridge = [
  {
    label: "Why it matters",
    title: "It turns outcomes into better product decisions",
    body: "The model improves ranking, planning, and coordination using observed behavior instead of fixed heuristics alone.",
  },
  {
    label: "What it learns",
    title: "Fit, transitions, and follow-through",
    body: "It models people, places, groups, context, and likely next states to estimate relevance, risk, and expected completion.",
  },
  {
    label: "Why this design",
    title: "Built for bounded operational decisions",
    body: "General-purpose LLMs optimize for broad generation and reasoning. World models optimize for environment simulation. AVRAI optimizes for low-latency decision quality in one operating domain.",
  },
];

const realityProcess = [
  {
    step: "01",
    title: "Observe outcomes",
    body: "Collect signals such as saves, visits, dismissals, returns, reservations, and attendance.",
  },
  {
    step: "02",
    title: "Build compact state",
    body: "Encode users, entities, and contexts into a representation the model can score and simulate.",
  },
  {
    step: "03",
    title: "Train and compare",
    body: "Learn scoring and transition behavior, then shadow it against incumbent heuristics before promotion.",
  },
  {
    step: "04",
    title: "Ship under gates",
    body: "Promote only the models that clear privacy, rollout, rollback, and measurable outcome requirements.",
  },
];

export default function Home() {
  return (
    <SiteShell currentPath="/" tone="home">
      <div className={styles.homeAnchors}>
        <a className={styles.anchorPill} href="#what-it-is">
          What it is
        </a>
        <a className={styles.anchorPill} href="#prongs">
          3 prongs
        </a>
        <a className={styles.anchorPill} href="#stack">
          Tech stack
        </a>
        <a className={styles.anchorPill} href="#reality-model">
          Reality model
        </a>
        <a className={styles.anchorPill} href="#waitlist">
          Waitlist
        </a>
      </div>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Privacy-first discovery and coordination</p>
          <h1>
            AVRAI is building a system for discovering places, coordinating
            plans, and learning what works in the real world.
          </h1>
          <p className={styles.lede}>
            AVRAI combines three prongs: product applications, a control plane
            for identity and consent, and a compact reality model that
            improves ranking, planning, and coordination from observed
            outcomes.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#waitlist">
              Join the waitlist
            </a>
            <a className={styles.secondary} href="#prongs">
              Explore the system
            </a>
          </div>
          <p className={styles.disclaimer}>
            Designed for local-first inference, bounded cloud use, and
            evidence-gated releases.
          </p>
        </div>

        <aside className={styles.heroPanel}>
          <div className={styles.heroPanelHeader}>
            <p className={styles.sectionLabel}>System snapshot</p>
            <p className={styles.panelCode}>product / control plane / model</p>
          </div>
          <p className={styles.heroPanelTitle}>What AVRAI is.</p>
          <p className={styles.heroPanelText}>
            A discovery product, a privacy runtime, and a compact learning
            system working as one stack.
          </p>
          <div className={styles.heroLaneGrid}>
            {systemLanes.map((item) => (
              <article className={styles.heroLaneCard} key={item.label}>
                <span>{item.label}</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className={styles.heroStats}>
            {heroStats.map((item) => (
              <div className={styles.statCard} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <div className={styles.flowRail} aria-label="Avrai product arc">
            {signalPath.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.statement} id="what-it-is">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>What AVRAI is</p>
          <h2>A product stack, a control stack, and a learning stack.</h2>
          <p>
            Applications deliver product value. Runtime governs trust and
            release. The reality model improves decision quality.
          </p>
        </div>

        <div className={styles.statementGrid}>
          <article className={styles.quotePanel}>
            <p>
              A real-world discovery and coordination product built on a
              privacy runtime and a learning system.
            </p>
          </article>

          <div className={styles.principles}>
            {overviewCards.map((item) => (
              <article className={styles.card} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.prongsSection} id="prongs">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Three prongs</p>
          <h2>Separate the jobs. Connect them through one contract boundary.</h2>
          <p>
            Applications own experience. Runtime owns control. The reality
            model owns decision quality. The system only scales if those
            responsibilities stay distinct.
          </p>
        </div>

        <ProngSystem />
      </section>

      <section className={styles.stackSection} id="stack">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Tech stack</p>
          <h2>A product stack with narrow boundaries.</h2>
          <p>
            Product surfaces sit at the top. Control stays in the runtime.
            Decision quality sits in the model layer. Cloud services stay
            narrow.
          </p>
        </div>

        <div className={styles.stackGrid}>
          {stack.map((item) => (
            <article className={styles.stackCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <ul className={styles.bulletList}>
                {item.items.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.realitySection} id="reality-model">
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Reality model</p>
          <h2>The reality model is AVRAI&apos;s learning engine.</h2>
          <p>
            This is the layer that lets AVRAI move past static retrieval and
            hand-tuned heuristics. It learns which places fit, which plans are
            likely to hold, which reservations convert, and which actions
            improve follow-through.
          </p>
        </div>

        <div className={styles.realityBridge}>
          {modelBridge.map((item) => (
            <article className={styles.bridgeCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className={styles.homeProcessGrid}>
          {realityProcess.map((item) => (
            <article className={styles.processCard} key={item.step}>
              <span className={styles.processStep}>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <p className={styles.processNote}>
          That is the compounding advantage: AVRAI can improve from lived
          outcomes while keeping privacy, latency, and release control intact.
        </p>
      </section>

      <section className={styles.waitlistSection} id="waitlist">
        <div className={styles.waitlistIntro}>
          <p className={styles.sectionLabel}>Early access</p>
          <h2>Join the AVRAI waitlist.</h2>
          <p>
            Priorities: product pilots, operator design partners, and research
            conversations.
          </p>
        </div>
        <WaitlistForm />
      </section>
    </SiteShell>
  );
}
