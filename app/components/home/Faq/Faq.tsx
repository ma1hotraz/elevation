import { faqs } from "../homeData";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section className={styles.section} id="faq">
      <p className={styles.tag}>Frequently Asked Questions</p>
      <h2>
        Got Questions? We've Got <span>Answers.</span>
      </h2>
      <p className={styles.intro}>
        Clear answers to the most common questions about programs, batch
        format, and getting started.
      </p>

      <div className={styles.grid}>
        {faqs.map((faq, index) => (
          <details className={styles.item} key={faq}>
            <summary>
              <span className={styles.questionNo}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.questionText}>{faq}</span>
              <span className={styles.toggle} aria-hidden="true" />
            </summary>
            <p>
              Book a free counselling session and our team will guide you with
              the best program, timing, and mode.
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
