import { Suspense, lazy, useEffect, useRef, useState } from "react";
import AboutNoru from "./AboutNoru";

const Spline = lazy(() => import("@splinetool/react-spline"));

const shouldUseLightweightScene = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
  const hasLimitedCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  return (
    connection?.saveData ||
    hasLimitedMemory ||
    hasLimitedCpu ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

const teamMembers = [
  { number: "01", initials: "IN", name: "Integrante 01", role: "UX / UI Design" },
  { number: "02", initials: "IN", name: "Integrante 02", role: "Desenvolvimento" },
  { number: "03", initials: "IN", name: "Integrante 03", role: "Pesquisa & Dados" },
  { number: "04", initials: "IN", name: "Integrante 04", role: "Produto & Estratégia" },
];

const readPreference = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const savePreference = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A interface continua funcionando mesmo com o armazenamento bloqueado.
  }
};

export default function Hero3D() {
  const sceneContainerRef = useRef(null);
  const splineRef = useRef(null);
  const heroTitleRef = useRef(null);
  const modalCloseRef = useRef(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => readPreference("noru-theme", "light") !== "dark");
  const [fontScale, setFontScale] = useState(() => {
    const savedScale = Number(readPreference("noru-font-scale", "100"));
    return Number.isFinite(savedScale) && savedScale >= 90 && savedScale <= 130 ? savedScale : 100;
  });
  const [isVlibrasEnabled, setIsVlibrasEnabled] = useState(false);
  const [shouldLoadScene, setShouldLoadScene] = useState(false);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);

  useEffect(() => {
    if (shouldUseLightweightScene()) return undefined;

    const loadScene = () => setShouldLoadScene(true);
    const idleId = "requestIdleCallback" in window
      ? window.requestIdleCallback(loadScene, { timeout: 2500 })
      : window.setTimeout(loadScene, 1200);

    return () => {
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const title = heroTitleRef.current;
    if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frameId;
    const updateTitle = () => {
      const progress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.15);
      title.style.setProperty("--title-drop", `${progress * 92}vh`);
      title.style.setProperty("--title-opacity", String(Math.max(0, 1 - progress * 0.9)));
      frameId = undefined;
    };
    const handleScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateTitle);
    };

    updateTitle();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = isLightMode ? "light" : "dark";
    savePreference("noru-theme", isLightMode ? "light" : "dark");
  }, [isLightMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    document.documentElement.dataset.fontScale = fontScale > 100 ? "large" : fontScale < 100 ? "small" : "default";
    savePreference("noru-font-scale", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    const container = sceneContainerRef.current;
    if (!container) return undefined;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
    };

    container.addEventListener("wheel", handleWheel, {
      capture: true,
      passive: false,
    });

    return () => container.removeEventListener("wheel", handleWheel, true);
  }, []);

  useEffect(() => {
    if (!isAccessibilityOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsAccessibilityOpen(false);
    };

    modalCloseRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAccessibilityOpen]);

  useEffect(() => {
    const container = sceneContainerRef.current;
    if (!container || !shouldLoadScene) return undefined;

    let isVisible = true;
    const updatePlayback = () => {
      if (!splineRef.current) return;
      if (document.hidden || !isVisible) splineRef.current.stop?.();
      else splineRef.current.play?.();
    };
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.05 });

    observer.observe(container);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, [shouldLoadScene]);

  const handleSplineLoad = (spline) => {
    splineRef.current = spline;
    spline.setBackgroundColor?.("transparent");
    setIsSceneLoaded(true);
  };

  const enableVlibras = () => {
    if (window.VLibras) {
      setIsVlibrasEnabled(true);
      return;
    }

    if (!document.querySelector('script[data-vlibras]')) {
      const script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.dataset.vlibras = "true";
      script.onload = () => {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        setIsVlibrasEnabled(true);
      };
      document.body.appendChild(script);
    }
  };

  return (
    <main>
      <section className="hero" aria-label="NORU">
        <nav className="hero__nav" aria-label="Navegação principal">
          <button type="button" className="hero__nav-item" onClick={() => setIsAccessibilityOpen(true)}>
            ACESSIBILIDADE
          </button>
          <a className="hero__nav-item" href="#sobre">SOBRE</a>
          <a className="hero__nav-item" href="#integrantes">INTEGRANTES</a>
        </nav>

        <h1 ref={heroTitleRef} className="hero__title">NORU</h1>
        <p className="hero__tagline">SEU NOVO PARCEIRO DE EMPREGO</p>
        <div className="hero__level-badge" aria-label="Nível 1, zero XP">
          <span>NÍVEL 1</span>
          <strong>0 XP</strong>
        </div>

        <div ref={sceneContainerRef} className="hero__art" aria-label="Animação 3D interativa">
          <div className="hero__scene">
            <div className={`hero__scene-fallback ${isSceneLoaded ? "hero__scene-fallback--hidden" : ""}`} aria-hidden="true"><span /><span /><span /></div>
            {shouldLoadScene && (
              <Suspense fallback={null}>
                <Spline
                  scene="/scene.splinecode"
                  onLoad={handleSplineLoad}
                  renderOnDemand
                />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      <AboutNoru />
      <section id="integrantes" className="team-section" aria-labelledby="team-title">
        <div className="team-section__heading">
          <div>
            <span className="team-section__eyebrow">ZERODAY PIGEON • 2026</span>
            <h2 id="team-title">Quem faz<br /><em>acontecer.</em></h2>
          </div>
          <p>Quatro pessoas, diferentes habilidades e um objetivo em comum: transformar a jornada profissional.</p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.number}>
              <div className="team-card__portrait" aria-label={`Espaço para foto de ${member.name}`}>
                <span>{member.initials}</span>
                <small>SUA FOTO</small>
              </div>
              <div className="team-card__info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <div className="team-card__links" aria-label={`Redes sociais de ${member.name}`}>
                  <span>GITHUB</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {isAccessibilityOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsAccessibilityOpen(false)}>
          <section
            className="accessibility-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Acessibilidade"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="accessibility-modal__header">
              <span className="accessibility-modal__eyebrow">PREFERÊNCIAS</span>
              <h2>Acessibilidade</h2>
              <p>Personalize sua experiência no NORU.</p>
            </header>
            <button
              ref={modalCloseRef}
              type="button"
              className="accessibility-modal__close"
              aria-label="Fechar modal de acessibilidade"
              onClick={() => setIsAccessibilityOpen(false)}
            >
              ×
            </button>

            <div className="accessibility-modal__options">
              <div className="accessibility-option">
                <div><strong>Modo claro</strong><span>Alterne as cores da interface</span></div>
                <button type="button" className={`toggle ${isLightMode ? "toggle--active" : ""}`} role="switch" aria-checked={isLightMode} aria-label="Ativar modo claro" onClick={() => setIsLightMode((value) => !value)}><span /></button>
              </div>

              <div className="accessibility-option">
                <div><strong>VLibras</strong><span>Tradução de conteúdo para Libras</span></div>
                <button type="button" className="accessibility-action" onClick={enableVlibras} disabled={isVlibrasEnabled}>{isVlibrasEnabled ? "ATIVADO" : "ATIVAR"}</button>
              </div>

              <div className="accessibility-option accessibility-option--font">
                <div><strong>Tamanho da fonte</strong><span>Ajuste os textos da página</span></div>
                <div className="font-controls" aria-label="Tamanho da fonte">
                  <button type="button" aria-label="Diminuir fonte" onClick={() => setFontScale((value) => Math.max(90, value - 10))} disabled={fontScale === 90}>A−</button>
                  <output aria-live="polite">{fontScale}%</output>
                  <button type="button" aria-label="Aumentar fonte" onClick={() => setFontScale((value) => Math.min(130, value + 10))} disabled={fontScale === 130}>A+</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      <div vw="true" className="enabled" style={{ display: isVlibrasEnabled ? undefined : "none" }}>
        <div vw-access-button="true" className="active" />
        <div vw-plugin-wrapper="true"><div className="vw-plugin-top-wrapper" /></div>
      </div>
    </main>
  );
}
