import type { Metadata } from "next";
import { BusinessSignupForm } from "@/components/business-signup-form";
import { SitePageHero, SiteShell } from "@/components/site-shell";
import styles from "@/app/page.module.css";

const businessSignals = [
  "Interest form",
  "Business app",
  "Node agent",
  "Pilot access",
];

const accountSteps = [
  {
    label: "01",
    title: "Submit interest",
    body: "Tell us who operates the business, where you are, and what kind of AVRAI Business access you want.",
  },
  {
    label: "02",
    title: "Download the preview",
    body: "Use the Business App web preview bundle or the current node-agent artifact while native installers are prepared.",
  },
  {
    label: "03",
    title: "Try the business flow",
    body: "Review the account, runtime, and node setup surfaces without creating a live registry account from the website.",
  },
  {
    label: "04",
    title: "Request pilot setup",
    body: "When the business is ready, AVRAI can configure account, node, and registry access through the app path.",
  },
];

const downloadCards = [
  {
    label: "Preview",
    title: "Business App web bundle",
    body: "Download the current Business App web/PWA build for review and local preview.",
    href: "/downloads/avrai-business-app-web-preview.zip",
    action: "Download app bundle",
  },
  {
    label: "macOS",
    title: "Business Node Agent",
    body: "Download the current unsigned macOS arm64 always-on node-agent executable.",
    href: "/downloads/business-node-agent/artifacts/macos/avrai-business-node-agent-macos-arm64",
    action: "Download macOS agent",
  },
  {
    label: "Manifest",
    title: "Download manifest",
    body: "Inspect the published artifact manifest, service templates, and runtime contract paths.",
    href: "/downloads/business-node-agent/download_manifest.json",
    action: "Open manifest",
  },
];

export const metadata: Metadata = {
  title: "Business | AVRAI",
  description:
    "Submit AVRAI Business interest and download the current Business App preview.",
};

export default function BusinessPage() {
  return (
    <SiteShell currentPath="/business" tone="business">
      <SitePageHero
        eyebrow="AVRAI Business"
        title="Download the business app preview and tell us you are interested."
        lede="AVRAI Business is currently a simple interest path plus preview downloads for the business app and the early always-on node agent."
        aside={
          <>
            <div className={styles.heroPanelHeader}>
              <p className={styles.sectionLabel}>Business path</p>
              <p className={styles.panelCode}>interest / download / pilot</p>
            </div>
            <p className={styles.heroPanelText}>
              The website collects interest. The app handles account and node
              workflows when pilot setup is ready.
            </p>
            <div className={styles.flowRail}>
              {businessSignals.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </>
        }
      />

      <section className={styles.journeySection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Current flow</p>
          <h2>The website is now interest and downloads only.</h2>
          <p>
            No public website submission creates a registry account, scans
            coordinates, or writes live business records. Those workflows stay
            in the Business App path.
          </p>
        </div>

        <div className={styles.journeyRail}>
          {accountSteps.map((item) => (
            <article className={styles.journeyCard} key={item.title}>
              <span className={styles.journeyBadge}>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.surfaceSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionLabel}>Downloads</p>
          <h2>Try the current Business App preview.</h2>
          <p>
            These are preview artifacts, not signed production installers. The
            native Windows and Linux node-agent binaries are not published in
            this website bundle yet.
          </p>
        </div>

        <div className={styles.surfaceGrid}>
          {downloadCards.map((item) => (
            <article className={styles.surfaceCard} key={item.title}>
              <p className={styles.cardLabel}>{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <a className={styles.downloadLink} href={item.href} download>
                {item.action}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.waitlistSection}>
        <div className={styles.waitlistIntro}>
          <p className={styles.sectionLabel}>Interest form</p>
          <h2>Tell us you want AVRAI Business.</h2>
          <p>
            This form only captures business interest and follow-up contact.
            It does not create a live business account or registry entry.
          </p>
        </div>
        <BusinessSignupForm />
      </section>
    </SiteShell>
  );
}
