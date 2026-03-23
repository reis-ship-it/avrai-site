import { WaitlistForm } from "@/components/waitlist-form";
import styles from "./page.module.css";

const userCapabilities = [
  {
    title: "Discover spots that fit",
    body: "The consumer app is built around spots, maps, search, lists, and recommendation signals that learn what kinds of places feel right for you.",
  },
  {
    title: "Plan with other people",
    body: "Group matching, shared lists, communities, and event flows are all in the app surface so making plans feels less like work.",
  },
  {
    title: "Use less feed, get more life",
    body: "The through-line across onboarding, discovery, events, and privacy settings is real-world reconnection rather than endless engagement.",
  },
];

const partnerCapabilities = [
  "Claim a place and connect it to your business profile.",
  "Run reservations, event flows, and customer-facing place experiences.",
  "Discover experts, form partnerships, and host local experiences.",
  "Use privacy-preserving insights without turning users into ad inventory.",
];

const appFlow = [
  "Tell Avrai what kinds of energy, places, and social settings feel right.",
  "Get matched with spots, lists, communities, and events that fit your actual preferences.",
  "Bring friends into the plan with group matching instead of chaotic group chats.",
  "Let the system improve over time while keeping identity and sensitive data private.",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.orbA} />
      <div className={styles.orbB} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Avrai consumer app</p>
          <h1>
            Find your people, your places, and a better reason to go out.
          </h1>
          <p className={styles.lede}>
            Avrai is a privacy-first discovery app for people who are tired of
            endless scrolling, choice paralysis, and making plans through a
            dozen tabs and group chats. It helps you find spots, communities,
            and events that actually fit.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#waitlist">
              Join the waitlist
            </a>
            <a className={styles.secondary} href="#how-it-works">
              See how it works
            </a>
          </div>
        </section>

        <section className={styles.statement}>
          <p>
            The product direction in the repo is consistent: meaningful
            real-world outcomes over engagement loops, privacy as a hard
            boundary, and technology used to get people back into real places
            with real other people.
          </p>
        </section>

        <section className={styles.principles} id="how-it-works">
          {userCapabilities.map((item) => (
            <article className={styles.card} key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </section>

        <section className={styles.roadmap}>
          <div className={styles.roadmapIntro}>
            <p className={styles.sectionLabel}>How the app works</p>
            <h2>Built around places first, then communities, events, and plans.</h2>
          </div>
          <ol className={styles.timeline}>
            {appFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className={styles.dualPanel}>
          <article className={styles.panel}>
            <p className={styles.sectionLabel}>What users get</p>
            <h2>Consumer app capabilities pulled from the product repo.</h2>
            <ul className={styles.featureList}>
              <li>Spots, map, and search flows for finding places that match your vibe.</li>
              <li>Lists and local knowledge layers that make good recommendations reusable.</li>
              <li>Communities, clubs, and events for turning a good place into an actual social life.</li>
              <li>Group matching for friends, family, or coworkers trying to decide together.</li>
              <li>Privacy controls, on-device learning, and AI2AI/federated systems aimed at keeping recommendations useful without treating users like products.</li>
            </ul>
          </article>

          <article className={styles.panel}>
            <p className={styles.sectionLabel}>For 3rd parties</p>
            <h2>Capabilities for places, hosts, and partners.</h2>
            <ul className={styles.featureList}>
              {partnerCapabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.panelNote}>
              This section is based on the business, reservations, claim-place,
              partnership, and event surfaces in the repo, not the internal
              admin app.
            </p>
          </article>
        </section>

        <section className={styles.techSection}>
          <div className={styles.techIntro}>
            <p className={styles.sectionLabel}>Privacy-first intelligence</p>
            <h2>The model is simple even if the underlying system is not.</h2>
          </div>
          <div className={styles.techGrid}>
            <article className={styles.techCard}>
              <h3>On-device preference learning</h3>
              <p>
                The app is built to learn from your preferences and behavior
                without centering the whole experience on cloud surveillance.
              </p>
            </article>
            <article className={styles.techCard}>
              <h3>AI2AI and federated improvement</h3>
              <p>
                The repo and product docs point to AI-to-AI exchange and
                federated learning as the engine for better matching over time.
              </p>
            </article>
            <article className={styles.techCard}>
              <h3>Group and community matching</h3>
              <p>
                The app is not just about solo recommendations. It also aims to
                improve where groups go, what communities form, and which events
                feel worth showing up for.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.waitlistSection} id="waitlist">
          <div className={styles.waitlistIntro}>
            <p className={styles.sectionLabel}>Early access</p>
            <h2>Join the Avrai waitlist.</h2>
            <p>
              Use the form if you want access as an early user, event host,
              place partner, or business exploring what Avrai could unlock.
            </p>
          </div>
          <WaitlistForm />
        </section>

        <footer className={styles.footer}>
          <span>avrai.org</span>
          <span>
            Consumer app positioning from the Avrai repo. Partner inquiries:
            {" "}
            <a href="mailto:reis@avrai.org">reis@avrai.org</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
