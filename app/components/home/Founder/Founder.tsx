import Image from "next/image";
import styles from "./Founder.module.css";

export function Founder() {
  return (
    <section className={styles.section} id="about">
      <div className={styles.photoWrap}>
        <Image
          src="/founder-kulkaran-singh.png"
          alt="Kulkaran Singh"
          width={760}
          height={760}
          className={styles.photo}
        />
        <div className={styles.yearsBadge}>
          <strong>10+</strong>
          <span>Years of Teaching Excellence</span>
        </div>
      </div>

      <div className={styles.copy}>
        <p className={styles.tag}>Meet the Founder</p>
        <h2>Kulkaran Singh</h2>
        <h3>Educator. Mentor. Guide.</h3>
        <p>
          With over a decade of teaching experience in India and Canada, I
          founded Kulkaran Coaching Institute with a simple vision - to help
          students build strong concepts, confidence, and character.
        </p>
        <p>
          I personally mentor students to help them achieve their academic and
          language goals with clarity, patience, and structured guidance.
        </p>
        <ul>
          <li>10+ Years of Teaching Experience</li>
          <li>Hundreds of Students Mentored</li>
          <li>Passionate About Student Success</li>
        </ul>
        <span className={styles.signature}>Kulkaran Singh</span>
      </div>

      <aside className={styles.quoteCard}>
        <span>"</span>
        <p>Every student has potential. My mission is to unlock it.</p>
        <strong>- Kulkaran Singh</strong>
      </aside>
    </section>
  );
}
