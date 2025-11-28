"use client";
import { useEffect, useRef } from "react";
import "./LiquidLight.css";

export default function LiquidLight() {
  const maskRef = useRef(null);
  const pos = useRef({ x: 50, y: 50 });
  const target = useRef({ x: 50, y: 50 });

  // Smooth animation loop
  useEffect(() => {
    const mask = maskRef.current;

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1;
      pos.current.y += (target.current.y - pos.current.y) * 0.1;
      mask.style.setProperty("--x", `${pos.current.x}%`);
      mask.style.setProperty("--y", `${pos.current.y}%`);
      requestAnimationFrame(animate);
    };
    animate();

    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 100;
      target.current.y = (e.clientY / window.innerHeight) * 100;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (

      <div className="liquid-container">
        <div className="liquid-content"></div>
        <div className="liquid-mask" ref={maskRef}></div>
      </div>

  );
}
