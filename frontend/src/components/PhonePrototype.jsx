import { useState } from "react";

const interests = ["Tecnologia", "Design", "Comunicação", "Negócios"];
const pageContent = {
  cursos: ["Primeiros passos em UX", "Lógica de programação", "Comunicação profissional"],
  oficinas: ["Currículo que se destaca", "Como se sair bem na entrevista", "Monte seu portfólio"],
  vagas: ["Estágio em Produto", "Jovem Aprendiz em Tech", "Assistente de Marketing"],
};
const jobs = [
  { company: "NUBANK", mode: "REMOTO", title: "Estágio em Produto", type: "ESTÁGIO", xp: "+300 XP", description: "Participe de projetos reais enquanto desenvolve pesquisa, comunicação e resolução de problemas." },
  { company: "ORANGE LAB", mode: "HÍBRIDO", title: "Jovem Aprendiz em Tech", type: "APRENDIZ", xp: "+250 XP", description: "Aprenda fundamentos de tecnologia com acompanhamento de mentores e participação em desafios práticos." },
  { company: "NOVA CO", mode: "REMOTO", title: "Assistente de Marketing", type: "JÚNIOR", xp: "+280 XP", description: "Ajude a criar campanhas digitais, organizar conteúdos e acompanhar resultados ao lado do time de marketing." },
];

function NoruFace({ small = false }) {
  return <span className={`phone-noru ${small ? "phone-noru--small" : ""}`} aria-label="Noru"><i /><i /></span>;
}

function ScreenHead({ title, onBack }) {
  return <div className="app-screen-head app-screen-head--page"><button type="button" onClick={onBack}>←</button><strong>{title}</strong><span>•••</span></div>;
}

export default function PhonePrototype() {
  const [screen, setScreen] = useState("login");
  const [selectedInterest, setSelectedInterest] = useState("Tecnologia");
  const [savedJob, setSavedJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [vlibrasNotice, setVlibrasNotice] = useState(false);
  const [gamificationEnabled, setGamificationEnabled] = useState(true);
  const openPage = (page) => setScreen(page);

  const bottomNav = <nav className="app-bottom-nav">
    <button className={screen === "home" ? "active" : ""} onClick={() => openPage("home")}>⌂<small>INÍCIO</small></button>
    <button className={["cursos", "oficinas"].includes(screen) ? "active" : ""} onClick={() => openPage("cursos")}>▶<small>APRENDER</small></button>
    <button className={screen === "vagas" ? "active" : ""} onClick={() => openPage("vagas")}>⌁<small>VAGAS</small></button>
    <button className={screen === "userProfile" ? "active" : ""} onClick={() => openPage("userProfile")}>●<small>PERFIL</small></button>
  </nav>;

  return <div className="phone-prototype">
    <div className="phone-prototype__label"><span>●</span> PROTÓTIPO INTERATIVO</div>
    <div className={`phone-shell ${darkMode ? "phone-shell--dark" : ""} ${largeFont ? "phone-shell--large-text" : ""}`}><div className="phone-shell__speaker" /><div className="phone-screen">
      <div className="phone-status"><span>9:41</span><span>● ◒ ▰</span></div>

      {screen === "login" && <section className="app-login">
        <NoruFace /><span className="app-eyebrow">BEM-VINDO AO</span><h3>NORU</h3><p>Seu próximo passo começa aqui.</p>
        <label>E-MAIL<input value="jovem@noru.app" readOnly /></label><label>SENHA<input value="••••••••" readOnly /></label>
        <button onClick={() => openPage("home")}>ENTRAR →</button><button className="app-text-button" onClick={() => openPage("signup")}>CRIAR MINHA CONTA</button>
      </section>}

      {screen === "signup" && <section className="app-profile">
        <div className="app-screen-head"><button onClick={() => openPage("login")}>←</button><span>1 DE 2</span></div><span className="app-eyebrow">CRIE SUA CONTA</span><h3>Prazer em<br />conhecer você.</h3><p>Essas informações serão usadas para montar seu perfil profissional.</p>
        <label className="app-field">NOME COMPLETO<input value="Marina Alves" readOnly /></label><label className="app-field">PROFISSÃO DESEJADA<input value="Designer de Produto" readOnly /></label><label className="app-field">TIPO DE OPORTUNIDADE<input value="Estágio ou freelancer" readOnly /></label><button className="app-primary" onClick={() => openPage("onboarding")}>CONTINUAR →</button>
      </section>}

      {screen === "onboarding" && <section className="app-profile">
        <div className="app-screen-head"><button onClick={() => openPage("signup")}>←</button><span>2 DE 2</span></div><span className="app-eyebrow">VAMOS PERSONALIZAR</span><h3>O que combina<br />com você?</h3><p>Escolha uma área para o Noru criar sua primeira trilha.</p>
        <div className="app-interest-grid">{interests.map((interest) => <button className={selectedInterest === interest ? "active" : ""} key={interest} onClick={() => setSelectedInterest(interest)}>{interest}</button>)}</div><div className="app-difficulty"><span>MAIOR DIFICULDADE</span><strong>Conseguir a primeira experiência⌄</strong></div><button className="app-primary" onClick={() => openPage("home")}>MONTAR MEU PERFIL →</button>
      </section>}

      {screen === "home" && <section className="app-home">
        <header><div><small>OLÁ, MARINA!</small><strong>Sua jornada</strong></div>{gamificationEnabled && <button className="app-level" aria-label="Nível 1" onClick={() => openPage("ranking")}>1</button>}</header>
        <div className="app-noru-card"><NoruFace small /><div><small>NORU IA</small><p>Preparei três passos para você começar hoje.</p><button onClick={() => openPage("assistant")}>CONVERSAR COM O NORU →</button></div></div><div className="app-progress"><span><b>SEU PROGRESSO</b><small>250 / 1.000 XP</small></span><div><i /></div></div>
        <h4>EXPLORE O NORU</h4><div className="app-shortcuts app-shortcuts--four"><button className={!gamificationEnabled ? "is-disabled" : ""} onClick={() => gamificationEnabled ? openPage("ranking") : openPage("userProfile")}>↗<span>{gamificationEnabled ? "RANKING" : "RANKING DESATIVADO"}</span></button><button onClick={() => openPage("oficinas")}>✦<span>OFICINAS</span></button><button onClick={() => openPage("cursos")}>▶<span>CURSOS</span></button><button onClick={() => openPage("vagas")}>⌁<span>EMPRESAS</span></button></div>{bottomNav}
      </section>}

      {screen === "assistant" && <section className="app-page app-assistant"><ScreenHead title="Noru IA" onBack={() => openPage("home")} /><div className="app-assistant__hero"><NoruFace /><h3>Como posso<br />ajudar hoje?</h3></div><div className="app-ai-message">Oi, Marina! Podemos preparar seu currículo ou praticar uma entrevista.</div><button>SIMULAR ENTREVISTA</button><button>REVISAR MEU PERFIL</button><button>FAZER TESTE VOCACIONAL</button><div className="app-chat-input">Digite sua dúvida... <span>↑</span></div></section>}

      {screen === "ranking" && <section className="app-page app-ranking"><ScreenHead title="Ranking" onBack={() => openPage("home")} /><span className="app-eyebrow">SUA EVOLUÇÃO</span><h3>Você está<br />subindo!</h3><div className="app-rank-card"><small>SUA POSIÇÃO</small><strong>#18</strong><span>NÍVEL 01 · 250 XP</span></div><div className="app-ranking-list">{[["#17", "Marina", "280 XP"], ["#18", "Você", "250 XP"], ["#19", "Caio", "220 XP"]].map((row) => <div className={row[1] === "Você" ? "active" : ""} key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><small>{row[2]}</small></div>)}</div>{bottomNav}</section>}

      {["cursos", "oficinas", "vagas"].includes(screen) && <section className="app-home app-page-list"><ScreenHead title={screen === "cursos" ? "Cursos" : screen === "oficinas" ? "Oficinas" : "Empresas"} onBack={() => openPage("home")} /><span className="app-eyebrow">RECOMENDADO PARA VOCÊ</span><h3>{screen === "cursos" ? "Aprenda no seu ritmo" : screen === "oficinas" ? "Pratique de verdade" : "Encontre sua vaga"}</h3><div className="app-list">{pageContent[screen].map((title, index) => <article key={title}><div><small>{screen === "vagas" ? `${jobs[index].company} · ${jobs[index].mode}` : `${30 + index * 15} MIN · +${80 + index * 20} XP`}</small><strong>{title}</strong></div><button onClick={() => { if (screen === "vagas") { setSelectedJob(index); setSavedJob(false); openPage("job"); } }}>→</button></article>)}</div>{bottomNav}</section>}

      {screen === "job" && <section className="app-page app-job"><ScreenHead title="Detalhes da vaga" onBack={() => openPage("vagas")} /><span className="app-eyebrow">{jobs[selectedJob].company} · {jobs[selectedJob].mode}</span><h3>{jobs[selectedJob].title}</h3><div className="app-job-tags"><span>{jobs[selectedJob].type}</span><span>{jobs[selectedJob].mode}</span><span>{jobs[selectedJob].xp}</span></div><p>{jobs[selectedJob].description}</p><h4>ANTES DE SE CANDIDATAR</h4><div className="app-job-step">✓ Material preparatório</div><div className="app-job-step">02 Desafio prático</div><div className="app-job-step">03 Entrevista</div><button className="app-primary" onClick={() => setSavedJob(!savedJob)}>{savedJob ? "VAGA SALVA ✓" : "QUERO PARTICIPAR →"}</button></section>}

      {screen === "userProfile" && <section className="app-page app-user-profile"><ScreenHead title="Meu perfil" onBack={() => openPage("home")} /><div className="app-profile-avatar">MA</div><h3>Marina Alves</h3><p>Designer de Produto em formação</p>{gamificationEnabled && <div className="app-profile-level"><b>NÍVEL 01</b><span>250 XP</span></div>}<h4>HABILIDADES</h4><div className="app-skill-tags"><span>FIGMA</span><span>COMUNICAÇÃO</span><span>UX</span><button>+ ADICIONAR</button></div><h4>PREFERÊNCIAS</h4><button className="app-setting" onClick={() => setGamificationEnabled(!gamificationEnabled)}><span>Gamificação e ranking</span><i className={gamificationEnabled ? "active" : ""} /></button><p className="app-ranking-privacy">O ranking é pessoal. Empresas não veem sua posição, e ativar ou desativar a gamificação não afeta suas chances de conseguir um emprego.</p><h4>ACESSIBILIDADE</h4><button className="app-setting" onClick={() => setDarkMode(!darkMode)}><span>Modo escuro</span><i className={darkMode ? "active" : ""} /></button><button className="app-setting" onClick={() => setLargeFont(!largeFont)}><span>Aumentar fonte</span><i className={largeFont ? "active" : ""} /></button><button className="app-setting" onClick={() => setVlibrasNotice(true)}><span>VLibras</span><i /></button>{vlibrasNotice && <div className="app-notice" role="status"><span>VLibras ainda não está implementado neste protótipo.</span><button onClick={() => setVlibrasNotice(false)}>×</button></div>}{bottomNav}</section>}
    </div></div>
    <div className="phone-prototype__steps"><button className={screen === "login" ? "active" : ""} onClick={() => openPage("login")}>LOGIN</button><button className={["signup", "onboarding"].includes(screen) ? "active" : ""} onClick={() => openPage("signup")}>CADASTRO</button><button className={!["login", "signup", "onboarding"].includes(screen) ? "active" : ""} onClick={() => openPage("home")}>APP</button></div>
  </div>;
}
