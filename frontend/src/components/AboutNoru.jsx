import { useRef, useState } from "react";
import PhonePrototype from "./PhonePrototype";

const overviewItems = [
  {
    label: "01 / RESUMO",
    title: "Carreira sem complicação.",
    text: "O NORU é uma plataforma profissional feita para aproximar jovens, oportunidades e aprendizado em uma experiência simples, segura e mais humana.",
  },
  {
    label: "02 / PERGUNTA NORTEADORA",
    title: "E se começar fosse mais fácil?",
    text: "Como podemos ajudar jovens a descobrir seus caminhos, desenvolver habilidades e chegar preparados às empresas certas?",
  },
  {
    label: "03 / OBJETIVO",
    title: "Potencial em movimento.",
    text: "Dar direção para quem está começando e criar uma ponte confiável entre talentos em formação e empresas que procuram novas perspectivas.",
  },
];

const journey = [
  { number: "01", title: "Entrar", text: "Login rápido e uma recepção clara para quem já faz parte ou está chegando agora." },
  { number: "02", title: "Criar seu perfil", text: "Objetivos, interesses, habilidades, dificuldades e preferências ajudam a personalizar toda a jornada." },
  { number: "03", title: "Conhecer o Noru", text: "A IA apresenta o aplicativo, responde dúvidas e apoia decisões profissionais de forma personalizada." },
  { number: "04", title: "Evoluir", text: "Cursos, oficinas, desafios e processos seletivos geram experiência e mostram o seu progresso." },
  { number: "05", title: "Encontrar", text: "O NORU aproxima cada jovem de empresas e vagas compatíveis com seu nível e suas preferências." },
];

const features = [
  { icon: "↗", title: "Ranking", text: "Acompanhe sua evolução, conquistas e posição dentro da comunidade." },
  { icon: "✦", title: "Oficinas", text: "Currículo, entrevista e habilidades práticas para o início da carreira." },
  { icon: "▶", title: "Cursos", text: "Trilhas personalizadas por interesse, área e objetivo profissional." },
  { icon: "⌁", title: "Empresas", text: "Vagas com preparação, materiais de estudo e desafios reais." },
];

const quickReplies = {
  "Como melhorar meu currículo?": "Comece destacando resultados, mesmo de projetos pessoais ou escolares. Troque frases genéricas por exemplos do que você criou, aprendeu ou resolveu.",
  "Qual carreira combina comigo?": "Posso descobrir isso com você. Vamos cruzar seus interesses, habilidades e o tipo de rotina que você gostaria de ter em um teste vocacional rápido.",
  "Como me preparar para uma vaga?": "Eu posso analisar a descrição da vaga e montar um plano com conteúdos, desafios e perguntas que provavelmente aparecerão na entrevista.",
};

const interviewSteps = [
  {
    noru: "Vamos simular uma entrevista para uma vaga de estágio. Para começar: conte um pouco sobre você e por que se interessou por essa oportunidade.",
    options: ["Responder com um exemplo", "Preciso de uma dica"],
  },
  {
    noru: "Ótimo começo! Agora me conte sobre algum projeto seu — pode ser escolar, pessoal ou voluntário — e qual foi a sua contribuição.",
    options: ["Falar sobre meu projeto", "Ver uma resposta modelo"],
  },
  {
    noru: "Última pergunta: descreva uma dificuldade que você enfrentou e o que fez para resolvê-la.",
    options: ["Contar uma experiência", "Me ajude a estruturar"],
  },
  {
    noru: "Simulação concluída! Você demonstrou iniciativa. Minha dica é organizar as respostas em: situação, ação e resultado. Assim sua experiência fica mais clara e convincente.",
    options: ["Refazer entrevista", "Encerrar simulação"],
  },
];

const odsItems = [
  {
    number: "04",
    title: "Educação de qualidade",
    description: "Assegurar uma educação inclusiva, equitativa e de qualidade, promovendo oportunidades de aprendizagem ao longo da vida para todos.",
    relation: "O NORU amplia o acesso a cursos, oficinas e trilhas personalizadas. Jovens desenvolvem habilidades profissionais no próprio ritmo e encontram conteúdos compatíveis com seus interesses e necessidades.",
  },
  {
    number: "08",
    title: "Trabalho decente e crescimento econômico",
    description: "Promover o crescimento econômico sustentado, inclusivo e sustentável, o emprego pleno e produtivo e o trabalho decente para todos.",
    relation: "O NORU aproxima jovens de vagas confiáveis, preparação profissional e empresas interessadas em formar novos talentos, contribuindo para uma entrada mais segura e qualificada no mercado de trabalho.",
  },
  {
    number: "10",
    title: "Redução das desigualdades",
    description: "Reduzir as desigualdades dentro dos países e entre eles, ampliando oportunidades e promovendo inclusão social e econômica.",
    relation: "O NORU reduz barreiras de entrada ao oferecer orientação, acessibilidade e capacitação também para jovens sem experiência ou rede de contatos, valorizando potencial em vez de privilégios prévios.",
  },
];
const slideLabels = ["Resumo", "Jornada", "Recursos", "Conexão", "XP e níveis"];

export default function AboutNoru() {
  const [messages, setMessages] = useState([
    { author: "noru", text: "Oi! Eu sou o Noru. Posso tirar dúvidas, ajudar no seu perfil ou treinar uma entrevista com você." },
  ]);
  const [interviewStep, setInterviewStep] = useState(null);
  const [activeOds, setActiveOds] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(null);

  const changeSlide = (direction) => {
    setActiveSlide((current) => Math.min(slideLabels.length - 1, Math.max(0, current + direction)));
  };

  const askQuickQuestion = (question) => {
    setInterviewStep(null);
    setMessages([
      { author: "user", text: question },
      { author: "noru", text: quickReplies[question] },
    ]);
  };

  const startInterview = () => {
    setInterviewStep(0);
    setMessages([{ author: "noru", text: interviewSteps[0].noru }]);
  };

  const answerInterview = (answer) => {
    if (answer === "Encerrar simulação") {
      setInterviewStep(null);
      setMessages([{ author: "noru", text: "Treino encerrado. Quando quiser praticar novamente, estarei por aqui!" }]);
      return;
    }
    if (answer === "Refazer entrevista") {
      startInterview();
      return;
    }

    const nextStep = Math.min(interviewStep + 1, interviewSteps.length - 1);
    setMessages((current) => [
      ...current,
      { author: "user", text: answer },
      { author: "noru", text: interviewSteps[nextStep].noru },
    ]);
    setInterviewStep(nextStep);
  };

  return (
    <section id="sobre" className="about-noru" aria-labelledby="about-title">
      <header className="about-noru__intro">
        <div className="about-noru__pitch">
          <span className="about-noru__kicker">CARREIRA SEM COMPLICAÇÃO</span>
          <h2 id="about-title">Cansado do<br /><em>LinkedIn?</em></h2>
          <p className="about-noru__answer">Conheça o <strong>NORU.</strong></p>
          <p className="about-noru__description">Uma plataforma profissional feita para jovens aprenderem, criarem experiência e encontrarem oportunidades de um jeito simples, personalizado e confiável.</p>
          <div className="about-noru__benefits" aria-label="Principais benefícios do NORU">
            <span>APRENDA</span><span>EVOLUA</span><span>SEJA ENCONTRADO</span>
          </div>
        </div>
        <PhonePrototype />
        <span className="about-noru__scroll-note">ROLE PARA DESCOBRIR ↓</span>
      </header>

      <div
        className="presentation-slider"
        tabIndex="0"
        aria-label="Apresentação do NORU em slides"
        onKeyDown={(event) => { if (event.key === "ArrowRight") changeSlide(1); if (event.key === "ArrowLeft") changeSlide(-1); }}
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
        onTouchEnd={(event) => { if (touchStartX.current === null) return; const distance = event.changedTouches[0].clientX - touchStartX.current; if (Math.abs(distance) > 45) changeSlide(distance < 0 ? 1 : -1); touchStartX.current = null; }}
      >
      <div className="presentation-slider__track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
      <div className="about-noru__overview">
        {overviewItems.map((item) => (
          <article className="overview-card" key={item.label}>
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <section className="journey" aria-labelledby="journey-title">
        <header className="section-heading">
          <span>DO PRIMEIRO ACESSO À PRIMEIRA OPORTUNIDADE</span>
          <h2 id="journey-title">Jornada do<br /><em>usuário.</em></h2>
        </header>
        <div className="journey__track">
          {journey.map((step) => (
            <article className="journey-step" key={step.number}>
              <span className="journey-step__number">{step.number}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="features" aria-labelledby="features-title">
        <header className="section-heading section-heading--light">
          <span>TUDO EM UM SÓ LUGAR</span>
          <h2 id="features-title">Explore.<br /><em>Aprenda. Evolua.</em></h2>
        </header>
        <div className="features__grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-card__icon">{feature.icon}</span>
              <small>0{index + 1}</small>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="connection" aria-labelledby="connection-title">
        <div className="connection__copy">
          <span className="section-label">UMA VIA DE MÃO DUPLA</span>
          <h2 id="connection-title">Talento encontra<br /><em>oportunidade.</em></h2>
          <p>Jovens encontram vagas e preparação. Empresas encontram pessoas treinadas, interessadas e com potencial comprovado por desafios e experiências dentro da plataforma.</p>
        </div>
        <div className="connection__diagram" aria-label="Conexão entre jovens e empresas">
          <div><small>QUEM BUSCA</small><strong>JOVENS</strong></div>
          <span><b>VAGAS + DESAFIOS</b><i>→</i><i>←</i><b>TALENTO + POTENCIAL</b></span>
          <div><small>QUEM CONTRATA</small><strong>EMPRESAS</strong></div>
        </div>
      </section>

      <section className="progress-system" aria-labelledby="progress-title">
        <div>
          <span className="section-label">SISTEMA DE PROGRESSO</span>
          <h2 id="progress-title">Cada passo<br /><em>vale XP.</em></h2>
        </div>
        <div className="progress-system__content">
          <p>Cursos, oficinas, treinamentos e entrevistas viram experiência. Quanto mais o usuário se prepara, mais seu nível representa a sua evolução.</p>
          <div className="level-preview"><span>NÍVEL 01</span><div><i /></div><strong>750 XP PARA O PRÓXIMO NÍVEL</strong></div>
        </div>
      </section>
      </div>
      <nav className="presentation-slider__controls" aria-label="Controles da apresentação">
        <button type="button" aria-label="Slide anterior" onClick={() => changeSlide(-1)} disabled={activeSlide === 0}>←</button>
        <div className="presentation-slider__status"><span>{String(activeSlide + 1).padStart(2, "0")} / {String(slideLabels.length).padStart(2, "0")}</span><strong>{slideLabels[activeSlide]}</strong></div>
        <div className="presentation-slider__dots">{slideLabels.map((label, index) => <button type="button" className={activeSlide === index ? "active" : ""} aria-label={`Abrir slide ${label}`} onClick={() => setActiveSlide(index)} key={label} />)}</div>
        <button type="button" aria-label="Próximo slide" onClick={() => changeSlide(1)} disabled={activeSlide === slideLabels.length - 1}>→</button>
      </nav>
      </div>

      <section className="jade" aria-labelledby="noru-ai-title">
        <div className="noru-demo">
          <header className="noru-demo__header"><div className="noru-avatar" aria-hidden="true"><i /><i /></div><div><strong>Noru</strong><span>IA de orientação profissional</span></div><small>● ONLINE</small></header>
          <div className="noru-demo__modes"><button type="button" className={interviewStep === null ? "active" : ""} onClick={() => askQuickQuestion("Como melhorar meu currículo?")}>PERGUNTAS RÁPIDAS</button><button type="button" className={interviewStep !== null ? "active" : ""} onClick={startInterview}>SIMULAR ENTREVISTA</button></div>
          <div className="noru-demo__messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message chat-message--${message.author}`} key={`${message.author}-${index}`}>{message.author === "noru" && <span className="chat-message__avatar" aria-hidden="true" />}<p>{message.text}</p>{message.author === "user" && <span className="chat-message__user">VOCÊ</span>}</div>)}</div>
          <div className="noru-demo__actions">{interviewStep === null ? Object.keys(quickReplies).map((question) => <button type="button" key={question} onClick={() => askQuickQuestion(question)}>{question}</button>) : interviewSteps[interviewStep].options.map((answer) => <button type="button" key={answer} onClick={() => answerInterview(answer)}>{answer}</button>)}</div>
        </div>
        <div className="jade__copy"><span className="section-label">SEU PARCEIRO DE JORNADA</span><h2 id="noru-ai-title">Oi, eu sou<br /><em>Noru.</em></h2><p>O Noru também é a inteligência artificial da plataforma. Ele acompanha o usuário desde o primeiro acesso, apresenta recursos, esclarece dúvidas e oferece testes vocacionais, apoio para construir o perfil e dicas sobre o mundo do trabalho.</p><p className="noru-demo-note">A demonstração ao lado é interativa: escolha uma pergunta ou inicie uma entrevista para experimentar.</p></div>
      </section>

      <footer className="ods">
        <header className="ods__heading"><span className="section-label">IMPACTO QUE GUIA O NORU</span><h2>Objetivos que<br /><em>viram ação.</em></h2><p>O NORU contribui diretamente para três Objetivos de Desenvolvimento Sustentável da ONU.</p></header>
        <div className="ods__tabs" role="tablist" aria-label="Objetivos de Desenvolvimento Sustentável">
          {odsItems.map((item, index) => <button type="button" role="tab" aria-selected={activeOds === index} className={activeOds === index ? "active" : ""} onClick={() => setActiveOds(index)} key={item.number}><strong>{item.number}</strong><span>{item.title}</span></button>)}
        </div>
        <article className="ods__panel" role="tabpanel">
          <div className="ods__number">{odsItems[activeOds].number}</div>
          <div className="ods__content"><span>OBJETIVO DA ONU</span><h3>{odsItems[activeOds].title}</h3><p>{odsItems[activeOds].description}</p><div className="ods__relation"><strong>O QUE ISSO TEM A VER COM O NORU?</strong><p>{odsItems[activeOds].relation}</p></div></div>
        </article>
      </footer>
    </section>
  );
}
