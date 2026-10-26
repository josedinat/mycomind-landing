#!/usr/bin/env node
/**
 * build-faq.mjs — writes faq/index.html from the GROUPS table below, with the
 * FAQPage JSON-LD generated from the same text (Google requires the markup to
 * match what is visible, so the two must never be edited separately).
 *
 *   node tools/build-faq.mjs && node tools/sync-chrome.mjs
 *
 * Organized by the doubts people have BEFORE signing up, not by feature.
 * Every answer must be true today — check the product, not the roadmap.
 * Data location wording must match /privacy.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const GROUPS = [
  { title: 'Privacy and your data', icon: 'fa-lock', items: [
    ['Is my data used to train AI models?',
     'No. Your content is processed only to serve you and is never used to train AI models — ours or anyone else’s.'],
    ['Who can see what I capture?',
     'Only you. Your memory is private by default. Nothing reaches a team, a project or a program unless you share it there, one memory or one workspace at a time, and anything you share can be withdrawn.'],
    ['If my company or program pays for my seat, can they read my notes?',
     'No. Whoever manages the seats handles access and billing, and cannot read anyone’s memories. They only see what a person decides to share with them.'],
    ['Where is my data stored?',
     'On secure cloud servers in Canada and the United States, run by infrastructure partners with SOC 2 Type II and ISO 27001 certifications. Some services, including the AI models that read your content to answer you, process data in the United States. The <a href="/privacy">privacy policy</a> has the detail.'],
    ['Can I export or delete everything?',
     'Yes. In Settings → Security you can export all your data, or delete your account and everything in it.'],
  ]},
  { title: 'Getting started', icon: 'fa-play', items: [
    ['Do I need a credit card to try it?',
     'No. The free plan needs only an email, and it stays free for as long as it fits how you work.'],
    ['How long until it is useful?',
     'After your first two or three conversations on the same subject. The first one is just stored; from the second on, My-CoMind starts connecting them and you can ask where things stand.'],
    ['Do I have to tag or organize anything?',
     'No. Memories about the same subject gather on their own — no folders, no tags. When you follow many clients or people, you can give each one its own project so their stories never mix.'],
    ['Does it work on my phone?',
     'Yes, in your phone’s browser: note something after a visit or a meeting, and read a client’s page before the next one.'],
  ]},
  { title: 'Meetings and recording', icon: 'fa-microphone', items: [
    ['Do I have to record my conversations?',
     'No. Many people never record: they write or dictate two minutes after the conversation, and it works the same way. Nothing is recorded unless you start it.'],
    ['What about consent when I record?',
     'Recording is always started by you, and telling the other people — and getting their agreement — is your responsibility, as it is with any recorder. If you would rather not record, a short note afterwards works just as well.'],
    ['Does it work with the tools I already use?',
     'Yes. It records meetings itself, imports Microsoft Teams meetings and Fireflies transcripts on every plan, and a Windows app can capture calls from your computer. Imported meetings arrive as suggestions you approve first.'],
  ]},
  { title: 'Plans and billing', icon: 'fa-receipt', items: [
    ['What does the free plan include?',
     '30 credits a month to record, write and upload, a living page for every subject, questions about your own memory, and Microsoft Teams and Fireflies meetings. Reading everything already generated is always free.'],
    ['What are credits?',
     'How the AI work is measured, so you only pay for what you use. A recorded meeting costs by the minute; a note or a question costs a fraction of a credit. A busy month can be topped up with 100 credits for CA$6.'],
    ['Can I cancel any time?',
     'Yes, from the Credits page in the app. You go back to the free plan and keep your account and every memory.'],
    ['What if I leave the team or program that gave me access?',
     'You keep your account and your own memories, and drop back to the free plan. Only work you explicitly shared with the program can stay with it.'],
  ]},
  { title: 'Compared with what you use today', icon: 'fa-scale-balanced', items: [
    ['How is this different from a notes app or a meeting recorder?',
     'A notes app stores what you write and a recorder stores what was said. My-CoMind connects them over time — what was decided, what changed, what is still open — and answers your questions with the source attached. Full comparisons: <a href="/alternatives/notion">vs Notion</a> and <a href="/alternatives/fireflies">vs Fireflies.ai</a>.'],
    ['Is it a CRM?',
     'No. There are no pipelines and nothing to fill in. It keeps what never fits in a CRM’s fields: the reasons behind a decision, the promises you made, how a person or a project is changing.'],
    ['Who builds it?',
     'MY-COMIND INC., a company registered in Ontario, Canada, operating under PIPEDA and CASL. The product is live and ships updates often — see <a href="/release-notes">what’s new</a>.'],
  ]},
]

const strip = h => h.replace(/<[^>]+>/g, '')
const esc = s => s.replace(/"/g, '&quot;')
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const ld = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GROUPS.flatMap(g => g.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } }))),
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FAQ — Privacy, Recording, Plans and Getting Started | My-CoMind</title>
  <meta name="description" content="Straight answers before you sign up: who can see your data, whether it trains AI, where it is stored, recording and consent, credits, and cancelling.">
  <meta name="author" content="MY-COMIND INC.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.my-comind.com/faq">
  <meta property="og:title" content="My-CoMind FAQ">
  <meta property="og:description" content="Who can see your data, whether it trains AI, recording and consent, credits and cancelling.">
  <meta property="og:image" content="https://www.my-comind.com/og-image.png">
  <meta property="og:url" content="https://www.my-comind.com/faq">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="My-CoMind">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Generated by tools/build-faq.mjs — edit the GROUPS table there, not this file. -->
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2).replace(/^/gm, '  ')}
  </script>

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%230066CC' rx='20' width='100' height='100'/><text x='50' y='70' font-size='50' text-anchor='middle' fill='white' font-family='Arial'>M</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/assets/roles.css">
  <style>
    .q-hero { background: linear-gradient(160deg, #f0f6ff 0%, var(--white) 65%); padding: 56px 0 28px; text-align: center; }
    .q-hero h1 { font-family: 'Poppins', sans-serif; font-size: clamp(32px, 4.6vw, 50px); font-weight: 800; letter-spacing: -1px; margin-bottom: 12px; }
    .q-hero p { font-size: 18px; color: var(--text-muted); }
    .q-jump { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 24px; }
    .q-jump a { display: inline-flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 14px; border: 1px solid var(--gray-light); border-radius: 50px; background: #fff; color: var(--charcoal); font-size: 13.5px; font-weight: 600; text-decoration: none; }
    .q-jump a:hover { border-color: var(--blue); color: var(--blue); }
    .q-jump i { color: var(--blue); font-size: 12px; }
    .q-wrap { max-width: 820px; margin: 0 auto; padding: 24px 24px 72px; }
    .q-group { padding-top: 36px; scroll-margin-top: calc(var(--mc-header-h, 68px) + 16px); }
    .q-group h2 { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
    .q-group h2 i { color: var(--blue); font-size: 17px; }
    .faq-item .a a { color: var(--blue); }
    .q-strip { display: flex; flex-wrap: wrap; gap: 10px 22px; justify-content: center; margin-top: 18px; font-size: 14px; color: var(--text-muted); }
    .q-strip i { color: var(--green); margin-right: 6px; }
  </style>
  <script defer src="/_vercel/insights/script.js"></script>
  <link rel="stylesheet" href="/assets/site-chrome.css">
</head>
<body>

  <!-- SITE-HEADER:START (generated by tools/sync-chrome.mjs — edit partials/header.html) -->
<!-- SITE-HEADER:END -->

  <header class="q-hero">
    <div class="container">
      <h1>Straight answers</h1>
      <p>What people ask before they try it.</p>
      <div class="q-strip">
        <span><i class="fas fa-check-circle"></i>No credit card</span>
        <span><i class="fas fa-check-circle"></i>Private by default</span>
        <span><i class="fas fa-check-circle"></i>Never used to train AI</span>
        <span><i class="fas fa-check-circle"></i>Built in Canada</span>
        <span><i class="fas fa-check-circle"></i>Live product</span>
      </div>
      <nav class="q-jump" aria-label="FAQ sections">
${GROUPS.map(g => `        <a href="#${slug(g.title)}"><i class="fas ${g.icon}"></i>${g.title}</a>`).join('\n')}
      </nav>
    </div>
  </header>

  <main class="q-wrap">
${GROUPS.map(g => `    <section class="q-group" id="${slug(g.title)}">
      <h2><i class="fas ${g.icon}"></i>${g.title}</h2>
${g.items.map(([q, a]) => `      <details class="faq-item">
        <summary>${q}</summary>
        <div class="a">${a}</div>
      </details>`).join('\n')}
    </section>`).join('\n')}
    <p style="text-align:center;margin-top:44px;color:var(--text-muted)">Still have a question? <a href="/contact" style="color:var(--blue);font-weight:600">Talk to us →</a></p>
  </main>

  <section class="cta">
    <h2>See it with your own conversations</h2>
    <p>Free plan, no credit card.</p>
    <a href="https://app.my-comind.com/" class="btn btn-white" target="_blank" rel="noopener">Get Started Free <i class="fas fa-arrow-right"></i></a>
  </section>

  <!-- SITE-FOOTER:START (generated by tools/sync-chrome.mjs — edit partials/footer.html) -->
<!-- SITE-FOOTER:END -->

  <script src="/assets/site-chrome.js" defer></script>
</body>
</html>
`
fs.mkdirSync(path.join(ROOT, 'faq'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'faq/index.html'), html)
console.log('wrote faq/index.html,', ld.mainEntity.length, 'questions')
