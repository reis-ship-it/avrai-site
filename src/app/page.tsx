import type { Metadata } from "next";
import Link from "next/link";
import { KnotScene } from "@/components/knot-scene";
import { SiteShell } from "@/components/site-shell";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <SiteShell currentPath="/">
      <section className={styles.showcase} aria-labelledby="home-title">
        <div className={styles.knotStage}>
          <KnotScene />
        </div>

        <div className={styles.showcaseCopy}>
          <p className={styles.eyebrow}>AVRAI / EARLY ACCESS</p>
          <h1 id="home-title">Real life has context.</h1>
          <p>
            We’re building a more thoughtful way to find places and plans that
            fit the moment.
          </p>
          <Link className={styles.primaryAction} href="/access">
            Request access <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
