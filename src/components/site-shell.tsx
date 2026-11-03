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
          AVRAI
        </Link>
        <nav aria-label="Primary navigation">
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
        <span>© {new Date().getFullYear()} AVRAI</span>
        <div className={styles.footerLinks}>
          <a href="mailto:info@avrai.org">Contact</a>
          <a href="mailto:privacy@avrai.org">Privacy questions</a>
          <a href="mailto:security@avrai.org">Security</a>
          <a href="https://business.avrai.org/signup">For businesses</a>
        </div>
      </footer>
    </div>
  );
}
