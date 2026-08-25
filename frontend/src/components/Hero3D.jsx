import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import AboutNoru from "./AboutNoru";
import PhonePrototype from "./PhonePrototype";

const Spline = lazy(() => import("@splinetool/react-spline"));

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Falha isolada na cena 3D do NORU:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function VLibrasWidget() {
  useEffect(() => {
    let cancelled = false;

    const initialize = () => {
      if (cancelled || !window.VLibras || window.__noruVLibrasInitialized) return;
      new window.VLibras.Widget("https://vlibras.gov.br/app");
      window.__noruVLibrasInitialized = true;
      if (typeof window.onload === "function") window.onload();
    };

    if (window.VLibras) {
      initialize();
      return () => { cancelled = true; };
    }

    let script = document.querySelector('script[data-noru-vlibras]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
      script.async = true;
      script.dataset.noruVlibras = "true";
      document.body.appendChild(script);
    }
    script.addEventListener("load", initialize);

    return () => {
      cancelled = true;
      script.removeEventListener("load", initialize);
    };
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active" />
      <div vw-plugin-wrapper="true"><div className="vw-plugin-top-wrapper" /></div>
    </div>
  );
}

const teamMembers = [
  { number: "01", name: "Livia Karoliny", role: "UX/UI & Desenvolvimento", photo: "/team/1.jpeg" },
  { number: "02", name: "Yago Nascimento", role: "Organização & Planejamento", photo: "/team/2.jpeg" },
  { number: "03", name: "Alewesley Sousa", role: "Pesquisa & Estruturação", photo: "/team/3.jpeg" },
  { number: "04", name: "Maria Eduarda", role: "Conteúdo & Comunicação", photo: "/team/4.jpeg" },
];

const projectLinks = {
  figma: "https://www.figma.com/proto/FUvvXp5FI5S4DqD0OkGlq6/Sem-t%C3%ADtulo?node-id=0-1&t=k8MpPoEXxRnQyFLp-1",
  youtube: "", // Use o formato https://www.youtube.com/embed/ID_DO_VIDEO
};

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
  const [isDarkMode, setIsDarkMode] = useState(() => readPreference("noru-theme", "light") === "dark");
  const [fontScale, setFontScale] = useState(() => {
    const savedScale = Number(readPreference("noru-font-scale", "100"));
    return Number.isFinite(savedScale) && savedScale >= 90 && savedScale <= 130 ? savedScale : 100;
  });
  const [isVlibrasEnabled, setIsVlibrasEnabled] = useState(false);

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
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    savePreference("noru-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
    if (!container) return undefined;

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
  }, []);

  const handleSplineLoad = (spline) => {
    splineRef.current = spline;
    spline.setBackgroundColor?.("transparent");
    spline.play?.();
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
            <SceneErrorBoundary>
              <Suspense fallback={null}>
                <Spline
                  scene="/scene.splinecode"
                  onLoad={handleSplineLoad}
                />
              </Suspense>
            </SceneErrorBoundary>
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
              <div className="team-card__portrait">
                <img src={member.photo} alt={`Foto de ${member.name}`} loading="lazy" decoding="async" />
              </div>
              <div className="team-card__info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="project-links" aria-labelledby="project-links-title">
        <header className="project-links__heading">
          <span className="project-links__eyebrow">DO CONCEITO À EXPERIÊNCIA</span>
          <h2 id="project-links-title">Veja o projeto<br /><em>ganhar vida.</em></h2>
          <p>Explore cada detalhe do protótipo e conheça a história por trás do NORU.</p>
        </header>

        <div className="project-links__grid">
          <article className="project-link-card project-link-card--figma">
            <div className="project-link-card__topline">
              <span>PROTÓTIPO</span>
              <strong>FIGMA ↗</strong>
            </div>
            <div className="project-phone-preview" inert="" aria-label="Prévia estática do aplicativo NORU">
              <PhonePrototype />
            </div>
            <div className="project-link-card__copy">
              <div><h3>Protótipo navegável</h3><p>Conheça os fluxos, telas e decisões de experiência que deram forma ao aplicativo.</p></div>
              {projectLinks.figma ? <a href={projectLinks.figma} target="_blank" rel="noreferrer">ABRIR NO FIGMA <span>↗</span></a> : <span className="project-link-card__placeholder">LINK DO FIGMA EM BREVE</span>}
            </div>
          </article>

          <article className="project-link-card project-link-card--youtube">
            <div className="project-link-card__topline">
              <span>APRESENTAÇÃO</span>
              <strong>YOUTUBE ▶</strong>
            </div>
            <div className="video-preview">
              {projectLinks.youtube ? (
                <iframe
                  src={projectLinks.youtube}
                  title="Pitch oficial do NORU"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="video-preview__empty">
                  <div className="video-preview__brand" aria-hidden="true">NORU</div>
                  <div className="video-preview__play" aria-hidden="true">▶</div>
                  <span>O PLAYER DO PITCH APARECERÁ AQUI</span>
                </div>
              )}
            </div>
            <div className="project-link-card__copy">
              <div><h3>Assista ao pitch</h3><p>Em poucos minutos, entenda o problema, a solução e o impacto que queremos construir.</p></div>
              {projectLinks.youtube ? <a href={projectLinks.youtube} target="_blank" rel="noreferrer">ASSISTIR NO YOUTUBE <span>▶</span></a> : <span className="project-link-card__placeholder">PITCH EM BREVE</span>}
            </div>
          </article>
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
                <div><strong>Modo escuro</strong><span>Reduza a luminosidade da interface</span></div>
                <button type="button" className={`toggle ${isDarkMode ? "toggle--active" : ""}`} role="switch" aria-checked={isDarkMode} aria-label="Ativar modo escuro" onClick={() => setIsDarkMode((value) => !value)}><span /></button>
              </div>

              <div className="accessibility-option">
                <div><strong>VLibras</strong><span>Tradução de conteúdo para Libras</span></div>
                <button type="button" className="accessibility-action" onClick={() => { setIsVlibrasEnabled(true); setIsAccessibilityOpen(false); }} disabled={isVlibrasEnabled}>{isVlibrasEnabled ? "ATIVADO" : "ATIVAR"}</button>
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

      {isVlibrasEnabled && <VLibrasWidget />}
    </main>
  );
}
