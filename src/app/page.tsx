import Image from "next/image";
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
          <div className={styles.brandLockup}>
            <Image
              src="/avrai-logo.png"
              alt="Avrai logo"
              width={72}
              height={72}
              className={styles.brandLogo}
              priority
            />
            <p className={styles.kicker}>Avrai</p>
          </div>
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
            <p className={styles.sectionLabel}>Personal</p>
            <h2>What people can do with Avrai.</h2>
            <ul className={styles.featureList}>
              <li>Find spots that match your mood, taste, and energy instead of digging through generic search results.</li>
              <li>Use maps, search, and saved lists to keep track of places worth returning to.</li>
              <li>Discover communities, clubs, and events connected to the places you already like.</li>
              <li>Plan with friends using group matching that helps everyone land on a place that fits.</li>
              <li>Get better recommendations over time with privacy-first learning designed to keep the experience personal, not invasive.</li>
            </ul>
          </article>

          <article className={styles.panel}>
            <p className={styles.sectionLabel}>Business</p>
            <h2>What places, hosts, and partners can do.</h2>
            <ul className={styles.featureList}>
              <li>Claim and manage a place profile so your location is represented accurately inside the app.</li>
              <li>Run reservations, event flows, and customer-facing experiences tied to your space.</li>
              <li>Work with local experts, hosts, and communities to create more relevant programming.</li>
              <li>Form partnerships around events, activations, and recurring local experiences.</li>
              <li>Access privacy-preserving insight layers without relying on invasive ad-tech behavior.</li>
            </ul>
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
            Early access and partnerships: <a href="mailto:reis@avrai.org">reis@avrai.org</a>
          </span>
        </footer>
      </main>
    </div>
  );
}
