#!/usr/bin/env node
/**
 * IndexNow — tells Bing (and Yandex, Seznam, Naver) that pages changed, instead
 * of waiting to be crawled. Google does not participate in the protocol.
 *
 * Run it AFTER a deploy is live: the endpoint fetches the key file from the
 * site to authenticate, so submitting before the deploy lands fails with 403.
 *
 *   node tools/indexnow.mjs                        # every URL in sitemap.xml
 *   node tools/indexnow.mjs /alternatives /contact # only these paths
 *   node tools/indexnow.mjs --dry-run              # print, submit nothing
 *
 * Only submit URLs that actually changed. Blasting the whole sitemap on every
 * deploy is what gets a host rate-limited and, eventually, ignored.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = 'www.my-comind.com';
const KEY = 'f390635bb055498a977e2830cc6bb3bb';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const paths = args.filter(a => !a.startsWith('--'));

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

// Git Bash on Windows rewrites a leading "/alternatives" into
// "C:/Program Files/.../alternatives" before node ever sees it, which would
// otherwise be submitted as a real (nonsense) URL on the right host.
const mangled = paths.filter(p => !p.startsWith('http') && /^[A-Za-z]:[\\/]/.test(p));
if (mangled.length) {
  console.error(
    `These arguments were rewritten by the shell into Windows paths:\n  ${mangled.join('\n  ')}\n\n` +
    `Run it from PowerShell, or drop the leading slash:\n` +
    `  node tools/indexnow.mjs alternatives contact`
  );
  process.exit(1);
}

const urlList = paths.length
  ? paths.map(p => (p.startsWith('http') ? p : ORIGIN + (p.startsWith('/') ? p : '/' + p)))
  : urlsFromSitemap();

// The API rejects the whole batch (422) if a single URL is off-host.
const offHost = urlList.filter(u => new URL(u).host !== HOST);
if (offHost.length) {
  console.error(`Refusing to submit — these are not on ${HOST}:\n  ${offHost.join('\n  ')}`);
  process.exit(1);
}

console.log(`${urlList.length} URL(s) for ${HOST}:`);
urlList.forEach(u => console.log('  ' + u));

if (dryRun) {
  console.log('\n--dry-run: nothing submitted.');
  process.exit(0);
}

// The key file must be reachable before submitting, or the endpoint 403s.
const keyUrl = `${ORIGIN}/${KEY}.txt`;
const keyRes = await fetch(keyUrl).catch(() => null);
const keyBody = keyRes && keyRes.ok ? (await keyRes.text()).trim() : null;

if (keyBody !== KEY) {
  console.error(
    `\nKey file check failed at ${keyUrl}\n` +
    `  status: ${keyRes ? keyRes.status : 'unreachable'}\n` +
    `  body:   ${keyBody === null ? '(none)' : JSON.stringify(keyBody)}\n` +
    `  wanted: ${JSON.stringify(KEY)}\n\n` +
    `Deploy the key file first — submitting now would just be rejected.`
  );
  process.exit(1);
}
console.log(`\nKey file OK at ${keyUrl}`);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: keyUrl, urlList }),
});

const explain = {
  200: 'Accepted — URLs submitted.',
  202: 'Accepted — URLs received, key validation pending.',
  400: 'Bad request — malformed payload.',
  403: 'Forbidden — key file not valid or not reachable.',
  422: 'Unprocessable — a URL does not belong to this host, or the key does not match.',
  429: 'Too many requests — slow down; you are submitting far too often.',
};

console.log(`\nIndexNow responded ${res.status}: ${explain[res.status] || 'unexpected status'}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
