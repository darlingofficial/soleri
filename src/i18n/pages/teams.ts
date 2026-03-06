import type { Locale } from '../types';

export const teamsContent = (locale: Locale) => content[locale];

interface FlowStep {
  num: string;
  color: 'amber' | 'teal' | 'green';
  text: string;
}

interface PackRow {
  tierLabel: string;
  tierClass: 'free' | 'paid';
  source: string;
  price: string;
}

interface UpdateRow {
  layer: string;
  command: string;
  scope: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  html: string;
}

interface TeamsContent {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  vaults: {
    sectionTitle: string;
    heading: string;
    description: string;
    keyPoint: string;
    flowSteps: FlowStep[];
    code1Comment: string;
    code1Output: string;
    code2Comment: string;
    code2Output: string;
  };
  crossProject: {
    sectionTitle: string;
    heading: string;
    description: string;
    keyPoint: string;
    code1Comment: string;
    code1Output: string;
    code2Comment: string;
    code2Yaml: string;
  };
  packs: {
    sectionTitle: string;
    heading: string;
    description: string;
    tableHeaders: [string, string, string];
    rows: PackRow[];
    code1Comment: string;
    code1Output: string;
    code2Comment: string;
    code2Output: string;
  };
  playbooks: {
    sectionTitle: string;
    heading: string;
    description1: string;
    description2: string;
    keyPoint: string;
    code1Comment: string;
    code1Output: string;
    code2Comment: string;
    code2Yaml: string;
    code3Comment: string;
    code3Output: string;
  };
  updates: {
    sectionTitle: string;
    tableHeaders: [string, string, string];
    rows: UpdateRow[];
    footnote: string;
    codeComment: string;
    codeOutput: string;
  };
  telegram: {
    sectionTitle: string;
    heading: string;
    description: string;
    keyPoint: string;
    chatMessages: ChatMessage[];
    codeComment: string;
    codeOutput: string;
  };
}

const content: Record<Locale, TeamsContent> = {
  en: {
    meta: {
      title: 'Teams & Ops - Soleri',
      description:
        "Tribal knowledge doesn't scale. Soleri connects team vaults, knowledge packs, and playbooks so codified knowledge compounds across projects.",
    },
    hero: {
      eyebrow: "Tribal knowledge doesn't scale. Codified knowledge does.",
      title: "When knowledge lives in people's heads, it leaves with them.",
      subtitle:
        'Connected vaults, knowledge packs, and playbooks turn team expertise into compounding infrastructure.',
    },
    vaults: {
      sectionTitle: 'Connect once, share everything',
      heading: 'Three-tier vault model',
      description:
        'When projects hoard knowledge independently, teams re-learn the same lessons every time. The three-tier model fixes this: your agent keeps domain-organized knowledge in its vault. A shared project vault holds cross-cutting conventions. Connect a team vault to share across projects.',
      keyPoint: 'Search priority: agent vault \u2192 project vault \u2192 team vault.',
      flowSteps: [
        {
          num: '1',
          color: 'amber',
          text: 'Agent vault \u2014 frontend, backend, cross-cutting domains',
        },
        { num: '2', color: 'teal', text: 'Project vault \u2014 team conventions, decisions' },
        { num: '3', color: 'green', text: 'Team vault \u2014 shared across all projects' },
      ],
      code1Comment: '# Connect a team vault',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">connect git@github.com:team/design-vault.git</span>

<span class="ok">\u2713</span> Connected team vault      <span class="val">142 entries</span>
<span class="ok">\u2713</span> Merged search index
<span class="ok">\u2713</span> Priority: agent \u2192 project \u2192 team`,
      code2Comment: '# Promote a pattern to the team vault',
      code2Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">promote pattern-semantic-tokens \\
  --target team</span>

<span class="ok">\u2713</span> Promoted to team vault
<span class="ok">\u2713</span> Available to all team members`,
    },
    crossProject: {
      sectionTitle: 'Patterns compound across projects',
      heading: 'Link projects, share patterns',
      description:
        'Link projects as related, parent/child, or fork. When you search your vault, linked projects are included automatically with weighted relevance.',
      keyPoint: 'Patterns learned in project A are available in project B.',
      code1Comment: '# Link related projects',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">link /project-a /project-b \\
  --type related</span>

<span class="ok">\u2713</span> Projects linked (bidirectional)
<span class="ok">\u2713</span> Cross-project search enabled`,
      code2Comment: '# agent.yaml \u2014 vault config',
      code2Yaml: `<span class="key">vault:</span>
  <span class="key">backends:</span>
    - <span class="key">type:</span> <span class="val">local</span>
      <span class="key">path:</span> <span class="val">~/.soleri/vaults/my-agent</span>
    - <span class="key">type:</span> <span class="val">git</span>
      <span class="key">uri:</span>  <span class="val">git@github.com:team/vault.git</span>
      <span class="key">sync:</span> <span class="val">on-start</span>
      <span class="key">push:</span> <span class="val">on-promote</span>`,
    },
    packs: {
      sectionTitle: 'Install expertise in one command',
      heading: 'Three tiers of knowledge packs',
      description:
        'Packs are npm packages you snap into any agent. They add patterns, anti-patterns, and domain rules to your vault instantly.',
      tableHeaders: ['Tier', 'Source', 'Price'],
      rows: [
        { tierLabel: 'Starter', tierClass: 'free', source: 'Ships with each agent', price: 'Free' },
        { tierLabel: 'Community', tierClass: 'free', source: 'npm registry', price: 'Free' },
        { tierLabel: 'Premium', tierClass: 'paid', source: 'Subscription', price: 'Paid' },
      ],
      code1Comment: '# Install a community pack',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">install community/react-patterns</span>

<span class="ok">\u2713</span> Installed react-patterns  <span class="val">v0.3.0</span>
<span class="ok">\u2713</span> Added 28 patterns to vault
<span class="ok">\u2713</span> Added 6 anti-patterns`,
      code2Comment: '# Sync premium packs',
      code2Output: `<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">sync</span>

<span class="ok">\u2713</span> enterprise/compliance    <span class="val">v2.3.1</span>  <span class="cmt">updated</span>
<span class="ok">\u2713</span> enterprise/perf-audit    <span class="val">v1.8.0</span>  <span class="cmt">up to date</span>
  enterprise/security-pro  <span class="val">v3.0.0</span>  <span class="warn">major update</span>`,
    },
    playbooks: {
      sectionTitle: "Codify your team's workflows",
      heading: 'Patterns tell you what. Playbooks tell you how.',
      description1:
        'Playbooks are validated multi-step procedures stored in your vault. They capture the full workflow \u2014 not just a rule, but the sequence, the expected outcomes, and the validation criteria.',
      description2:
        "Examples: migrating tokens across a codebase, setting up a new component from scratch, debugging a contrast failure. Each step includes what to check and when you're done.",
      keyPoint: 'Repeatable workflows, not tribal knowledge.',
      code1Comment: '# List available playbooks',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">list-playbooks --category design</span>

<span class="ok">Found 4 playbooks:</span>
  <span class="val">design:component-setup</span>     <span class="cmt">7 steps</span>
  <span class="val">design:token-migration</span>     <span class="cmt">5 steps</span>
  <span class="val">design:contrast-audit</span>      <span class="cmt">4 steps</span>
  <span class="val">design:theme-scaffolding</span>   <span class="cmt">6 steps</span>`,
      code2Comment: '# Playbook structure',
      code2Yaml: `<span class="key">id:</span> <span class="val">design:component-setup</span>
<span class="key">type:</span> <span class="val">playbook</span>
<span class="key">steps:</span>
  - <span class="key">name:</span> <span class="val">Scaffold component files</span>
    <span class="key">run:</span>  <span class="val">soleri create component $name</span>
    <span class="key">validate:</span> <span class="val">files exist, exports present</span>
  - <span class="key">name:</span> <span class="val">Apply token system</span>
    <span class="key">run:</span>  <span class="val">soleri validate --fix</span>
    <span class="key">validate:</span> <span class="val">token score >= 95</span>
  - <span class="key">name:</span> <span class="val">Check accessibility</span>
    <span class="key">run:</span>  <span class="val">soleri check-contrast</span>
    <span class="key">validate:</span> <span class="val">all PASS</span>`,
      code3Comment: '# Run a playbook',
      code3Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">run-playbook design:component-setup \\
  --name UserCard</span>

<span class="ok">Step 1/7:</span> Scaffold component files    <span class="ok">\u2713</span>
<span class="ok">Step 2/7:</span> Apply token system          <span class="ok">\u2713</span>
<span class="ok">Step 3/7:</span> Check accessibility         <span class="ok">\u2713</span>
  <span class="cmt">... 4 more steps</span>`,
    },
    updates: {
      sectionTitle: 'Four channels, zero breakage',
      tableHeaders: ['Layer', 'Update command', 'Scope'],
      rows: [
        { layer: 'Engine', command: 'npm update soleri', scope: 'All agents' },
        { layer: 'Domains', command: 'npm update @soleri/*', scope: 'Per domain' },
        { layer: 'Agent', command: 'soleri update', scope: 'Config merge' },
        { layer: 'Packs', command: 'soleri packs sync', scope: 'Per pack' },
      ],
      footnote: 'Vault knowledge is never auto-updated \u2014 you own it.',
      codeComment: '# Health check',
      codeOutput: `<span class="prompt">$</span> <span class="cmd">soleri</span> <span class="arg">doctor</span>

<span class="ok">\u2713</span> Engine          <span class="val">v1.2.0</span>  <span class="cmt">up to date</span>
<span class="ok">\u2713</span> domain-design   <span class="val">v0.8.0</span>  <span class="cmt">up to date</span>
<span class="ok">\u2713</span> domain-security <span class="val">v0.6.0</span>  <span class="cmt">up to date</span>
<span class="warn">!</span> domain-arch     <span class="val">v0.4.0</span>  <span class="warn">update available</span>
<span class="ok">\u2713</span> my-agent        <span class="val">config ok</span>
<span class="ok">\u2713</span> Vault           <span class="val">284 entries, healthy</span>
<span class="ok">\u2713</span> Brain           <span class="val">12 patterns tracked</span>`,
    },
    telegram: {
      sectionTitle: 'Manage your infrastructure from a chat',
      heading: 'Telegram bot for ops',
      description:
        'Monitor vault health, query the knowledge graph, check event logs, and manage infrastructure \u2014 all from Telegram. Works with any LLM provider.',
      keyPoint: 'Works with OpenAI, Anthropic, Ollama, or no LLM at all.',
      chatMessages: [
        { role: 'user', html: "how's the vault doing?" },
        {
          role: 'bot',
          html: "Looking good \u2014 <code>284</code> entries, synced 2 min ago. Everything's healthy.",
        },
        { role: 'user', html: 'what patterns are working best this week?' },
        {
          role: 'bot',
          html: 'Your top 3 right now:<br>1. semantic-tokens \u2014 <code>94</code> strength<br>2. component-structure \u2014 <code>87</code><br>3. error-boundaries \u2014 <code>82</code><br>Tokens are really clicking for the team.',
        },
        {
          role: 'bot',
          html: "Hey \u2014 you still have 3 ideas from yesterday's brainstorm that haven't been processed. Want to go through them?",
        },
        { role: 'user', html: "sure, what's the first one?" },
        {
          role: 'bot',
          html: "Auto-detect stale vault entries older than 90 days. I think this one's solid \u2014 could become a roadmap item for the cleanup pipeline. Want me to write it up?",
        },
      ],
      codeComment: '# Structured event queries (JSONL)',
      codeOutput: `<span class="prompt">$</span> grep <span class="val">'"tool_call"'</span> events-*.jsonl \\
  | jq <span class="arg">-r .tool</span> | sort | uniq -c | sort -rn

  42 soleri_validate_component_code
  28 soleri_vault_search
  15 soleri_check_contrast`,
    },
  },
  uk: {
    meta: {
      title: 'Команди та операції \u2014 Soleri',
      description:
        "Неформалізовані знання не масштабуються. Soleri з'єднує командні сховища, пакети знань та плейбуки, щоб кодифіковані знання накопичувалися між проєктами.",
    },
    hero: {
      eyebrow: 'Неформалізовані знання не масштабуються. Кодифіковані \u2014 так.',
      title: 'Коли знання живуть у головах людей, вони йдуть разом із ними.',
      subtitle:
        'Підключені сховища, пакети знань та плейбуки перетворюють експертизу команди на накопичувальну інфраструктуру.',
    },
    vaults: {
      sectionTitle: 'Підключіть один раз \u2014 діліться всім',
      heading: 'Трирівнева модель сховища',
      description:
        'Коли проєкти накопичують знання незалежно, команди переучують одні й ті ж уроки щоразу. Трирівнева модель це виправляє: Твій агент зберігає знання, упорядковані за доменами, у своєму сховищі. Спільне сховище проєкту містить наскрізні домовленості. Підключіть командне сховище, щоб ділитися між проєктами.',
      keyPoint: 'Пріоритет пошуку: сховище агента \u2192 сховище проєкту \u2192 командне сховище.',
      flowSteps: [
        {
          num: '1',
          color: 'amber',
          text: 'Сховище агента \u2014 фронтенд, бекенд, наскрізні домени',
        },
        { num: '2', color: 'teal', text: 'Сховище проєкту \u2014 командні домовленості, рішення' },
        { num: '3', color: 'green', text: 'Командне сховище \u2014 спільне для всіх проєктів' },
      ],
      code1Comment: '# Підключити командне сховище',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">connect git@github.com:team/design-vault.git</span>

<span class="ok">\u2713</span> Підключено командне сховище      <span class="val">142 entries</span>
<span class="ok">\u2713</span> Об'єднано індекс пошуку
<span class="ok">\u2713</span> Пріоритет: агент \u2192 проєкт \u2192 команда`,
      code2Comment: '# Підвищити патерн до командного сховища',
      code2Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">promote pattern-semantic-tokens \\
  --target team</span>

<span class="ok">\u2713</span> Підвищено до командного сховища
<span class="ok">\u2713</span> Доступно всім учасникам команди`,
    },
    crossProject: {
      sectionTitle: 'Патерни накопичуються між проєктами',
      heading: "Пов'язуйте проєкти, діліться патернами",
      description:
        "Пов'язуйте проєкти як споріднені, батьківський/дочірній або форк. Коли ви шукаєте у своєму сховищі, пов'язані проєкти включаються автоматично із зваженою відповідністю.",
      keyPoint: 'Патерни, засвоєні у проєкті A, доступні у проєкті B.',
      code1Comment: "# Пов'язати споріднені проєкти",
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">link /project-a /project-b \\
  --type related</span>

<span class="ok">\u2713</span> Проєкти пов'язано (двонапрямно)
<span class="ok">\u2713</span> Увімкнено міжпроєктний пошук`,
      code2Comment: '# agent.yaml \u2014 конфігурація сховища',
      code2Yaml: `<span class="key">vault:</span>
  <span class="key">backends:</span>
    - <span class="key">type:</span> <span class="val">local</span>
      <span class="key">path:</span> <span class="val">~/.soleri/vaults/my-agent</span>
    - <span class="key">type:</span> <span class="val">git</span>
      <span class="key">uri:</span>  <span class="val">git@github.com:team/vault.git</span>
      <span class="key">sync:</span> <span class="val">on-start</span>
      <span class="key">push:</span> <span class="val">on-promote</span>`,
    },
    packs: {
      sectionTitle: 'Встановіть експертизу однією командою',
      heading: 'Три рівні пакетів знань',
      description:
        "Пакети \u2014 це npm-пакунки, які ви під'єднуєте до будь-якого агента. Вони миттєво додають патерни, антипатерни та доменні правила до вашого сховища.",
      tableHeaders: ['Рівень', 'Джерело', 'Ціна'],
      rows: [
        {
          tierLabel: 'Початковий',
          tierClass: 'free',
          source: 'Постачається з кожним агентом',
          price: 'Безкоштовно',
        },
        { tierLabel: 'Спільнота', tierClass: 'free', source: 'реєстр npm', price: 'Безкоштовно' },
        { tierLabel: 'Преміум', tierClass: 'paid', source: 'Підписка', price: 'Платно' },
      ],
      code1Comment: '# Встановити пак із спільноти',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">install community/react-patterns</span>

<span class="ok">\u2713</span> Встановлено react-patterns  <span class="val">v0.3.0</span>
<span class="ok">\u2713</span> Додано 28 патернів до сховища
<span class="ok">\u2713</span> Додано 6 антипатернів`,
      code2Comment: '# Синхронізувати преміум-паки',
      code2Output: `<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">sync</span>

<span class="ok">\u2713</span> enterprise/compliance    <span class="val">v2.3.1</span>  <span class="cmt">оновлено</span>
<span class="ok">\u2713</span> enterprise/perf-audit    <span class="val">v1.8.0</span>  <span class="cmt">актуально</span>
  enterprise/security-pro  <span class="val">v3.0.0</span>  <span class="warn">мажорне оновлення</span>`,
    },
    playbooks: {
      sectionTitle: 'Кодифікуйте робочі процеси вашої команди',
      heading: 'Патерни кажуть, що робити. Плейбуки кажуть, як.',
      description1:
        'Плейбуки \u2014 це валідовані багатокрокові процедури, що зберігаються у твоєму сховищі. Вони фіксують повний робочий процес \u2014 не лише правило, а й послідовність, очікувані результати та критерії валідації.',
      description2:
        'Приклади: міграція токенів у кодовій базі, налаштування нового компонента з нуля, налагодження збою контрастності. Кожен крок містить, що перевірити і коли ви завершили.',
      keyPoint: 'Повторювані процеси, а не знання в головах.',
      code1Comment: '# Перелік доступних плейбуків',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">list-playbooks --category design</span>

<span class="ok">Знайдено 4 плейбуки:</span>
  <span class="val">design:component-setup</span>     <span class="cmt">7 кроків</span>
  <span class="val">design:token-migration</span>     <span class="cmt">5 кроків</span>
  <span class="val">design:contrast-audit</span>      <span class="cmt">4 кроки</span>
  <span class="val">design:theme-scaffolding</span>   <span class="cmt">6 кроків</span>`,
      code2Comment: '# Структура плейбука',
      code2Yaml: `<span class="key">id:</span> <span class="val">design:component-setup</span>
<span class="key">type:</span> <span class="val">playbook</span>
<span class="key">steps:</span>
  - <span class="key">name:</span> <span class="val">Створити каркас файлів компонента</span>
    <span class="key">run:</span>  <span class="val">soleri create component $name</span>
    <span class="key">validate:</span> <span class="val">файли існують, експорти присутні</span>
  - <span class="key">name:</span> <span class="val">Застосувати систему токенів</span>
    <span class="key">run:</span>  <span class="val">soleri validate --fix</span>
    <span class="key">validate:</span> <span class="val">token score >= 95</span>
  - <span class="key">name:</span> <span class="val">Перевірити доступність</span>
    <span class="key">run:</span>  <span class="val">soleri check-contrast</span>
    <span class="key">validate:</span> <span class="val">усе PASS</span>`,
      code3Comment: '# Запустити плейбук',
      code3Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">run-playbook design:component-setup \\
  --name UserCard</span>

<span class="ok">Крок 1/7:</span> Створити каркас файлів компонента    <span class="ok">\u2713</span>
<span class="ok">Крок 2/7:</span> Застосувати систему токенів          <span class="ok">\u2713</span>
<span class="ok">Крок 3/7:</span> Перевірити доступність               <span class="ok">\u2713</span>
  <span class="cmt">... ще 4 кроки</span>`,
    },
    updates: {
      sectionTitle: 'Чотири канали \u2014 нуль поломок',
      tableHeaders: ['Рівень', 'Команда оновлення', 'Охоплення'],
      rows: [
        { layer: 'Рушій', command: 'npm update soleri', scope: 'Усі агенти' },
        { layer: 'Домени', command: 'npm update @soleri/*', scope: 'За доменом' },
        { layer: 'Агент', command: 'soleri update', scope: 'Злиття конфігурації' },
        { layer: 'Паки', command: 'soleri packs sync', scope: 'За паком' },
      ],
      footnote: 'Знання у сховищі ніколи не оновлюються автоматично \u2014 ви ними володієте.',
      codeComment: '# Перевірка стану',
      codeOutput: `<span class="prompt">$</span> <span class="cmd">soleri</span> <span class="arg">doctor</span>

<span class="ok">\u2713</span> Engine          <span class="val">v1.2.0</span>  <span class="cmt">актуально</span>
<span class="ok">\u2713</span> domain-design   <span class="val">v0.8.0</span>  <span class="cmt">актуально</span>
<span class="ok">\u2713</span> domain-security <span class="val">v0.6.0</span>  <span class="cmt">актуально</span>
<span class="warn">!</span> domain-arch     <span class="val">v0.4.0</span>  <span class="warn">доступне оновлення</span>
<span class="ok">\u2713</span> my-agent        <span class="val">конфігурація ok</span>
<span class="ok">\u2713</span> Vault           <span class="val">284 entries, healthy</span>
<span class="ok">\u2713</span> Brain           <span class="val">12 patterns tracked</span>`,
    },
    telegram: {
      sectionTitle: 'Керуйте інфраструктурою з чату',
      heading: 'Telegram-бот для операцій',
      description:
        'Моніторте стан сховища, робіть запити до графа знань, перевіряйте журнали подій і керуйте інфраструктурою \u2014 усе з Telegram. Працює з будь-яким провайдером LLM.',
      keyPoint: 'Працює з OpenAI, Anthropic, Ollama або взагалі без LLM.',
      chatMessages: [
        { role: 'user', html: 'як там сховище?' },
        {
          role: 'bot',
          html: 'Усе добре \u2014 <code>284</code> entries, синхронізовано 2 хв тому. Усе здорове.',
        },
        { role: 'user', html: 'які патерни найкраще працюють цього тижня?' },
        {
          role: 'bot',
          html: 'Ваші топ-3 зараз:<br>1. semantic-tokens \u2014 <code>94</code> strength<br>2. component-structure \u2014 <code>87</code><br>3. error-boundaries \u2014 <code>82</code><br>Токени справді добре заходять команді.',
        },
        {
          role: 'bot',
          html: 'Гей \u2014 у тебе досі є 3 ідеї з учорашнього брейншторму, які ще не оброблено. Хочеш пройтися по них?',
        },
        { role: 'user', html: 'так, яка перша?' },
        {
          role: 'bot',
          html: 'Автовиявлення застарілих записів у сховищі старших за 90 днів. Думаю, це надійна ідея \u2014 може стати пунктом роадмапу для пайплайна очищення. Хочеш, щоб я оформив це письмово?',
        },
      ],
      codeComment: '# Структуровані запити подій (JSONL)',
      codeOutput: `<span class="prompt">$</span> grep <span class="val">'"tool_call"'</span> events-*.jsonl \\
  | jq <span class="arg">-r .tool</span> | sort | uniq -c | sort -rn

  42 soleri_validate_component_code
  28 soleri_vault_search
  15 soleri_check_contrast`,
    },
  },
  it: {
    meta: {
      title: 'Team e Operazioni - Soleri',
      description:
        'La conoscenza tacita non scala. Soleri connette Vault di team, pacchetti di conoscenza e playbook affinch\u00e9 la conoscenza codificata si accumuli tra i progetti.',
    },
    hero: {
      eyebrow: 'La conoscenza tacita non scala. Quella codificata s\u00ec.',
      title: 'Quando la conoscenza vive nella testa delle persone, se ne va con loro.',
      subtitle:
        "Vault connessi, pacchetti di conoscenza e playbook trasformano l'expertise del team in infrastruttura che si accumula.",
    },
    vaults: {
      sectionTitle: 'Connettiti una volta, condividi tutto',
      heading: 'Modello di vault a tre livelli',
      description:
        'Quando i progetti accumulano conoscenza indipendentemente, i team reimparano le stesse lezioni ogni volta. Il modello a tre livelli risolve questo: il tuo agente conserva la conoscenza organizzata per domini nel suo vault. Un vault di progetto condiviso detiene convenzioni trasversali. Collega un vault di team per condividere tra progetti.',
      keyPoint: 'Priorit\u00e0 di ricerca: vault agente \u2192 vault progetto \u2192 vault team.',
      flowSteps: [
        {
          num: '1',
          color: 'amber',
          text: 'Vault agente \u2014 frontend, backend, domini trasversali',
        },
        { num: '2', color: 'teal', text: 'Vault progetto \u2014 convenzioni di team, decisioni' },
        { num: '3', color: 'green', text: 'Vault team \u2014 condiviso tra tutti i progetti' },
      ],
      code1Comment: '# Collega un vault team',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">connect git@github.com:team/design-vault.git</span>

<span class="ok">\u2713</span> Vault team connesso      <span class="val">142 voci</span>
<span class="ok">\u2713</span> Indice di ricerca unito
<span class="ok">\u2713</span> Priorit\u00e0: agente \u2192 progetto \u2192 team`,
      code2Comment: '# Promuovi un pattern nel vault team',
      code2Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">promote pattern-semantic-tokens \\
  --target team</span>

<span class="ok">\u2713</span> Promosso nel vault team
<span class="ok">\u2713</span> Disponibile a tutti i membri del team`,
    },
    crossProject: {
      sectionTitle: 'Pattern si accumulano tra i progetti',
      heading: 'Collega progetti, condividi pattern',
      description:
        'Collega i progetti come correlati, padre/figlio o fork. Quando cerchi nel tuo vault, i progetti collegati sono inclusi automaticamente con rilevanza ponderata.',
      keyPoint: 'I pattern appresi nel progetto A sono disponibili nel progetto B.',
      code1Comment: '# Collega progetti correlati',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">link /project-a /project-b \\
  --type related</span>

<span class="ok">\u2713</span> Progetti collegati (bidirezionale)
<span class="ok">\u2713</span> Ricerca inter-progetto abilitata`,
      code2Comment: '# agent.yaml \u2014 configurazione vault',
      code2Yaml: `<span class="key">vault:</span>
  <span class="key">backends:</span>
    - <span class="key">type:</span> <span class="val">local</span>
      <span class="key">path:</span> <span class="val">~/.soleri/vaults/my-agent</span>
    - <span class="key">type:</span> <span class="val">git</span>
      <span class="key">uri:</span>  <span class="val">git@github.com:team/vault.git</span>
      <span class="key">sync:</span> <span class="val">on-start</span>
      <span class="key">push:</span> <span class="val">on-promote</span>`,
    },
    packs: {
      sectionTitle: 'Installa competenze in un solo comando',
      heading: 'Tre livelli di pacchetti di conoscenza',
      description:
        'I pacchetti sono npm package che inserisci in qualsiasi agente. Aggiungono pattern, anti-pattern e regole di dominio al tuo vault istantaneamente.',
      tableHeaders: ['Livello', 'Sorgente', 'Prezzo'],
      rows: [
        {
          tierLabel: 'Starter',
          tierClass: 'free',
          source: 'Incluso con ogni agente',
          price: 'Gratuito',
        },
        { tierLabel: 'Community', tierClass: 'free', source: 'Registro npm', price: 'Gratuito' },
        { tierLabel: 'Premium', tierClass: 'paid', source: 'Abbonamento', price: 'A pagamento' },
      ],
      code1Comment: '# Installa un pacchetto community',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">install community/react-patterns</span>

<span class="ok">\u2713</span> Installato react-patterns  <span class="val">v0.3.0</span>
<span class="ok">\u2713</span> Aggiunti 28 pattern al vault
<span class="ok">\u2713</span> Aggiunti 6 anti-pattern`,
      code2Comment: '# Sincronizza pacchetti premium',
      code2Output: `<span class="prompt">$</span> <span class="cmd">soleri packs</span> <span class="arg">sync</span>

<span class="ok">\u2713</span> enterprise/compliance    <span class="val">v2.3.1</span>  <span class="cmt">aggiornato</span>
<span class="ok">\u2713</span> enterprise/perf-audit    <span class="val">v1.8.0</span>  <span class="cmt">aggiornato</span>
  enterprise/security-pro  <span class="val">v3.0.0</span>  <span class="warn">aggiornamento importante</span>`,
    },
    playbooks: {
      sectionTitle: 'Codifica i flussi di lavoro del tuo team',
      heading: 'I pattern ti dicono cosa fare. I playbook ti dicono come farlo.',
      description1:
        "I playbook sono procedure con pi\u00f9 passaggi memorizzate nel tuo vault. Catturano l'intero flusso di lavoro \u2014 non solo una regola, ma la sequenza, i risultati attesi e i criteri di validazione.",
      description2:
        'Esempi: migrazione di token in un codice, impostazione di un nuovo componente da zero, debug di un errore di contrasto. Ogni passaggio include cosa controllare e quando \u00e8 terminato.',
      keyPoint: 'Flussi di lavoro ripetibili, non conoscenza nella testa delle persone.',
      code1Comment: '# Elenca i playbook disponibili',
      code1Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">list-playbooks --category design</span>

<span class="ok">Trovati 4 playbook:</span>
  <span class="val">design:component-setup</span>     <span class="cmt">7 passaggi</span>
  <span class="val">design:token-migration</span>     <span class="cmt">5 passaggi</span>
  <span class="val">design:contrast-audit</span>      <span class="cmt">4 passaggi</span>
  <span class="val">design:theme-scaffolding</span>   <span class="cmt">6 passaggi</span>`,
      code2Comment: '# Struttura del playbook',
      code2Yaml: `<span class="key">id:</span> <span class="val">design:component-setup</span>
<span class="key">type:</span> <span class="val">playbook</span>
<span class="key">steps:</span>
  - <span class="key">name:</span> <span class="val">Scaffold component files</span>
    <span class="key">run:</span>  <span class="val">soleri create component $name</span>
    <span class="key">validate:</span> <span class="val">files exist, exports present</span>
  - <span class="key">name:</span> <span class="val">Apply token system</span>
    <span class="key">run:</span>  <span class="val">soleri validate --fix</span>
    <span class="key">validate:</span> <span class="val">token score >= 95</span>
  - <span class="key">name:</span> <span class="val">Check accessibility</span>
    <span class="key">run:</span>  <span class="val">soleri check-contrast</span>
    <span class="key">validate:</span> <span class="val">all PASS</span>`,
      code3Comment: '# Esegui un playbook',
      code3Output: `<span class="prompt">$</span> <span class="cmd">soleri vault</span> <span class="arg">run-playbook design:component-setup \\
  --name UserCard</span>

<span class="ok">Passo 1/7:</span> Scaffold component files    <span class="ok">\u2713</span>
<span class="ok">Passo 2/7:</span> Apply token system          <span class="ok">\u2713</span>
<span class="ok">Passo 3/7:</span> Check accessibility         <span class="ok">\u2713</span>
  <span class="cmt">... altri 4 passaggi</span>`,
    },
    updates: {
      sectionTitle: 'Quattro canali, nessuna interruzione',
      tableHeaders: ['Strato', 'Comando di aggiornamento', 'Ambito'],
      rows: [
        { layer: 'Motore', command: 'npm update soleri', scope: 'Tutti gli agenti' },
        { layer: 'Domini', command: 'npm update @soleri/*', scope: 'Per dominio' },
        { layer: 'Agente', command: 'soleri update', scope: 'Unione config' },
        { layer: 'Pacchetti', command: 'soleri packs sync', scope: 'Per pacchetto' },
      ],
      footnote:
        'La conoscenza del vault non viene mai aggiornata automaticamente \u2014 ne sei il proprietario.',
      codeComment: '# Controllo di salute',
      codeOutput: `<span class="prompt">$</span> <span class="cmd">soleri</span> <span class="arg">doctor</span>

<span class="ok">\u2713</span> Motore          <span class="val">v1.2.0</span>  <span class="cmt">aggiornato</span>
<span class="ok">\u2713</span> domain-design   <span class="val">v0.8.0</span>  <span class="cmt">aggiornato</span>
<span class="ok">\u2713</span> domain-security <span class="val">v0.6.0</span>  <span class="cmt">aggiornato</span>
<span class="warn">!</span> domain-arch     <span class="val">v0.4.0</span>  <span class="warn">aggiornamento disponibile</span>
<span class="ok">\u2713</span> my-agent        <span class="val">config ok</span>
<span class="ok">\u2713</span> Vault           <span class="val">284 voci, sano</span>
<span class="ok">\u2713</span> Brain           <span class="val">12 pattern monitorati</span>`,
    },
    telegram: {
      sectionTitle: 'Gestisci la tua infrastruttura da una chat',
      heading: 'Bot Telegram per operazioni',
      description:
        "Monitora la salute del vault, interroga il grafo della conoscenza, controlla i log degli eventi e gestisci l'infrastruttura \u2014 tutto da Telegram. Funziona con qualsiasi provider LLM.",
      keyPoint: 'Compatibile con OpenAI, Anthropic, Ollama o senza LLM.',
      chatMessages: [
        { role: 'user', html: 'come va il vault?' },
        {
          role: 'bot',
          html: 'Tutto bene \u2014 <code>284</code> voci, sincronizzato 2 min fa. Tutto \u00e8 sano.',
        },
        { role: 'user', html: 'quali pattern stanno funzionando meglio questa settimana?' },
        {
          role: 'bot',
          html: 'I tuoi 3 migliori al momento:<br>1. semantic-tokens \u2014 <code>94</code> forza<br>2. component-structure \u2014 <code>87</code><br>3. error-boundaries \u2014 <code>82</code><br>I token stanno davvero funzionando per il team.',
        },
        {
          role: 'bot',
          html: 'Ehi \u2014 hai ancora 3 idee dal brainstorming di ieri che non sono state elaborate. Vuoi passarle in rassegna?',
        },
        { role: 'user', html: 's\u00ec, qual \u00e8 la prima?' },
        {
          role: 'bot',
          html: 'Rileva automaticamente voci del vault stantie pi\u00f9 vecchie di 90 giorni. Penso che questa sia solida \u2014 potrebbe diventare un elemento della roadmap per il pipeline di pulizia. Vuoi che la scriva?',
        },
      ],
      codeComment: '# Query strutturate degli eventi (JSONL)',
      codeOutput: `<span class="prompt">$</span> grep <span class="val">'"tool_call"'</span> events-*.jsonl \\
  | jq <span class="arg">-r .tool</span> | sort | uniq -c | sort -rn

  42 soleri_validate_component_code
  28 soleri_vault_search
  15 soleri_check_contrast`,
    },
  },
};
