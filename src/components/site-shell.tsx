import type { ReactNode } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";

type SiteShellProps = {
  children: ReactNode;
  currentPath: "/" | "/access";
};

export function SiteShell({ children, currentPath }: SiteShellProps) {
  return (
    <div className={styles.page}>
      <header className={styles.siteHeader}>
        <Link className={styles.brand} href="/" aria-label="AVRAI home">
          AVRAI<span aria-hidden="true">.</span>
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link className={styles.navLink} href="/#how-it-works">
            How it works
          </Link>
          <Link
            className={[
              styles.navAction,
              currentPath === "/access" && styles.navActionCurrent,
            ]
              .filter(Boolean)
              .join(" ")}
            href="/access"
            aria-current={currentPath === "/access" ? "page" : undefined}
          >
            Request access
          </Link>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer} id="contact">
        <div className={styles.footerBrand}>AVRAI</div>
        <p>Real life has context.</p>
        <div className={styles.footerLinks}>
          <a href="mailto:info@avrai.org">Contact</a>
          <a href="mailto:privacy@avrai.org">Privacy questions</a>
          <a href="mailto:security@avrai.org">Security</a>
          <a href="https://business.avrai.org/signup">For businesses</a>
        </div>
        <small>© {new Date().getFullYear()} AVRAI</small>
      </footer>
    </div>
  );
}
