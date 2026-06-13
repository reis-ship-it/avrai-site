import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { primaryNav } from "@/components/site-content";

type SiteShellProps = {
  children: ReactNode;
  currentPath: string;
  tone?: "home" | "contact" | "about" | "business";
};

type SitePageHeroProps = {
  eyebrow: string;
  title: string;
  lede: string;
  aside?: ReactNode;
};

const toneClassMap = {
  home: styles.pageHome,
  contact: styles.pageContact,
  about: styles.pageAbout,
  business: styles.pageBusiness,
};

export function SiteShell({
  children,
  currentPath,
  tone = "home",
}: SiteShellProps) {
  return (
    <div className={`${styles.page} ${toneClassMap[tone]}`}>
      <header className={styles.siteHeader}>
        <Link className={styles.brandLink} href="/" aria-label="AVRAI home">
          <Image
            src="/avrai-logo.png"
            alt="AVRAI logo"
            width={48}
            height={48}
            className={styles.brandLogo}
            priority
          />
          <div>
            <p className={styles.brandName}>AVRAI</p>
          </div>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                currentPath === item.href
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p className={styles.footerLine}>
          <span>avrai © 2026</span>
          <a href="mailto:info@avrai.org">info@avrai.org</a>
        </p>
      </footer>
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
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lede}</p>
      </div>
      {aside ? <aside className={styles.pageHeroAside}>{aside}</aside> : null}
    </section>
  );
}
