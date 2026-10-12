const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('index.html');
const script = read('script.js');
const readmeJa = read('README.md');
const readmeEn = read('README.en.md');

test('CSP avoids unsafe inline execution and ineffective security-header meta tags', () => {
  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /unsafe-inline|unsafe-eval/);
  assert.doesNotMatch(html, /http-equiv="(?:X-Content-Type-Options|X-Frame-Options)"/i);
});

test('external blank-target links use rel protections', () => {
  const links = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)].map((match) => match[0]);
  assert.ok(links.length > 0);
  for (const link of links) assert.match(link, /rel="[^"]*noopener[^"]*noreferrer[^"]*"/i);
});

test('the interface exposes complete localization hooks', () => {
  assert.match(html, /data-i18n-placeholder="customWordsPlaceholder"/);
  assert.match(html, /data-i18n-title="switchLanguage"/);
  assert.match(html, /data-i18n-aria-label="dirRight"/);
  assert.match(script, /document\.documentElement\.lang = currentLang/);
  assert.match(script, /renderStatus\(\);/);
  for (const id of ['result-filter-word', 'result-filter-direction', 'result-filter-min-length', 'result-sort', 'btn-export-json', 'btn-export-csv', 'hit-detail', 'path-steps']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(script, /renderFilteredView\(\)/);
  assert.match(script, /serializeResultsJson/);
  assert.match(script, /serializeResultsCsv/);
});

test('user-facing DOM rendering does not use innerHTML', () => {
  assert.doesNotMatch(script, /\.innerHTML\s*=/);
  assert.match(script, /\.textContent\s*=/);
});

test('help modal and result table include keyboard and dialog support', () => {
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(script, /event\.key === 'Enter' \|\| event\.key === ' '/);
  assert.match(script, /trapModalFocus/);
});

test('Japanese and English documentation state limits and limitations', () => {
  for (const content of [readmeJa, readmeEn]) {
    assert.match(content, /20,000/);
    assert.match(content, /5,000/);
    assert.match(content, /README\.en\.md|README\.md/);
  }
  assert.match(readmeJa, /証明するものではありません/);
  assert.match(readmeEn, /does not prove/);
  assert.match(readmeJa, /入力した全文は含/);
  assert.match(readmeEn, /full input text/);
  assert.ok(fs.existsSync(path.join(root, 'assets', 'screenshot.png')));
  assert.ok(fs.existsSync(path.join(root, 'assets', 'en', 'screenshot.png')));
});
