"use client";
import "./page.module.css";
import style from "./page.module.css";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional
});

const Navbar = () => {
  const handleClick = (id) => {
    let getid = document.getElementById(id);
    if (getid) {
      getid.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`${oswald.className} ${style.Navbar} `}>
      <div className={style.Faiq}>Faiq</div>
      <div className="Ulcomp">
        <ul>
          <li className={`${style.underlineAnimation}  ${style.f} ` }>
            <button onClick={() => handleClick("main")}>Home</button>
          </li>
          <li className={`${style.underlineAnimation}  ${style.f} ` }>
            <button onClick={() => handleClick("about")}>About</button>
          </li>
          <li className={`${style.underlineAnimation}  ${style.f} ` }>
            <button onClick={() => handleClick("skill")}>Skill</button>
          </li>
          <li className={`${style.underlineAnimation}  ${style.f} ` }>
            <button onClick={() => handleClick("projects")}>Projects</button>
          </li>
          <li className={`${style.underlineAnimation}  ${style.f} ` }>
            <button onClick={() => handleClick("contact")}>Contact</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
