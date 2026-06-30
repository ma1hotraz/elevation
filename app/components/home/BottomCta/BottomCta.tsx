import Image from "next/image";
import styles from "./BottomCta.module.css";

export function BottomCta() {
  return (
    <section className={styles.section}>
      <div className={styles.copyColumn}>
        <p className={styles.tag}>Start Your Journey</p>
        <div className={styles.copy}>
          <h2>Ready to Build a Clear Study Plan?</h2>
          <p>
            Share your course goal, current level, and preferred schedule.
            Elevation will guide you toward the right class format and next
            step after reviewing your needs.
          </p>
        </div>

        <div className={styles.highlights} aria-label="Counselling benefits">
          <span>Course Fit</span>
          <span>Level Review</span>
          <span>Next-Step Guidance</span>
        </div>

        <div className={styles.actions}>
          <a href="#contact" className={styles.mainCta}>
            Book Free Counselling <span>-&gt;</span>
          </a>
          <a href="#sample-tests" className={styles.secondaryCta}>
            View Sample Tests
          </a>
        </div>

        <div className={styles.contactMini}>
          <span>Call: +1 (437) 123-4567</span>
          <span>Location: Brampton, Ontario, Canada</span>
        </div>
      </div>

      <div className={styles.visualPanel}>
        <div className={styles.founderWrap}>
          <Image
            src="/founder-kulkaran-singh.png"
            alt="Elevation mentor"
            width={360}
            height={360}
            className={styles.founder}
          />
        </div>

        <div className={styles.visualCard}>
          <strong>Elevation Mentorship</strong>
          <span>Focused coaching path</span>
          <p>
            Personal guidance for PCM, IELTS, and French with sample
            assessments, structured classes, and a practical improvement plan.
          </p>
        </div>
      </div>
    </section>
  );
}
