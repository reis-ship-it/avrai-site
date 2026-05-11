import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { footerNav, primaryNav } from "@/components/site-content";

type SiteShellProps = {
  children: ReactNode;
  currentPath: string;
  tone?:
    | "home"
    | "privacy"
    | "reality"
    | "platform"
    | "business"
    | "partners"
    | "roadmap";
};

type SitePageHeroProps = {
  eyebrow: string;
  title: string;
  lede: string;
  aside: ReactNode;
};

const toneClassMap = {
  home: styles.pageHome,
  privacy: styles.pagePrivacy,
  reality: styles.pageReality,
  platform: styles.pagePlatform,
  business: styles.pageBusiness,
  partners: styles.pagePartners,
  roadmap: styles.pageRoadmap,
};

export function SiteShell({
  children,
  currentPath,
  tone = "home",
}: SiteShellProps) {
  return (
    <div className={`${styles.page} ${toneClassMap[tone]}`}>
      <div className={styles.atmosphereLeft} />
      <div className={styles.atmosphereRight} />

      <main className={styles.main}>
        <header className={styles.topBar}>
          <Link className={styles.brandLink} href="/">
            <Image
              src="/avrai-logo.png"
              alt="Avrai logo"
              width={56}
              height={56}
              className={styles.brandLogo}
              priority
            />
            <div>
              <p className={styles.brandName}>AVRAI</p>
              <p className={styles.brandMeta}>
                privacy-first discovery and model infrastructure
              </p>
            </div>
          </Link>

          <nav className={styles.nav}>
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  currentPath === item.href
                    ? `${styles.navLinkActive} ${styles.navLink}`
                    : styles.navLink
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}

        <footer className={styles.footer}>
          <div>
            <p className={styles.footerTitle}>AVRAI</p>
            <p className={styles.footerTagline}>
              Privacy-first infrastructure for place discovery, coordination,
              and outcome-driven recommendations.
            </p>
          </div>

          <div className={styles.footerLinks}>
            {footerNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a href="mailto:reis@avrai.org">reis@avrai.org</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function SitePageHero({
  eyebrow,
  title,
  lede,
  aside,
}: SitePageHeroProps) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.pageHeroCopy}>
        <p className={styles.kicker}>{eyebrow}</p>
        <h1 className={styles.pageHeroTitle}>{title}</h1>
        <p className={styles.pageHeroLede}>{lede}</p>
      </div>
      <aside className={styles.heroPanel}>{aside}</aside>
    </section>
  );
}
