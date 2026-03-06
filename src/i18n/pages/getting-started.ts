import type { Locale } from '../types';

export const gettingStartedContent = (locale: Locale) => content[locale];

const content: Record<Locale, GettingStartedContent> = {
  en: {
    title: 'Getting Started - Soleri',
    description:
      'From zero to a learning system in five minutes. Install Soleri, create your first agent, and start compounding knowledge.',
    eyebrow: 'From zero to a learning system in five minutes',
    heroTitle: 'Your first agent starts smart. It only gets smarter.',
    heroSubtitle: 'Five steps. No configuration files to write. No API keys required.',
    steps: [
      {
        title: 'Install',
        text: "One global npm package. That's it.",
        code: `<span class="prompt">$</span>
                <span class="cmd">npm install</span>
                <span class="arg">-g soleri</span>`,
        isInstallCmd: true,
      },
      {
        title: 'Create your agent',
        text: 'Give it a name and connect a vault. Soleri sets up domains, installs starter knowledge, and scans your project.',
        code: `<span class="prompt">$</span> <span class="cmd">soleri create</span> <span class="arg">my-agent</span>

<span class="ok">✓</span> Created agent config       <span class="cmt">~/.soleri/agents/my-agent/</span>
<span class="ok">✓</span> Connected vault            <span class="val">starter knowledge: 34 patterns</span>
<span class="ok">✓</span> Scanned project            <span class="val">React + TypeScript detected</span>
<span class="ok">✓</span> Auto-captured              <span class="val">12 codebase patterns</span>
<span class="ok">✓</span> Vault ready                <span class="val">46 entries, vectorized</span>

<span class="cmt">Agent "my-agent" is ready.</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Feed it knowledge',
        text: "Add knowledge to your agent's vault. Install community packs, connect a team vault, or let the brain capture patterns from your work.",
        code: `<span class="cmt"># Add a community knowledge pack</span>
<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">install community/react-patterns</span>

<span class="ok">✓</span> Installed react-patterns    <span class="val">v0.3.0</span>
<span class="ok">✓</span> Added 28 patterns to vault
<span class="ok">✓</span> Vectorized and graph-connected

<span class="cmt"># The brain captures patterns from your work</span>
<span class="warn">!</span> You've replaced <span class="val">bg-blue-500</span> with <span class="ok">bg-primary</span> 3 times.
  Capture as pattern? <span class="key">[y/n]</span>

<span class="ok">✓</span> Captured: <span class="val">semantic-token-enforcement</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Extend',
        text: "Connect your team's shared vault or add more knowledge packs. Knowledge stacks.",
        code: `<span class="cmt"># Connect your team's shared vault</span>
<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">connect git@github.com:team/vault.git</span>

<span class="ok">✓</span> Connected team vault      <span class="val">142 entries</span>
<span class="ok">✓</span> Search priority: agent → project → team

<span class="cmt"># Check vault status</span>
<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">status</span>

<span class="ok">Entries:</span>     <span class="val">216</span>     <span class="cmt">vectorized, graph-connected</span>
<span class="ok">Domains:</span>     <span class="val">3</span>       <span class="cmt">frontend, backend, cross-cutting</span>
<span class="ok">Graph:</span>       <span class="val">412 edges</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Health check',
        text: 'Run doctor to verify everything is connected and up to date.',
        code: `<span class="prompt">$</span> <span class="cmd">soleri</span> <span class="arg">doctor</span>

<span class="ok">✓</span> Engine          <span class="val">v1.2.0</span>   <span class="cmt">up to date</span>
<span class="ok">✓</span> domain-design   <span class="val">v0.8.0</span>   <span class="cmt">up to date</span>
<span class="ok">✓</span> domain-review   <span class="val">v0.5.0</span>   <span class="cmt">up to date</span>
<span class="ok">✓</span> my-agent        <span class="val">config ok</span>
<span class="ok">✓</span> Vault           <span class="val">216 entries, healthy</span>
<span class="ok">✓</span> Brain           <span class="val">tracking enabled</span>
<span class="ok">✓</span> Team vault      <span class="val">connected, synced</span>`,
        isInstallCmd: false,
      },
    ],
    nextTitle: 'Keep going',
    nextLinks: [
      {
        title: 'How it works',
        desc: 'Vault, brain, and transport architecture explained.',
        href: 'how-it-works.html',
      },
      {
        title: 'Your Agent',
        desc: "Create, configure, and grow your agent's knowledge.",
        href: 'personas.html',
      },
      {
        title: 'Teams &amp; Ops',
        desc: 'Shared vaults, knowledge packs, and Telegram bot.',
        href: 'teams.html',
      },
    ],
  },
  uk: {
    title: 'Початок роботи - Soleri',
    description:
      "Від нуля до навчальної системи за п'ять хвилин. Встановіть Soleri, створіть першого агента та починайте накопичувати знання.",
    eyebrow: "Від нуля до навчальної системи за п'ять хвилин",
    heroTitle: 'Ваш перший агент починає розумним. Далі стає лише розумнішим.',
    heroSubtitle: "П'ять кроків. Жодних файлів конфігурації. Жодних API-ключів.",
    steps: [
      {
        title: 'Встановіть',
        text: 'Один глобальний пакет npm. І все.',
        code: `<span class="prompt">$</span>
                <span class="cmd">npm install</span>
                <span class="arg">-g soleri</span>`,
        isInstallCmd: true,
      },
      {
        title: 'Створіть твого агента',
        text: 'Вкажіть назву та підключіть сховище. Soleri налаштує домени, встановить початкові знання та просканує проєкт.',
        code: `<span class="prompt">$</span> <span class="cmd">soleri create</span> <span class="arg">my-agent</span>

<span class="ok">✓</span> Створено конфігурацію агента       <span class="cmt">~/.soleri/agents/my-agent/</span>
<span class="ok">✓</span> Підключене сховище            <span class="val">початкові знання: 34 патерни</span>
<span class="ok">✓</span> Сканування проєкту            <span class="val">React + TypeScript виявлено</span>
<span class="ok">✓</span> Автоматично захоплено        <span class="val">12 патернів з кодової бази</span>
<span class="ok">✓</span> Сховище готове                <span class="val">46 записів, векторизовано</span>

<span class="cmt">Агент "my-agent" готовий.</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Наповніть знаннями',
        text: 'Додайте знання до сховища твого агента. Встановіть пакети знань спільноти, підключіть сховище команди або дозвольте мозку захоплювати патерни з вашої роботи.',
        code: `<span class="cmt"># Додайте пакет знань спільноти</span>
<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">install community/react-patterns</span>

<span class="ok">✓</span> Встановлено react-patterns    <span class="val">v0.3.0</span>
<span class="ok">✓</span> Додано 28 патернів до сховища
<span class="ok">✓</span> Векторизовано та зв'язано графами

<span class="cmt"># Мозок захоплює патерни з вашої роботи</span>
<span class="warn">!</span> Ви замінили <span class="val">bg-blue-500</span> на <span class="ok">bg-primary</span> 3 рази.
  Захопити як патерн? <span class="key">[y/n]</span>

<span class="ok">✓</span> Захоплено: <span class="val">semantic-token-enforcement</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Розширте',
        text: 'Підключіть спільне сховище вашої команди або додайте більше пакетів знань. Знання накопичуються.',
        code: `<span class="cmt"># Підключіть спільне сховище вашої команди</span>
<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">connect git@github.com:team/vault.git</span>

<span class="ok">✓</span> Підключено сховище команди      <span class="val">142 записів</span>
<span class="ok">✓</span> Пріоритет пошуку: агент → проєкт → команда

<span class="cmt"># Перевірте стан сховища</span>
<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">status</span>

<span class="ok">Записи:</span>     <span class="val">216</span>     <span class="cmt">векторизовано, зв'язано графами</span>
<span class="ok">Домени:</span>     <span class="val">3</span>       <span class="cmt">фронтенд, бекенд, наскрізні</span>
<span class="ok">Граф:</span>       <span class="val">412 зв'язків</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Перевірте стан',
        text: 'Запустіть діагностику, щоб перевірити, чи все підключено та оновлено.',
        code: `<span class="prompt">$</span> <span class="cmd">soleri</span> <span class="arg">doctor</span>

<span class="ok">✓</span> Рушій          <span class="val">v1.2.0</span>   <span class="cmt">оновлено</span>
<span class="ok">✓</span> domain-design   <span class="val">v0.8.0</span>   <span class="cmt">оновлено</span>
<span class="ok">✓</span> domain-review   <span class="val">v0.5.0</span>   <span class="cmt">оновлено</span>
<span class="ok">✓</span> my-agent        <span class="val">конфігурація ок</span>
<span class="ok">✓</span> Сховище           <span class="val">216 записів, в порядку</span>
<span class="ok">✓</span> Мозок           <span class="val">відстеження увімкнено</span>
<span class="ok">✓</span> Сховище команди      <span class="val">підключено, синхронізовано</span>`,
        isInstallCmd: false,
      },
    ],
    nextTitle: 'Продовжуйте',
    nextLinks: [
      {
        title: 'Як це працює',
        desc: 'Пояснення архітектури сховища, мозку та транспорту.',
        href: 'how-it-works.html',
      },
      {
        title: 'Ваш Агент',
        desc: 'Створюйте, налаштовуйте та розширюйте знання твого агента.',
        href: 'personas.html',
      },
      {
        title: 'Команди та Опс',
        desc: 'Спільні сховища, пакети знань та бот у Telegram.',
        href: 'teams.html',
      },
    ],
  },
  it: {
    title: 'Inizia - Soleri',
    description:
      'Da zero a un sistema di apprendimento in cinque minuti. Installa Soleri, crea il tuo primo agente e inizia ad accumulare conoscenza.',
    eyebrow: 'Da zero a un sistema di apprendimento in cinque minuti',
    heroTitle: 'Il tuo primo agente parte intelligente. Diventa solo più intelligente.',
    heroSubtitle:
      'Cinque passaggi. Nessun file di configurazione da scrivere. Nessuna chiave API richiesta.',
    steps: [
      {
        title: 'Installa',
        text: 'Un solo pacchetto global npm. Tutto qui.',
        code: `<span class="prompt">$</span>
                <span class="cmd">npm install</span>
                <span class="arg">-g soleri</span>`,
        isInstallCmd: true,
      },
      {
        title: 'Crea il tuo agente',
        text: 'Dagli un nome e collega un Vault. Soleri configura i domini, installa conoscenze iniziali e scansiona il tuo progetto.',
        code: `<span class="prompt">$</span> <span class="cmd">soleri create</span> <span class="arg">my-agent</span>

<span class="ok">✓</span> Configurazione agente creata       <span class="cmt">~/.soleri/agents/my-agent/</span>
<span class="ok">✓</span> Vault collegato                 <span class="val">conoscenze iniziali: 34 pattern</span>
<span class="ok">✓</span> Progetto scansionato            <span class="val">React + TypeScript rilevato</span>
<span class="ok">✓</span> Acquisizione automatica              <span class="val">12 pattern dal codice</span>
<span class="ok">✓</span> Vault pronto                    <span class="val">46 voci, vettorializzate</span>

<span class="cmt">Agente "my-agent" è pronto.</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Alimenta con conoscenze',
        text: 'Aggiungi conoscenza al Vault del tuo agente. Installa pacchetti della comunità, collega un Vault di team o lascia che il cervello catturi pattern dal tuo lavoro.',
        code: `<span class="cmt"># Aggiungi un pacchetto di conoscenze della comunità</span>
<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">install community/react-patterns</span>

<span class="ok">✓</span> react-patterns installato    <span class="val">v0.3.0</span>
<span class="ok">✓</span> 28 pattern aggiunti al Vault
<span class="ok">✓</span> Vettorializzato e collegato al grafo

<span class="cmt"># Il cervello cattura pattern dal tuo lavoro</span>
<span class="warn">!</span> Hai sostituito <span class="val">bg-blue-500</span> con <span class="ok">bg-primary</span> 3 volte.
  Catturare come pattern? <span class="key">[y/n]</span>

<span class="ok">✓</span> Catturato: <span class="val">semantic-token-enforcement</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Estendi',
        text: 'Collega il Vault condiviso del tuo team o aggiungi altri pacchetti di conoscenza. La conoscenza si accumula.',
        code: `<span class="cmt"># Collega il Vault condiviso del tuo team</span>
<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">connect git@github.com:team/vault.git</span>

<span class="ok">✓</span> Vault di team collegato         <span class="val">142 voci</span>
<span class="ok">✓</span> Priorità di ricerca: agente → progetto → team

<span class="cmt"># Controlla lo stato del Vault</span>
<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">status</span>

<span class="ok">Voci:</span>     <span class="val">216</span>     <span class="cmt">vettorializzate, collegate al grafo</span>
<span class="ok">Domini:</span>     <span class="val">3</span>       <span class="cmt">frontend, backend, trasversali</span>
<span class="ok">Grafico:</span>       <span class="val">412 archi</span>`,
        isInstallCmd: false,
      },
      {
        title: 'Controllo di integrità',
        text: 'Esegui doctor per verificare che tutto sia connesso e aggiornato.',
        code: `<span class="prompt">$</span> <span class="cmd">soleri</span> <span class="arg">doctor</span>

<span class="ok">✓</span> Motore          <span class="val">v1.2.0</span>   <span class="cmt">aggiornato</span>
<span class="ok">✓</span> domain-design   <span class="val">v0.8.0</span>   <span class="cmt">aggiornato</span>
<span class="ok">✓</span> domain-review   <span class="val">v0.5.0</span>   <span class="cmt">aggiornato</span>
<span class="ok">✓</span> my-agent        <span class="val">configurazione ok</span>
<span class="ok">✓</span> Vault               <span class="val">216 voci, sano</span>
<span class="ok">✓</span> Cervello           <span class="val">tracciamento abilitato</span>
<span class="ok">✓</span> Vault di team       <span class="val">collegato, sincronizzato</span>`,
        isInstallCmd: false,
      },
    ],
    nextTitle: 'Continua',
    nextLinks: [
      {
        title: 'Come funziona',
        desc: 'Vault, cervello e architettura di trasporto.',
        href: 'how-it-works.html',
      },
      {
        title: 'Il tuo agente',
        desc: 'Crea, configura e sviluppa le conoscenze del tuo agente.',
        href: 'personas.html',
      },
      {
        title: 'Team e Ops',
        desc: 'Vault condivisi, pacchetti di conoscenza e bot Telegram.',
        href: 'teams.html',
      },
    ],
  },
};

interface Step {
  title: string;
  text: string;
  code: string;
  isInstallCmd: boolean;
}

interface NextLink {
  title: string;
  desc: string;
  href: string;
}

interface GettingStartedContent {
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  steps: Step[];
  nextTitle: string;
  nextLinks: NextLink[];
}
