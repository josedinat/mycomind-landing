#!/usr/bin/env node
/**
 * build-role-pages.mjs — writes every /for/<role> page from the ROLES table below.
 *
 *   node tools/build-role-pages.mjs && node tools/sync-chrome.mjs
 *
 * Copy rule for these pages: the screen explains, the text only labels it. A
 * title of a few words, one short line per step, a real screenshot per step.
 * A step's title is the person's reason (what they gain, what stops going
 * wrong), never a description of the product action; the line under it says how.
 * No feature lists, no FAQ, no paragraphs — that is what /features is for.
 *
 * Every screenshot in for/images/ comes from the real product running on
 * fictional demo accounts (backend: scripts/seed-demo-personas.mjs). Never use a
 * screenshot of an answer that is wrong, even if the wrong part is small.
 *
 * Header and footer are left as empty markers; sync-chrome.mjs fills them.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.my-comind.com'

// Text is [en, pt]. A step's `img` is [file, width, height, alt]; `phone` and
// `tall` pick the narrow frames; a step without img shows `icon` instead.
const ROLES = [
  {
    slug: 'mentors', icon: 'fa-compass', name: ['Mentors', 'Mentores'],
    eyebrow: ['For mentors', 'Para mentores'],
    title: 'My-CoMind for Mentors — Know Where Each Mentee Left Off',
    description: 'Note each session, open the mentee’s page before the next one, and compare one topic across everyone you follow.',
    h1: ['Know where <span class="grad">each mentee left off.</span>', 'Saiba onde <span class="grad">cada mentorado parou.</span>'],
    sub: ['Note each session. Open their page before the next one.', 'Anote cada sessão. Abra a página dele antes da próxima.'],
    hero: ['mentors-workspace.jpg', 1400, 672, 'One mentee’s page: where things stand today'],
    steps: [
      { t: ['Give each session your full attention', 'Dê atenção total a cada sessão'], d: ['Note it after, or record it live. Nothing to write during.', 'Anote depois, ou grave ao vivo. Nada para escrever durante.'], img: ['mentors-capture.jpg', 780, 1688, 'A session note typed on the phone'], phone: true },
      { t: ['See who needs you most', 'Veja quem mais precisa de você'], d: ['One topic, one reading per mentee, side by side.', 'Um tema, uma leitura por mentorado, lado a lado.'], img: ['mentors-continuity.jpg', 1400, 812, 'One topic read across three mentees'] },
      { t: ['Catch who is stuck before they tell you', 'Perceba quem travou antes de ele contar'], d: ['Who moved, who stalled, what is still open.', 'Quem avançou, quem parou, o que segue aberto.'], img: ['mentors-continuity-2.jpg', 1400, 1092, 'The same topic for two other mentees'] },
    ],
    cta: ['No CRM to fill in.', 'Sem CRM para preencher.'],
  },
  {
    slug: 'founders', icon: 'fa-rocket', name: ['Founders', 'Fundadores'],
    eyebrow: ['For founders', 'Para fundadores'],
    title: 'My-CoMind for Founders — Remember Why You Decided',
    description: 'Every decision keeps its date and its reason. Months later, ask why you changed direction.',
    h1: ['Remember <span class="grad">why you decided.</span>', 'Lembre <span class="grad">por que você decidiu.</span>'],
    sub: ['Every decision keeps its date and its reason.', 'Cada decisão guarda a data e o motivo.'],
    hero: ['founders-decisions.jpg', 1400, 541, 'The decisions in effect, each with its date'],
    steps: [
      { t: ['Don’t lose the why', 'Não perca o porquê'], d: ['Note it the moment you decide. Two minutes after the call.', 'Anote na hora em que decidir. Dois minutos depois da call.'], img: ['founders-capture.jpg', 780, 1688, 'A decision typed on the phone'], phone: true },
      { t: ['Explain any pivot, months later', 'Explique qualquer mudança de rumo, meses depois'], ask: ['“Why did we change our target customer?”', '“Por que mudamos de cliente-alvo?”'], img: ['founders-ask.jpg', 756, 1240, 'The answer, with the memories it came from'], tall: true },
    ],
    cta: ['Your reasoning, kept.', 'Seu raciocínio, guardado.'],
  },
  {
    slug: 'project-managers', icon: 'fa-diagram-project', name: ['Project managers', 'Gestores de projeto'],
    eyebrow: ['For project managers', 'Para gestores de projeto'],
    title: 'My-CoMind for Project Managers — Know What Is Decided Right Now',
    description: 'Note each meeting. See only the decisions in effect, what changed and why, and ask instead of digging through notes.',
    h1: ['Know what’s <span class="grad">decided right now.</span>', 'Saiba o que <span class="grad">está valendo agora.</span>'],
    sub: ['Note each meeting. See what changed, and why.', 'Anote cada reunião. Veja o que mudou, e por quê.'],
    hero: ['pm-workspace.jpg', 1400, 672, 'One project’s page: where things stand today'],
    steps: [
      { t: ['Stop decisions getting lost after meetings', 'Decisão de reunião não se perde mais'], d: ['Note it right after, or record it live.', 'Anote logo depois, ou grave ao vivo.'], img: ['pm-capture.jpg', 780, 1688, 'A meeting note typed on the phone'], phone: true },
      { t: ['Know what is actually decided', 'Saiba o que de fato está decidido'], d: ['What changed drops out. What holds shows who and when.', 'O que mudou sai. O que vale mostra quem e quando.'], img: ['pm-decisions.jpg', 1400, 814, 'Decisions in effect, each with who and when'] },
      { t: ['Answer your team in seconds', 'Responda o time em segundos'], ask: ['“Is the billing cutover still on November 30?”', '“O cutover ainda é em 30 de novembro?”'], img: ['pm-ask.jpg', 756, 1180, 'The answer: the date moved, and why'], tall: true },
    ],
    cta: ['Stop rebuilding context.', 'Pare de remontar o contexto.'],
  },
  {
    slug: 'sales', icon: 'fa-store', name: ['Sales', 'Vendas'],
    eyebrow: ['For sales', 'Para vendas'],
    title: 'My-CoMind for Sales — Remember Every Customer',
    description: 'Talk after each visit, ask before the next one. What each customer bought, what they skipped, and why.',
    h1: ['Remember <span class="grad">every customer.</span>', 'Lembre de <span class="grad">cada cliente.</span>'],
    sub: ['Note it after the visit. Ask before the next one.', 'Anote depois da visita. Pergunte antes da próxima.'],
    hero: ['sales-workspace.jpg', 1400, 672, 'One store’s page: what sold, what is stuck and the next step'],
    steps: [
      { t: ['Keep the reason behind every no', 'Guarde o motivo de cada “não”'], d: ['Say it in the car after the visit. Two minutes, no forms.', 'Fale no carro depois da visita. Dois minutos, sem formulário.'], img: ['sales-capture.jpg', 780, 1688, 'A visit note typed on the phone'], phone: true },
      { t: ['Walk in already knowing the story', 'Entre já sabendo a história'], d: ['What sold, what is stuck and what you promised, per store.', 'O que vendeu, o que travou e o que você prometeu, por loja.'], img: ['sales-projects.jpg', 1400, 1033, 'One page per store'] },
      { t: ['Never get caught off guard', 'Nunca seja pego de surpresa'], ask: ['“Why didn’t Maple Corner reorder sparkling water?”', '“Por que o Maple Corner não pediu água com gás?”'], img: ['sales-ask.jpg', 756, 1240, 'The answer, taken from the visit notes'], tall: true },
    ],
    cta: ['Not a CRM. Nothing to fill in.', 'Não é CRM. Nada para preencher.'],
  },
  {
    slug: 'hr', icon: 'fa-people-group', name: ['HR & people', 'RH e pessoas'],
    eyebrow: ['For HR & people', 'Para RH e pessoas'],
    title: 'My-CoMind for HR — See How Each Person Grew',
    description: 'Note each feedback conversation and read six months of one person’s progress on one page. No scores; people decide.',
    h1: ['See how <span class="grad">each person grew.</span>', 'Veja como <span class="grad">cada pessoa evoluiu.</span>'],
    sub: ['Note each feedback. Read six months on one page.', 'Anote cada feedback. Leia seis meses numa página.'],
    hero: ['hr-workspace.jpg', 1400, 672, 'One person’s page: where things stand today'],
    steps: [
      { t: ['Feedback that doesn’t get lost', 'Feedback que não se perde'], d: ['Note it right after the conversation, while it is fresh.', 'Anote logo depois da conversa, enquanto está fresco.'], img: ['hr-capture.jpg', 780, 1688, 'A feedback note typed on the phone'], phone: true },
      { t: ['See real growth, not the last impression', 'Veja a evolução real, não a última impressão'], d: ['Six months of feedback in order, each point with its date.', 'Seis meses de feedback em ordem, cada ponto com data.'], img: ['hr-timeline.jpg', 1400, 1153, 'Six months of feedback for one person, in order'] },
      { t: ['Walk into the review prepared', 'Chegue preparado à avaliação'], ask: ['“How has Ana changed since April?”', '“Como a Ana mudou desde abril?”'], img: ['hr-ask.jpg', 756, 1060, 'The answer, with dates and sources'], tall: true },
    ],
    cta: ['No scores. You decide.', 'Sem notas. Quem decide é você.'],
  },
  {
    slug: 'therapists-coaches', icon: 'fa-hand-holding-heart', name: ['Therapists & coaches', 'Terapeutas e coaches'],
    eyebrow: ['For therapists & coaches', 'Para terapeutas e coaches'],
    title: 'My-CoMind for Therapists & Coaches — Pick Up Each Client’s Thread',
    description: 'A short note after each session; read the client’s journey before the next one. Private by default.',
    h1: ['Pick up <span class="grad">each client’s thread.</span>', 'Retome <span class="grad">o fio de cada cliente.</span>'],
    sub: ['A short note after each session. Read the journey before the next.', 'Uma nota curta depois de cada sessão. Leia o caminho antes da próxima.'],
    hero: ['care-workspace.jpg', 1400, 672, 'One client’s page: where things stand today'],
    steps: [
      { t: ['Be fully present in the session', 'Esteja inteiro na sessão'], d: ['Note it after, not during. Two minutes, initials only.', 'Anote depois, não durante. Dois minutos, só iniciais.'], img: ['care-capture.jpg', 780, 1688, 'A session note typed on the phone'], phone: true },
      { t: ['Start where the last session ended', 'Comece de onde a última sessão parou'], d: ['What you agreed, and how it went, on one page.', 'O que vocês combinaram, e como foi, numa página.'], img: ['care-timeline.jpg', 1400, 1196, 'One client’s sessions, in order'] },
      // Compared by theme and by what helped — never by diagnosis or medication:
      // a list of clients by condition reads as a clinical record and is the
      // first thing a practitioner would worry about.
      { t: ['Learn from what helped others', 'Aprenda com o que ajudou outros clientes'], d: ['Type “sleep” and see what worked with each client.', 'Digite “sono” e veja o que funcionou com cada um.'], img: ['care-compare.jpg', 1400, 1048, 'One theme read across three clients'] },
    ],
    cta: ['Private by default. Only you see it.', 'Privado por padrão. Só você vê.'],
  },
]

const L = ([en, pt]) => `<span data-l="en">${en}</span><span data-l="pt">${pt}</span>`

function step(s, i) {
  const n = i + 1
  const text = `
        <div>
          <div class="num">${n}</div>
          <h3>${L(s.t)}</h3>
          ${s.d ? `<p>${L(s.d)}</p>` : ''}${s.ask ? `<div class="ask">${L(s.ask)}</div>` : ''}
        </div>`
  const media = s.img
    ? `<figure class="shot${s.phone ? ' phone' : s.tall ? ' tall' : ''}"><img src="/for/images/${s.img[0]}" width="${s.img[1]}" height="${s.img[2]}" alt="${s.img[3]}" loading="lazy"></figure>`
    : `<div class="step-icon"><i class="fas ${s.icon}"></i></div>`
  return `
      <div class="step${n % 2 === 0 ? ' flip' : ''}">${text}
        ${media}
      </div>`
}

function page(r) {
  const others = ROLES.filter(o => o.slug !== r.slug)
    .map(o => `        <a href="/for/${o.slug}"><i class="fas ${o.icon}"></i>${L(o.name)}</a>`).join('\n')
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${r.title}</title>
  <meta name="description" content="${r.description}">
  <meta name="author" content="MY-COMIND INC.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}/for/${r.slug}">

  <meta property="og:title" content="${r.title}">
  <meta property="og:description" content="${r.sub[0]}">
  <meta property="og:image" content="${SITE}/for/images/${r.hero[0]}">
  <meta property="og:url" content="${SITE}/for/${r.slug}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_CA">
  <meta property="og:locale:alternate" content="pt_BR">
  <meta property="og:site_name" content="My-CoMind">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Generated by tools/build-role-pages.mjs — edit the ROLES table there, not this file. -->
  <script>
    (function () {
      var q = new URLSearchParams(location.search).get('lang');
      var saved = null; try { saved = localStorage.getItem('mcm_site_lang'); } catch (e) {}
      var lang = (q === 'pt' || q === 'en') ? q : (saved || ((navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en'));
      if (lang === 'pt') { document.documentElement.classList.add('pt'); document.documentElement.lang = 'pt-BR'; }
    })();
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE}/" },
      { "@type": "ListItem", "position": 2, "name": "Who it's for", "item": "${SITE}/for" },
      { "@type": "ListItem", "position": 3, "name": "${r.name[0].replace('&', 'and')}", "item": "${SITE}/for/${r.slug}" }
    ]
  }
  </script>

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%230066CC' rx='20' width='100' height='100'/><text x='50' y='70' font-size='50' text-anchor='middle' fill='white' font-family='Arial'>M</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/assets/roles.css">
  <link rel="stylesheet" href="/assets/site-chrome.css">
</head>
<body>

  <!-- SITE-HEADER:START (generated by tools/sync-chrome.mjs — edit partials/header.html) -->
<!-- SITE-HEADER:END -->

  <header class="r-hero">
    <div class="container">
      <div class="crumb">
        <span><a href="/">${L(['Home', 'Início'])}</a> &nbsp;/&nbsp; <a href="/for">${L(["Who it's for", 'Para quem é'])}</a> &nbsp;/&nbsp; ${L(r.name)}</span>
        <div class="lang-switch" role="group" aria-label="Language / Idioma"><button type="button" data-set="en">English</button><button type="button" data-set="pt">Português</button></div>
      </div>
      <div class="r-hero-grid">
        <div>
          <div class="eyebrow"><i class="fas ${r.icon}"></i> ${L(r.eyebrow)}</div>
          <h1>${L(r.h1)}</h1>
          <p class="sub">${L(r.sub)}</p>
          <a href="https://app.my-comind.com/" class="btn btn-solid" target="_blank" rel="noopener">${L(['Start for free', 'Comece grátis'])} <i class="fas fa-arrow-right"></i></a>
        </div>
        <figure class="shot">
          <img src="/for/images/${r.hero[0]}" width="${r.hero[1]}" height="${r.hero[2]}" alt="${r.hero[3]}">
        </figure>
      </div>
    </div>
  </header>

  <section class="band alt">
    <div class="container">${r.steps.map(step).join('')}
    </div>
  </section>

  <section class="cta">
    <h2>${L(r.cta)}</h2>
    <p>${L(['Free plan, no credit card.', 'Plano gratuito, sem cartão.'])}</p>
    <a href="https://app.my-comind.com/" class="btn btn-white" target="_blank" rel="noopener">${L(['Start for free', 'Comece grátis'])} <i class="fas fa-arrow-right"></i></a>
  </section>

  <section class="other-roles">
    <div class="container">
      <div class="chips">
${others}
      </div>
    </div>
  </section>

  <!-- SITE-FOOTER:START (generated by tools/sync-chrome.mjs — edit partials/footer.html) -->
<!-- SITE-FOOTER:END -->

  <script>
    document.querySelectorAll('.lang-switch [data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        var pt = b.getAttribute('data-set') === 'pt';
        document.documentElement.classList.toggle('pt', pt);
        document.documentElement.lang = pt ? 'pt-BR' : 'en';
        try { localStorage.setItem('mcm_site_lang', pt ? 'pt' : 'en'); } catch (e) {}
      });
    });
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
  <script src="/assets/site-chrome.js" defer></script>
</body>
</html>
`
}

for (const r of ROLES) {
  for (const f of [r.hero, ...r.steps.map(s => s.img).filter(Boolean)]) {
    if (!fs.existsSync(path.join(ROOT, 'for/images', f[0]))) throw new Error(`${r.slug}: missing for/images/${f[0]}`)
  }
  fs.writeFileSync(path.join(ROOT, 'for', `${r.slug}.html`), page(r))
  console.log('wrote', `for/${r.slug}.html`)
}
