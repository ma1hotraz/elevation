import styles from "./SampleAssessments.module.css";

const assessments = [
  {
    tag: "IELTS",
    title: "IELTS Reading Sample",
    format: "Google Form",
    timing: "Reading test format",
    description:
      "View the reading passage and question style used in Elevation's IELTS practice tests.",
    points: ["Passage-based questions", "Online response format", "Reading-focused sample"],
    href: "https://forms.gle/vbc4L2bRRFuPqYdu9",
    action: "View Sample",
    accent: "blue",
  },
  {
    tag: "PCM",
    title: "PCM Test Sample",
    format: "Physics / Chemistry / Math",
    timing: "Grade 9-12 test format",
    description:
      "A simple place to share the Physics, Chemistry, and Math sample test link once available.",
    points: ["Subject-wise questions", "Grade-level practice", "Concept and application mix"],
    href: "",
    action: "Sample Link Coming Soon",
    accent: "green",
  },
  {
    tag: "French",
    title: "French Test Sample",
    format: "Online Form",
    timing: "Language test format",
    description:
      "A simple place to share the French sample test link once the form is ready.",
    points: ["Grammar questions", "Reading comprehension", "Level-check style"],
    href: "",
    action: "Sample Link Coming Soon",
    accent: "purple",
  },
];

export function SampleAssessments() {
  return (
    <section className={styles.section} id="sample-tests">
      <div className={styles.header}>
        <p className={styles.tag}>Sample Tests</p>
        <h2>
          View Our Test <span>Sample Formats</span>
        </h2>
        <p>
          These sample links show visitors the format of tests Elevation uses
          across IELTS, PCM, and French courses.
        </p>
      </div>

      <div className={styles.grid}>
        {assessments.map((assessment) => (
          <article
            className={`${styles.card} ${styles[assessment.accent]}`}
            key={assessment.title}
          >
            <div className={styles.cardTop}>
              <span className={styles.status}>{assessment.tag}</span>
              <span className={styles.format}>{assessment.format}</span>
            </div>
            <h3>{assessment.title}</h3>
            <p className={styles.timing}>{assessment.timing}</p>
            <p className={styles.description}>{assessment.description}</p>
            <div className={styles.points}>
              {assessment.points.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
            {assessment.href ? (
              <a
                href={assessment.href}
                target={assessment.href.startsWith("http") ? "_blank" : undefined}
                rel={assessment.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {assessment.action}
                <span aria-hidden="true">-&gt;</span>
              </a>
            ) : (
              <span className={styles.disabledCta}>
                {assessment.action}
                <span aria-hidden="true">-&gt;</span>
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
