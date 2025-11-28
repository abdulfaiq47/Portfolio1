"use client";
import Image from "next/image";
import LiquidLight from "@/components/Hover/page";
import styles from "./page.module.css";
import GradualBlur from "@/components/BottBlur/page";
import SciFiDashboard from "@/components/Background/page";
import ScrollReveal from "@/components/ScrolRevel/page";
import Navbar from "@/components/Navbar/page";
import { ReactTyped } from "react-typed";
import Skills from "@/components/Skill/page";
import { ContactF } from "@/components/Contact/page";


export default function Home() {
  return (
    <>
      {/*  */}
      <Navbar />
      <section id="main" className={styles.Main}>
        <div className={styles.HomeAB}>
          <ScrollReveal>
            <div className={styles.IntroMain}>
              <div className={styles.IntroText}>
                <h2>
                  Hi,
                  <br />
                  I&apos;m <span className={styles.AbFaiq}>Abdul Faiq</span>
                </h2>

                <ReactTyped
                  strings={[
                    "Web Developer",
                    "Frontend Developer",
                    "MERN Stack Developer",
                  ]}
                  typeSpeed={40}
                  backSpeed={50}
                  loop
                />
              </div>
              <div className={styles.FaiqImg}>
                <Image
                  className={styles.ImgBack}
                  src="/img back.png"
                  width={100}
                  height={100}
                  alt="Faiq"
                />
                <Image
                  className={styles.FImg}
                  src="/Faiq.png"
                  width={100}
                  height={100}
                  alt="Faiq"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className={styles.background}>
          <LiquidLight />
          <SciFiDashboard />
        </div>
      </section>
      <hr className={styles.liquidhr} />
      <section id="about" className={styles.About}></section>
      <hr className={styles.liquidhr} />
      <section id="skill" className={styles.Skill}>
        <ScrollReveal>
          <Skills />
        </ScrollReveal>
      </section>
      <hr className={styles.liquidhr} />
      <section id="projects" className={styles.projects}>
        {/* <Projectss /> */}
      </section>
      <hr className={styles.liquidhr} />
      <section id="contact" className={styles.Contact}>
        <ScrollReveal>
          <ContactF />
        </ScrollReveal>
      </section>
      <div
        style={{
          position: "fixed",
          bottom: "0px",
          height: "73px",
          width: "100%",
        }}
      >
        <GradualBlur
          target="parent"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential={true}
          opacity={1}
        />
      </div>
      lorem
    </>
  );
}
