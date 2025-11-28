"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./page.module.css";

const clamp = (n, min, max) => {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
};

export default function SciFiDashboard() {
  // controls
  const [bg, setBg] = useState(8);
  const [amount, setAmount] = useState(60);
  const [opacity, setOpacity] = useState(65);
  const [intensity, setIntensity] = useState(120);
  const [live, setLive] = useState(true);
  const [syncOn, setSyncOn] = useState(false);
  const [glow, setGlow] = useState(true);
  const [holoOn, setHoloOn] = useState(false);

  // events & terminal
  const [events, setEvents] = useState([
    { t: "09:12:04", text: "Calibration complete", color: "#6bdcff" },
    { t: "09:12:17", text: "Intensity spike detected", color: "#ff7b7b" },
    { t: "09:12:32", text: "Beam focus adjusted", color: "#b59bff" },
    { t: "09:12:50", text: "Diagnostics OK", color: "#8cffb6" },
  ]);
  const [terminalLines, setTerminalLines] = useState([
    "// Initializing Beam Core...",
    'const beam = new BeamSystem({ frequency: "2.4", intensity: "high", status: "active" });',
    'beam.connect("focus-array");',
    "beam.calibrate();",
    'console.log("%c[Beam Ready] →", "color:#6bdcff;", beam.status);',
  ]);

  // refs
  const beamCoreRef = useRef(null);
  const beamVisualRef = useRef(null);
  const holoRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const terminalRef = useRef(null);

  // render events helper (escape)
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );

  // apply visuals (mirrors original apply())

  const apply = useCallback(() => {
    // background stars amount -> change root CSS background gradients
    document.documentElement.style.setProperty(
      "--bg-custom",
      `radial-gradient(1200px 600px at 10% 10%, rgba(107,220,255,${clamp(
        bg / 200,
        0,
        1
      )}), transparent 8%), radial-gradient(800px 400px at 90% 85%, rgba(155,107,255,${clamp(
        bg / 220,
        0,
        1
      )}), transparent 8%), #05040a`
    );

    // amount -> scale
    const scale = 0.6 + amount / 200;
    if (beamCoreRef.current)
      beamCoreRef.current.style.setProperty("--beam-scale", String(scale));

    // opacity -> beamCore opacity
    if (beamCoreRef.current)
      beamCoreRef.current.style.opacity = String(clamp(opacity / 100, 0, 1));

    // intensity -> beam glow strength
    const intensityVal = clamp(intensity / 100, 0, 2);
    document.documentElement.style.setProperty(
      "--beam-intensity",
      String(intensityVal)
    );
    if (beamCoreRef.current) {
      beamCoreRef.current.style.boxShadow = `0 0 ${
        40 + intensityVal * 120
      }px rgba(155,107,255,${0.18 * intensityVal}), 0 0 ${
        20 + intensityVal * 60
      }px rgba(107,220,255,${0.06 * intensityVal})`;
      beamCoreRef.current.style.filter = `blur(calc(var(--beam-blur, 10px)))`;
    }

    // glow pulse
    if (beamVisualRef.current) {
      if (glow) beamVisualRef.current.classList.add(styles.glowPulse);
      else beamVisualRef.current.classList.remove(styles.glowPulse);
    }

    // holo
    if (holoRef.current) {
      holoRef.current.style.opacity = holoOn ? "0.12" : "0.02";
      holoRef.current.setAttribute("aria-hidden", String(!holoOn));
    }
  }, [bg, amount, opacity, intensity, glow, holoOn]);
  useEffect(() => {
    apply();

    const msg = `> Light:${Math.round(amount)} Intensity:${Math.round(
      (intensity / 200) * 100
    )}%`;
    setTerminalLines((t) => [...t, msg].slice(-80));
  }, [bg, amount, opacity, intensity, glow, holoOn, apply]);

  // demo: push new events every 9s when live (matches original)
  useEffect(() => {
    if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    demoIntervalRef.current = setInterval(() => {
      if (!live) return;
      const now = new Date();
      const t = now.toTimeString().slice(0, 8);
      const msgs = [
        "Beam stabilized",
        "Micro-tweak applied",
        "Temp nominal",
        "Adaptive focus engaged",
        "Signal nominal",
      ];
      const colorPool = ["#6bdcff", "#b59bff", "#8cffb6", "#ffb86b", "#ff7b7b"];
      const color = colorPool[Math.floor(Math.random() * colorPool.length)];
      const text = msgs[Math.floor(Math.random() * msgs.length)];
      setEvents((prev) => {
        const next = [{ t, text, color }, ...prev];
        next.splice(6);
        return next;
      });
      setTerminalLines((t) => {
        const next = [
          ...t,
          `[${t.length}] ${t.length ? "log" : "init"} - ${text}`,
        ];
        return next.slice(-80);
      });
    }, 9000);

    return () => {
      clearInterval(demoIntervalRef.current);
    };
  }, [live]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(demoIntervalRef.current);
    };
  }, []);

  // reset handler
  const handleReset = () => {
    setBg(8);
    setAmount(60);
    setOpacity(65);
    setIntensity(120);
    setLive(true);
    setSyncOn(false);
    setGlow(true);
    setHoloOn(false);
    setEvents([
      { t: "09:12:04", text: "Calibration complete", color: "#6bdcff" },
      { t: "09:12:17", text: "Intensity spike detected", color: "#ff7b7b" },
      { t: "09:12:32", text: "Beam focus adjusted", color: "#b59bff" },
      { t: "09:12:50", text: "Diagnostics OK", color: "#8cffb6" },
    ]);
    setTerminalLines((t) => [...t, "// reset to defaults"].slice(-80));
  };

  // export current snapshot (static)
  const handleExport = () => {
    if (typeof document === "undefined") return;
    const doc = document.documentElement.cloneNode(true);
    const scripts = doc.querySelectorAll("script");
    scripts.forEach((s) => s.remove());
    const html = "<!doctype html>\n" + doc.outerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sci-fi-dashboard.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ensure terminal auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines, events]);

  return (
    <div className={styles.wrapper} style={{ background: "var(--bg-custom)" }}>
      <div className={styles.stars} aria-hidden="true" />
      <div
        className={styles.canvas}
        role="application"
        aria-label="Sci-Fi dashboard"
      >
        <div
          className={`${styles.panel} ${styles.left}`}
          aria-labelledby="controlsHeading"
        >
          <div className={styles.headerRow}>
            <div>
              <h1 id="controlsHeading" className={styles.title}>
                Controls
              </h1>
              <div className={styles.muted}>Tweak the UI & beam parameters</div>
            </div>
            <div className={styles.muted}>v1.0</div>
          </div>

          <div className={styles.control}>
            <div className={styles.label}>
              <span className={styles.glow}>Background</span>
            </div>
            <div className={styles.rangeWrap}>
              <input
                className={styles.range}
                id="bgRange"
                type="range"
                min="0"
                max="100"
                value={bg}
                onChange={(e) => setBg(Number(e.target.value))}
                aria-label="Background amount"
              />
            </div>
            <input
              className={styles.numeric}
              id="bgNum"
              type="number"
              min="0"
              max="100"
              value={bg}
              onChange={(e) => setBg(Number(e.target.value))}
            />
          </div>

          <div className={styles.control}>
            <div className={styles.label}>
              <span className={styles.glow}>Amount</span>
            </div>
            <div className={styles.rangeWrap}>
              <input
                className={styles.range}
                id="amountRange"
                type="range"
                min="0"
                max="200"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                aria-label="Amount"
              />
            </div>
            <input
              className={styles.numeric}
              id="amountNum"
              type="number"
              min="0"
              max="200"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className={styles.control}>
            <div className={styles.label}>
              <span className={styles.glow}>Opacity</span>
            </div>
            <div className={styles.rangeWrap}>
              <input
                className={styles.range}
                id="opacityRange"
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                aria-label="Opacity"
              />
            </div>
            <input
              className={styles.numeric}
              id="opacityNum"
              type="number"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </div>

          <div className={styles.control}>
            <div className={styles.label}>
              <span className={styles.glow}>Intensity</span>
            </div>
            <div className={styles.rangeWrap}>
              <input
                className={styles.range}
                id="intensityRange"
                type="range"
                min="0"
                max="200"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                aria-label="Intensity"
              />
            </div>
            <input
              className={styles.numeric}
              id="intensityNum"
              type="number"
              min="0"
              max="200"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
          </div>

          <div className={styles.rowControls}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className={styles.control}>
                <div className={styles.label}>Live</div>
                <div
                  role="switch"
                  tabIndex={0}
                  aria-checked={live}
                  onClick={() => setLive((s) => !s)}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " "
                      ? setLive((s) => !s)
                      : null
                  }
                  className={`${styles.toggle} ${live ? styles.on : ""}`}
                >
                  <div className={styles.knob} />
                </div>
              </div>

              <div className={styles.control}>
                <div className={styles.label}>Auto-Sync</div>
                <div
                  role="switch"
                  tabIndex={0}
                  aria-checked={syncOn}
                  onClick={() => setSyncOn((s) => !s)}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " "
                      ? setSyncOn((s) => !s)
                      : null
                  }
                  className={`${styles.toggle} ${syncOn ? styles.on : ""}`}
                >
                  <div className={styles.knob} />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "flex-end",
              }}
            >
              <div className={styles.control}>
                <div className={styles.label}>Glow</div>
                <div
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={glow}
                  onClick={() => setGlow((s) => !s)}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " "
                      ? setGlow((s) => !s)
                      : null
                  }
                  className={`${styles.checkbox} ${glow ? styles.checked : ""}`}
                />
              </div>
              <div className={styles.control}>
                <div className={styles.label}>Holo</div>
                <div
                  role="checkbox"
                  tabIndex={0}
                  aria-checked={holoOn}
                  onClick={() => setHoloOn((s) => !s)}
                  onKeyDown={(e) =>
                    e.key === "Enter" || e.key === " "
                      ? setHoloOn((s) => !s)
                      : null
                  }
                  className={`${styles.checkbox} ${
                    holoOn ? styles.checked : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={styles.controlsActions}>
            <button
              id="exportBtn"
              className={`${styles.btn} ${styles.primary}`}
              title="Reset to defaults"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        <div
          className={`${styles.panel} ${styles.right}`}
          aria-labelledby="beamHeading"
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div className={styles.beamHeader}>
                <div>
                  <div id="beamHeading" className={styles.beamTitle}>
                    Beam
                  </div>
                  <div className={styles.muted}>
                    Event log & live visualization
                  </div>
                </div>
                <div className={styles.muted}>
                  Status:{" "}
                  <strong id="statusText">{live ? "Online" : "Standby"}</strong>
                </div>
              </div>

              <div className={styles.beamCard} style={{ marginTop: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className={styles.brandBox}>B</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>Beam 01 — Focus Array</div>
                    <div className={styles.muted}>
                      Core intensity & diagnostics
                    </div>
                  </div>
                  <div className={styles.muted}>2.4s</div>
                </div>

                <div
                  className={styles.events}
                  id="events"
                  aria-live="polite"
                  aria-atomic="false"
                  style={{ marginTop: 12 }}
                >
                  {events.map((e, i) => (
                    <div
                      className={styles.event}
                      key={i}
                      style={{ borderLeftColor: e.color }}
                    >
                      <div
                        className={styles.dot}
                        style={{ background: e.color }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          className={styles.meta}
                          dangerouslySetInnerHTML={{
                            __html: escapeHtml(e.text),
                          }}
                        />
                        <div className={styles.time}>{e.t}</div>
                      </div>
                      <div className={styles.muted}>#{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{ marginTop: 14 }}
                className={styles.preview}
                aria-hidden="false"
              >
                <div
                  className={styles.beamVisual}
                  id="beamVisual"
                  ref={beamVisualRef}
                  aria-hidden="true"
                >
                  <div
                    className={styles.beamCore}
                    id="beamCore"
                    ref={beamCoreRef}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.panel} ${styles.bottom} ${styles.codingTerminal}`}
          aria-label="Terminal logs"
        >
          <div className={styles.terminalHeader}>
            <div className={`${styles.dot} ${styles.red}`} />
            <div className={`${styles.dot} ${styles.yellow}`} />
            <div className={`${styles.dot} ${styles.green}`} />
            <span className={styles.termTitle}>beam_Logs.js</span>
          </div>

          <div
            className={styles.terminalBody}
            id="terminalBody"
            role="log"
            aria-live="polite"
            ref={terminalRef}
          >
            <code className={styles.typed}>
              {terminalLines.map((line, idx) => (
                <div key={idx} style={{ marginBottom: 4 }}>
                  <span className={styles.comment}>{line}</span>
                </div>
              ))}
            </code>
          </div>
        </div>

        <div
          className={styles.holo}
          id="holo"
          ref={holoRef}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
