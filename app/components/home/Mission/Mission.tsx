import type { ReactNode } from "react";
import { reasons } from "../homeData";
import styles from "./Mission.module.css";

const reasonIcons: Record<string, ReactNode> = {
  SB: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="22" cy="24" r="7" />
      <circle cx="42" cy="24" r="7" />
      <path d="M12 46c2.8-7.6 8.5-11.4 17-11.4S43 38.4 46 46" />
      <path d="M25 22h14" />
    </svg>
  ),
  EF: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M20 18h24v28H20z" />
      <path d="M26 14h12" />
      <path d="M26 30h12" />
      <path d="M26 38h8" />
      <path d="M44 20l6 6-6 6" />
    </svg>
  ),
  PG: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="20" r="8" />
      <path d="M18 48c2.6-8.2 7.4-12.3 14-12.3S43.3 39.8 46 48" />
      <path d="M46 18v14" />
      <path d="M39 25h14" />
    </svg>
  ),
  PR: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M16 46h32" />
      <path d="M21 39l8-10 7 6 11-14" />
      <path d="M44 21h7v7" />
    </svg>
  ),
  CA: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 14l5 8 9 2-6 7 1 11-9-4-9 4 1-11-6-7 9-2 5-8z" />
      <path d="M18 46h28" />
    </svg>
  ),
};

const reasonAccents: Record<string, string> = {
  SB: styles.green,
  EF: styles.blue,
  PG: styles.purple,
  PR: styles.green,
  CA: styles.blue,
};

export function Mission() {
  return (
    <section className={styles.section} aria-label="Why choose us">
      <p className={styles.tag}>Why Choose Us</p>
      <h2 className={styles.title}>
        Your <span>Success</span> is Our Mission
      </h2>
      <p className={styles.intro}>
        A thoughtful coaching experience built around clarity, consistency, and
        personal attention.
      </p>

      <div className={styles.grid}>
        {reasons.map(([code, title, text], index) => (
          <article className={`${styles.card} ${reasonAccents[code] ?? ""}`} key={title}>
            <div className={styles.cardTop}>
              <span className={styles.reasonTag}>0{index + 1}</span>
              <div className={styles.icon} aria-hidden="true">
                {reasonIcons[code]}
              </div>
            </div>
            <div className={styles.copy}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            <div className={styles.reasonMeta}>
              <span>Student-first approach</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
