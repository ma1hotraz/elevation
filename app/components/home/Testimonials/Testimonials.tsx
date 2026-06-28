import { testimonials } from "../homeData";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <p className={styles.tag}>Results That Inspire</p>
      <h2>
        What Our <span>Students & Parents</span> Say
      </h2>
      <p className={styles.intro}>
        Honest feedback from students who gained stronger concepts, more
        confidence, and better outcomes.
      </p>

      <div className={styles.storiesGrid}>
        {testimonials.map((testimonial) => (
          <article className={styles.testimonial} key={testimonial.name}>
            <div className={styles.stars}>*****</div>
            <p>"{testimonial.quote}"</p>
            <div className={styles.person}>
              <span>{testimonial.avatar}</span>
              <div>
                <b>{testimonial.name}</b>
                <small>{testimonial.role}</small>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className={styles.resultsCard} id="results">
        <div className={styles.resultsHeading}>
          <h3>
            Consistent Results.
            <span>Real Progress.</span>
          </h3>
        </div>

        <div className={styles.statsGrid}>
          <div>
            <strong>95%</strong>
            <span>Target Achieved</span>
          </div>
          <div>
            <strong>500+</strong>
            <span>Students Mentored</span>
          </div>
          <div>
            <strong>10+</strong>
            <span>Teaching Excellence</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
