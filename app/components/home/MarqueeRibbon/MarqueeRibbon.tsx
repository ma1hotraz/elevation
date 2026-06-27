import styles from "./MarqueeRibbon.module.css";

export function MarqueeRibbon() {
  return (
    <section className={styles.section} aria-hidden="true">
      <div className={styles.shell}>
        <div className={styles.ribbon}>
          <div className={styles.track}>
            <span>Physics Coaching</span>
            <span>Math Mastery</span>
            <span>Chemistry Prep</span>
            <span>IELTS Guidance</span>
            <span>French Classes</span>
            <span>Small Batches</span>
            <span>Physics Coaching</span>
            <span>Math Mastery</span>
            <span>Chemistry Prep</span>
            <span>IELTS Guidance</span>
            <span>French Classes</span>
            <span>Small Batches</span>
          </div>
        </div>
      </div>
    </section>
  );
}
