import Image from "next/image";
import { StatCounter } from "./StatCounter";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroCard}>
        <nav className={styles.nav} aria-label="Main navigation">
          <a className={styles.brand} href="#home" aria-label="Elevation Coaching Institute home">
            <span className={styles.brandMark} aria-hidden="true">
              E
            </span>
            <span>
              <strong>Elevation</strong>
              <small>Coaching Institute</small>
            </span>
          </a>

          <div className={styles.navLinks}>
            <a href="#programs">Home</a>
            <a href="#programs">Programs</a>
            <a href="#about">About</a>
            <a href="#results">Results</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>

          <a
            className={styles.canadaBadge}
            href="#contact"
            data-mobile-label="Enquire Now"
          >
            Start Your Enquiry
          </a>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Focused coaching for ambitious students</p>

            <h1 className={styles.title}>
              Learn Better.
              <span>Achieve Bigger.</span>
            </h1>

            <p className={styles.heroText}>
              Premium coaching for Grade 9-12 Physics, Chemistry, Math, IELTS, and
              French across offline, online, and hybrid formats.
            </p>

            <div className={styles.statPanel} aria-label="Institute statistics">
              <p className={styles.statKicker}>Trusted outcomes</p>
              <div className={styles.statRibbon}>
                <div>
                  <strong>
                    <StatCounter end={500} suffix="+" />
                  </strong>
                  <small>Students Mentored</small>
                </div>
                <div>
                  <strong>
                    <StatCounter end={95} suffix="%" />
                  </strong>
                  <small>
                    Success
                    <br />
                    Rate
                  </small>
                </div>
                <div>
                  <strong>
                    <StatCounter end={10} suffix="+" />
                  </strong>
                  <small>Years Experience</small>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <span className={styles.sunOrb} />
            <span className={styles.mintBlob} />
            <span className={styles.dotCloud} />
            <Image
              className={styles.founderHero}
              src="/founder-kulkaran-singh.png"
              alt="Kulkaran Singh, founder of Kulkaran Coaching Institute"
              width={720}
              height={720}
              priority
            />
            <div className={styles.signatureCard}>
              <b>Kulkaran Singh</b>
              <small>Founder & Head Coach</small>
              <small>Kulkaran Coaching Institute</small>
            </div>
          </div>

          <form className={styles.enquiryCard} id="contact" aria-label="Enquiry form">
            <h2>Enquire Now</h2>
            <p>Book Your Free Counselling</p>

            <label>
              Full Name
              <input type="text" name="name" placeholder="Your full name" />
            </label>

            <label>
              Select Course
              <select name="course" defaultValue="">
                <option value="" disabled>
                  Select a course
                </option>
                <option>Math - Online</option>
                <option>Math - Offline</option>
                <option>Physics - Online</option>
                <option>Physics - Offline</option>
                <option>Chemistry - Online</option>
                <option>Chemistry - Offline</option>
                <option>IELTS Hybrid</option>
                <option>French Online</option>
              </select>
            </label>

            <label>
              Phone / Email
              <input type="text" name="contact" placeholder="Your phone or email" />
            </label>

            <label>
              Preferred Time
              <select name="time" defaultValue="">
                <option value="" disabled>
                  Select preferred time
                </option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </label>

            <label>
              Message <span>(Optional)</span>
              <textarea name="message" placeholder="How can we help you?" />
            </label>

            <button type="submit">
              Enquire Now <span>-&gt;</span>
            </button>
          </form>
        </div>

        <a className={styles.scrollCue} href="#programs" aria-label="Scroll to programs section">
          <span className={styles.scrollCueText}>Scroll</span>
          <span className={styles.scrollCueMouse} aria-hidden="true">
            <span className={styles.scrollCueDot} />
          </span>
        </a>
      </div>
    </section>
  );
}
