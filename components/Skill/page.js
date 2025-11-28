"use client";
import React from "react";
import styles from "./page.module.css"; 
const Skills = () => {
  const skills = [
    { icon: "bx bxl-html5", name: "HTML/CSS", percent: 75, barClass: styles.html },
    { icon: "bx bxl-javascript", name: "JavaScript", percent: 60, barClass: styles.js },
    { icon: "bx bxl-react", name: "React JS", percent: 52, barClass: styles.react },
    { icon: "bx bxl-react", name: "React Native", percent: 40, barClass: styles.native },
  ];

  return (
    <section className={styles.skillsSection} id="skill">
      <h2 className={styles.subtitle}>Professional Skills</h2>
      <p className={styles.text}>
        A professional web developer excels in creating and maintaining dynamic, user-friendly
        websites and applications through a deep understanding of front-end technologies.
      </p>

      {skills.map((skill, index) => (
        <div key={index} className={styles.skillData}>
          <div className={styles.skillName}>
            <i className={`${skill.icon} ${styles.icon}`}></i>
            <span>{skill.name}</span>
          </div>
          <div className={styles.barWrapper}>
            <div
              className={`${styles.bar} ${skill.barClass}`}
              style={{ width: `${skill.percent}%` }}
            ></div>
          </div>
          <span className={styles.percent}>{skill.percent}%</span>
        </div>
      ))}
    </section>
  );
};

export default Skills;
