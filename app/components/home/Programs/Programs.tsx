import type { ReactNode } from "react";
import { programs } from "../homeData";
import styles from "./Programs.module.css";

const programIcons: Record<string, ReactNode> = {
  PCM: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="21" cy="24" r="8" />
      <circle cx="43" cy="20" r="6" />
      <path d="M16 41c3.5-5.8 9.1-8.7 16.8-8.7 7.1 0 12.7 2.6 16.7 7.8" />
      <path d="M24 24h14" />
      <path d="M43 14v12" />
      <path d="M18 48h28" />
    </svg>
  ),
  IELTS: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="14" y="12" width="36" height="40" rx="8" />
      <path d="M22 24h20" />
      <path d="M22 32h20" />
      <path d="M22 40h12" />
      <path d="M42 40l4 4 8-10" />
    </svg>
  ),
  FR: (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 46c0-11 6.2-18 14-18 8.6 0 14 7.2 14 18" />
      <path d="M22 23c0-5.6 4.6-10 10-10s10 4.4 10 10" />
      <path d="M24 30c3 2.3 5.7 3.4 8 3.4 2.8 0 5.4-1.1 8-3.4" />
      <path d="M20 46h24" />
    </svg>
  ),
};

export function Programs() {
  return (
    <section className={styles.section} id="programs">
      <p className={styles.tag}>Our Programs</p>
      <h2 className={styles.title}>
        Courses Designed for <span>Real Results</span>
      </h2>
      <p className={styles.intro}>
        Expert-led coaching with a structured approach, personal attention,
        and a clear path from basics to performance.
      </p>

      <div className={styles.grid}>
        {programs.map((program) => (
          <article className={`${styles.card} ${styles[program.accent]}`} key={program.title}>
            <div className={styles.cardTop}>
              <span className={styles.courseTag}>{program.tag}</span>
              <div className={styles.icon}>{programIcons[program.icon] ?? program.icon}</div>
            </div>
            <div className={styles.copy}>
              <h3>{program.title}</h3>
              <h4>{program.subtitle}</h4>
              <p>{program.description}</p>
            </div>
            <div className={styles.points}>
              {program.points.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
            <a href="#contact">
              Learn More
              <span className={styles.ctaArrow} aria-hidden="true">
                -&gt;
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
