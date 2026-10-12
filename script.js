'use strict';

const Core = window.StegoGridCore;
const { LIMITS, DIRECTIONS } = Core;
const COLOR_PALETTE_SIZE = 12;

const TRANSLATIONS = {
  ja: {
    subtitle: '文字グリッドから英単語を全8方向で探索', presetSelect: '-- プリセット --',
    presetHorizontal: '→↓ 横・縦方向', presetDiagonal1: '↘↖ 斜め（右下・左上）', presetDiagonal2: '↙↗ 斜め（左下・右上）',
    gridTextLabel: 'グリッドテキスト（複数行）', gridTextPlaceholder: 'ここにテキストを貼り付けてください...\n各行がグリッドの1行になります。',
    customWordsLabel: '探索単語（1行1語またはカンマ区切り）', customWordsPlaceholder: 'SECRET, HIDDEN, MESSAGE',
    options: 'オプション', removeEmptyLines: '空行を除去', removeSpaces: '横方向の空白を除去',
    useCommonWords: '代表50語を使用', useCustomWords: '指定単語を使用', uppercaseNormalization: '大文字に正規化',
    nonLettersAsBlocks: '非英字をブロック扱い', blocksAlwaysOn: '非英字をブロック扱い（常に有効）', directions: '探索方向',
    dirRight: '右方向', dirLeft: '左方向', dirDown: '下方向', dirUp: '上方向', dirDownRight: '右下方向', dirUpLeft: '左上方向', dirDownLeft: '左下方向', dirUpRight: '右上方向',
    analyze: '解析', clear: 'クリア', hits: 'ヒット数', uniqueWords: 'ユニーク語', grid: 'グリッド', results: '結果一覧',
    word: '単語', dir: '方向', start: '開始', end: '終了', len: '長さ', helpTitle: 'ヘルプ', closeHelp: 'ヘルプを閉じる', switchLanguage: '英語に切り替える',
    footerRepo: 'GitHubリポジトリはこちら', msgEnterText: 'グリッドテキストを入力してください。',
    msgNoDictionary: '有効な探索語がありません。代表50語を有効にするか、3文字以上のASCII英字だけで単語を追加してください。',
    msgNoDirection: '少なくとも1つの探索方向を有効にしてください。', msgParseError: '入力からグリッドを構築できませんでした。',
    msgNoWords: '選択した条件では単語が見つかりませんでした。', msgLoaded: '読み込み完了: {desc}',
    msgTooManyRows: '行数が上限を超えています（{count}行、上限{limit}行）。解析は実行していません。',
    msgTooManyColumns: '列数が上限を超えています（{count}列、上限{limit}列）。解析は実行していません。',
    msgTooManyCells: 'グリッドが上限を超えています（{count}セル、上限{limit}セル）。解析は実行していません。',
    msgTooManyWords: '指定単語が多すぎます（{count}語、上限{limit}語）。解析は実行していません。',
    msgWordTooLong: '指定単語「{word}」が長すぎます（{count}文字、上限{limit}文字）。解析は実行していません。',
    msgTruncated: '結果が{limit}件に達したため、そこで表示を停止しました。条件を絞って再解析してください。',
    resultRowLabel: '{word}、{direction}、{start}から{end}', limitNote: '上限: 20,000セル、500行、500列、指定語500件、語長100文字、結果5,000件。',
    caveat: '一致は指定した文字列の存在を示すだけです。隠しメッセージ、作者の意図、ステガノグラフィーの存在を証明しません。短い語は偶然一致しやすくなります。'
  },
  en: {
    subtitle: 'Search text grids for English words in all 8 directions', presetSelect: '-- Presets --',
    presetHorizontal: '→↓ Horizontal / vertical', presetDiagonal1: '↘↖ Diagonal (down-right / up-left)', presetDiagonal2: '↙↗ Diagonal (down-left / up-right)',
    gridTextLabel: 'Grid text (multi-line)', gridTextPlaceholder: 'Paste text here...\nEach line becomes one grid row.',
    customWordsLabel: 'Search words (one per line or comma-separated)', customWordsPlaceholder: 'SECRET, HIDDEN, MESSAGE',
    options: 'Options', removeEmptyLines: 'Remove empty lines', removeSpaces: 'Remove horizontal whitespace',
    useCommonWords: 'Use 50 common words', useCustomWords: 'Use custom words', uppercaseNormalization: 'Normalize to uppercase',
    nonLettersAsBlocks: 'Treat non-letters as blocks', blocksAlwaysOn: 'Treat non-letters as blocks (always enabled)', directions: 'Search directions',
    dirRight: 'Right', dirLeft: 'Left', dirDown: 'Down', dirUp: 'Up', dirDownRight: 'Down-right', dirUpLeft: 'Up-left', dirDownLeft: 'Down-left', dirUpRight: 'Up-right',
    analyze: 'Analyze', clear: 'Clear', hits: 'Hits', uniqueWords: 'Unique words', grid: 'Grid', results: 'Results',
    word: 'Word', dir: 'Direction', start: 'Start', end: 'End', len: 'Length', helpTitle: 'Help', closeHelp: 'Close help', switchLanguage: 'Switch to Japanese',
    footerRepo: 'GitHub repository', msgEnterText: 'Enter grid text.',
    msgNoDictionary: 'There are no valid search words. Enable the common list or add words of at least three ASCII letters.',
    msgNoDirection: 'Enable at least one search direction.', msgParseError: 'The input could not be converted into a grid.',
    msgNoWords: 'No words were found with the selected conditions.', msgLoaded: 'Loaded: {desc}',
    msgTooManyRows: 'The row limit was exceeded ({count} rows; limit {limit}). No analysis was run.',
    msgTooManyColumns: 'The column limit was exceeded ({count} columns; limit {limit}). No analysis was run.',
    msgTooManyCells: 'The grid limit was exceeded ({count} cells; limit {limit}). No analysis was run.',
    msgTooManyWords: 'There are too many custom words ({count}; limit {limit}). No analysis was run.',
    msgWordTooLong: 'The custom word “{word}” is too long ({count} characters; limit {limit}). No analysis was run.',
    msgTruncated: 'Display stopped at {limit} results. Narrow the conditions and analyze again.',
    resultRowLabel: '{word}, {direction}, from {start} to {end}', limitNote: 'Limits: 20,000 cells, 500 rows, 500 columns, 500 custom words, 100 characters per word, and 5,000 results.',
    caveat: 'A match only shows that the configured character sequence exists. It does not prove a hidden message, authorial intent, or steganography. Short words often match by chance.'
  }
};

const HELP_SECTIONS = {
  ja: [
    ['StegoGrid Explorerとは？', ['複数行テキストを文字グリッドとして扱い、ASCII英単語を横・縦・斜めの8方向から探す学習用ツールです。'], []],
    ['基本的な使い方', [], ['グリッドテキストを入力します。', '必要なら探索単語と方向を指定します。', '「解析」を押すかCtrl+Enterを使います。', '結果行をクリックまたはEnter／Spaceで選ぶと経路を確認できます。']],
    ['処理規則', [], ['大文字化ONではグリッドと辞書を大文字へそろえます。OFFでは大小文字を区別します。', '空白除去は行を維持したままタブ・半角・全角などの横方向の空白を除去します。', 'ASCII英字以外は1コードポイントのブロックとなり、単語はそこをまたぎません。', TRANSLATIONS.ja.limitNote]],
    ['結果の限界', [TRANSLATIONS.ja.caveat], []],
    ['サンプル', ['プリセットは代表50語をOFF、指定単語をONにし、説明した語だけを教材として探索します。'], []]
  ],
  en: [
    ['What is StegoGrid Explorer?', ['This learning tool treats multi-line text as a character grid and searches for ASCII English words in eight horizontal, vertical, and diagonal directions.'], []],
    ['Basic usage', [], ['Enter grid text.', 'Choose search words and directions if needed.', 'Select Analyze or press Ctrl+Enter.', 'Click a result row, or use Enter/Space, to inspect its path.']],
    ['Processing rules', [], ['With uppercase normalization on, the grid and dictionary are converted to uppercase. With it off, matching is case-sensitive.', 'Whitespace removal keeps line boundaries while removing tabs, regular spaces, full-width spaces, and other horizontal whitespace.', 'Every non-ASCII-letter code point is one blocking cell, and words cannot cross it.', TRANSLATIONS.en.limitNote]],
    ['Limitations', [TRANSLATIONS.en.caveat], []],
    ['Samples', ['A preset disables the common list and enables its custom words so that only the documented teaching targets are searched.'], []]
  ]
};

const PRESETS = {
  horizontal: {
    grid: 'THEXOPEN\nXCODEXXX\nXXFINDXX\nXXWORDXX\nSEEKHIDE\nDATAREAD',
    customWords: 'THE\nOPEN\nCODE\nFIND\nWORD\nSEEK\nHIDE\nDATA\nREAD',
    description: { ja: 'THE→、OPEN→、CODE→、FIND→、WORD→、SEEK→、HIDE→、DATA→、READ→', en: 'THE→, OPEN→, CODE→, FIND→, WORD→, SEEK→, HIDE→, DATA→, READ→' }
  },
  diagonal1: {
    grid: 'CXXXXXXX\nXOXXXXXX\nXXDXXXXX\nXXXEXXXX\nXXXXHXXX\nXXXXXIXX\nXXXXXXDX\nXXXXXXXE',
    customWords: 'CODE\nHIDE',
    description: { ja: 'CODE↘（1,1→4,4）、HIDE↘（5,5→8,8）', en: 'CODE↘ (1,1→4,4), HIDE↘ (5,5→8,8)' }
  },
  diagonal2: {
    grid: 'XXXXXXXE\nXXXXXXDX\nXXXXXOXX\nXXXXCXXX\nXXXYXXXX\nXXEXXXXX\nXKXXXXXX\nXXXXXXXX',
    customWords: 'CODE\nKEY',
    description: { ja: 'CODE↗（4,5→1,8）、KEY↗（7,2→5,4）', en: 'CODE↗ (4,5→1,8), KEY↗ (7,2→5,4)' }
  }
};

const elements = {
  gridInput: document.getElementById('grid-input'), customWords: document.getElementById('custom-words'),
  optCommon: document.getElementById('opt-common'), optCustom: document.getElementById('opt-custom'), optUppercase: document.getElementById('opt-uppercase'),
  optRemoveEmptyLines: document.getElementById('opt-remove-empty-lines'), optRemoveSpaces: document.getElementById('opt-remove-spaces'),
  btnAnalyze: document.getElementById('btn-analyze'), btnClear: document.getElementById('btn-clear'), btnLang: document.getElementById('btn-lang'), btnHelp: document.getElementById('btn-help'),
  helpModal: document.getElementById('help-modal'), helpContent: document.getElementById('help-content'), btnModalClose: document.getElementById('btn-modal-close'), modalOverlay: document.querySelector('.modal-overlay'),
  presetSelect: document.getElementById('preset-select'), messageArea: document.getElementById('message-area'), stats: document.getElementById('stats'),
  statHits: document.getElementById('stat-hits'), statUnique: document.getElementById('stat-unique'), statGrid: document.getElementById('stat-grid'),
  gridContainer: document.getElementById('grid-container'), resultsSection: document.getElementById('results-section'), resultsBody: document.getElementById('results-body'),
  directionCheckboxes: Object.fromEntries(Object.keys(DIRECTIONS).map((id) => [id, document.getElementById(`dir-${id.toLowerCase()}`)]))
};

let currentLang = 'ja';
let currentHits = [];
let focusedHitId = null;
let lastStatus = null;
let returnFocusElement = null;

function t(key, replacements = {}) {
  let text = TRANSLATIONS[currentLang][key] || TRANSLATIONS.en[key] || key;
  for (const [name, value] of Object.entries(replacements)) text = text.replace(`{${name}}`, String(value));
  return text;
}

function renderHelp() {
  elements.helpContent.replaceChildren();
  for (const [heading, paragraphs, items] of HELP_SECTIONS[currentLang]) {
    const h3 = document.createElement('h3');
    h3.textContent = heading;
    elements.helpContent.appendChild(h3);
    for (const text of paragraphs) {
      const p = document.createElement('p');
      p.textContent = text;
      elements.helpContent.appendChild(p);
    }
    if (items.length) {
      const ul = document.createElement('ul');
      for (const text of items) {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      }
      elements.helpContent.appendChild(ul);
    }
  }
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-title]').forEach((element) => { element.title = t(element.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => { element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel)); });
  document.title = currentLang === 'ja' ? 'StegoGrid Explorer - 文字グリッド探索ツール' : 'StegoGrid Explorer - Grid Word Search Tool';
  document.getElementById('lang-label').textContent = currentLang === 'ja' ? 'EN' : 'JA';
  renderHelp();
  renderStatus();
  renderResults(currentHits);
}

function setStatus(key, type = 'info', replacements = {}) {
  lastStatus = key ? { key, type, replacements } : null;
  renderStatus();
}

function renderStatus() {
  elements.messageArea.replaceChildren();
  if (!lastStatus) return;
  const message = document.createElement('div');
  message.className = `message message-${lastStatus.type}`;
  const replacements = { ...lastStatus.replacements };
  if (lastStatus.presetId) replacements.desc = PRESETS[lastStatus.presetId].description[currentLang];
  message.textContent = t(lastStatus.key, replacements);
  elements.messageArea.appendChild(message);
}

function toggleLanguage() {
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('stegogrid-lang', currentLang);
  applyTranslations();
}

function getFocusableModalElements() {
  return Array.from(elements.helpModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
}

function openHelpModal() {
  returnFocusElement = document.activeElement;
  elements.helpModal.classList.remove('hidden');
  elements.helpModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  elements.btnModalClose.focus();
}

function closeHelpModal() {
  elements.helpModal.classList.add('hidden');
  elements.helpModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (returnFocusElement) returnFocusElement.focus();
}

function trapModalFocus(event) {
  if (event.key !== 'Tab' || elements.helpModal.classList.contains('hidden')) return;
  const focusable = getFocusableModalElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

function enabledDirections() {
  return Object.entries(elements.directionCheckboxes).filter(([, checkbox]) => checkbox.checked).map(([id]) => DIRECTIONS[id]);
}

function clearOutput() {
  elements.gridContainer.replaceChildren();
  elements.resultsBody.replaceChildren();
  elements.resultsSection.classList.add('hidden');
  elements.stats.classList.add('hidden');
  currentHits = [];
  focusedHitId = null;
}

function renderGrid(grid) {
  elements.gridContainer.replaceChildren();
  const gridElement = document.createElement('div');
  gridElement.className = 'grid';
  grid.forEach((row, r) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'grid-row';
    row.forEach((cell, c) => {
      const cellElement = document.createElement('div');
      cellElement.className = `grid-cell${cell.type === 'block' ? ' block' : ''}`;
      cellElement.dataset.r = r;
      cellElement.dataset.c = c;
      if (cell.type === 'letter') cellElement.textContent = cell.char;
      rowElement.appendChild(cellElement);
    });
    gridElement.appendChild(rowElement);
  });
  elements.gridContainer.appendChild(gridElement);
}

function applyHighlights(hits) {
  const byCell = new Map();
  hits.forEach((hit) => hit.path.forEach(({ r, c }) => {
    const key = `${r},${c}`;
    if (!byCell.has(key)) byCell.set(key, []);
    byCell.get(key).push(hit);
  }));
  for (const [key, hitList] of byCell) {
    const [r, c] = key.split(',');
    const cell = elements.gridContainer.querySelector(`.grid-cell[data-r="${r}"][data-c="${c}"]`);
    if (!cell) continue;
    cell.classList.add(`hl-${hitList[hitList.length - 1].colorIndex}`);
    if (hitList.length > 1) cell.dataset.overlap = 'true';
  }
}

function coordinateText(coord) {
  return `(${coord.r + 1}, ${coord.c + 1})`;
}

function renderResults(hits) {
  elements.resultsBody.replaceChildren();
  if (!hits.length) { elements.resultsSection.classList.add('hidden'); return; }
  elements.resultsSection.classList.remove('hidden');
  hits.forEach((hit, index) => {
    const row = document.createElement('tr');
    row.dataset.hitId = hit.id;
    row.tabIndex = 0;
    row.setAttribute('aria-label', t('resultRowLabel', { word: hit.word, direction: t(`dir${directionKey(hit.direction)}`), start: coordinateText(hit.start), end: coordinateText(hit.end) }));
    const numberCell = document.createElement('td');
    const indicator = document.createElement('span');
    indicator.className = `color-indicator hl-${hit.colorIndex}`;
    indicator.setAttribute('aria-hidden', 'true');
    numberCell.append(indicator, document.createTextNode(String(index + 1)));
    row.appendChild(numberCell);
    [hit.word, DIRECTIONS[hit.direction].arrow, coordinateText(hit.start), coordinateText(hit.end), String(hit.length)].forEach((value, cellIndex) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      if (cellIndex === 0) cell.className = 'word-cell';
      if (cellIndex === 1) cell.className = 'dir-cell';
      row.appendChild(cell);
    });
    row.addEventListener('click', () => toggleHitFocus(hit.id));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleHitFocus(hit.id); }
    });
    elements.resultsBody.appendChild(row);
  });
  if (focusedHitId) applyFocus(focusedHitId);
}

function directionKey(id) {
  return ({ R: 'Right', L: 'Left', D: 'Down', U: 'Up', DR: 'DownRight', UL: 'UpLeft', DL: 'DownLeft', UR: 'UpRight' })[id];
}

function updateStats(hits, height, width) {
  elements.statHits.textContent = String(hits.length);
  elements.statUnique.textContent = String(new Set(hits.map((hit) => hit.word)).size);
  elements.statGrid.textContent = `${height}×${width}`;
  elements.stats.classList.remove('hidden');
}

function toggleHitFocus(hitId) {
  if (focusedHitId === hitId) clearFocus(); else applyFocus(hitId);
}

function applyFocus(hitId) {
  const hit = currentHits.find((candidate) => candidate.id === hitId);
  if (!hit) return;
  focusedHitId = hitId;
  elements.gridContainer.querySelectorAll('.grid-cell').forEach((cell) => cell.classList.add('dimmed'));
  hit.path.forEach(({ r, c }) => {
    const cell = elements.gridContainer.querySelector(`.grid-cell[data-r="${r}"][data-c="${c}"]`);
    if (cell) cell.classList.remove('dimmed');
  });
  elements.resultsBody.querySelectorAll('tr').forEach((row) => {
    row.classList.toggle('selected', row.dataset.hitId === hitId);
    row.classList.toggle('dimmed', row.dataset.hitId !== hitId);
    row.setAttribute('aria-selected', row.dataset.hitId === hitId ? 'true' : 'false');
  });
}

function clearFocus() {
  focusedHitId = null;
  elements.gridContainer.querySelectorAll('.grid-cell').forEach((cell) => cell.classList.remove('dimmed'));
  elements.resultsBody.querySelectorAll('tr').forEach((row) => { row.classList.remove('selected', 'dimmed'); row.removeAttribute('aria-selected'); });
}

function errorMessage(error) {
  const map = { tooManyRows: 'msgTooManyRows', tooManyColumns: 'msgTooManyColumns', tooManyCells: 'msgTooManyCells', tooManyWords: 'msgTooManyWords', wordTooLong: 'msgWordTooLong' };
  return { key: map[error.code] || 'msgParseError', details: error.details || {} };
}

function analyze() {
  setStatus(null);
  clearFocus();
  if (!elements.gridInput.value.trim()) { clearOutput(); setStatus('msgEnterText', 'error'); return; }
  const directions = enabledDirections();
  if (!directions.length) { clearOutput(); setStatus('msgNoDirection', 'error'); return; }
  try {
    const text = Core.preprocessText(elements.gridInput.value, { removeEmptyLines: elements.optRemoveEmptyLines.checked, removeSpaces: elements.optRemoveSpaces.checked });
    const gridInfo = Core.buildGrid(text, elements.optUppercase.checked);
    if (!gridInfo.width || !gridInfo.height) { clearOutput(); setStatus('msgParseError', 'error'); return; }
    const dictionary = Core.buildDictionary({ useCommon: elements.optCommon.checked, useCustom: elements.optCustom.checked, customText: elements.customWords.value, uppercase: elements.optUppercase.checked });
    if (!dictionary.length) { clearOutput(); setStatus('msgNoDictionary', 'error'); return; }
    const result = Core.searchGrid(gridInfo, dictionary, directions);
    currentHits = result.hits.map((hit, index) => ({ ...hit, id: `hit-${index}`, colorIndex: index % COLOR_PALETTE_SIZE }));
    renderGrid(gridInfo.grid);
    applyHighlights(currentHits);
    renderResults(currentHits);
    updateStats(currentHits, gridInfo.height, gridInfo.width);
    if (result.truncated) setStatus('msgTruncated', 'warning', { limit: LIMITS.maxResults });
    else if (!currentHits.length) setStatus('msgNoWords');
  } catch (error) {
    clearOutput();
    const message = errorMessage(error);
    setStatus(message.key, 'error', message.details);
  }
}

function clearAll() {
  elements.gridInput.value = '';
  elements.customWords.value = '';
  elements.presetSelect.value = '';
  clearOutput();
  setStatus(null);
}

function loadPreset(id) {
  const preset = PRESETS[id];
  if (!preset) return;
  elements.gridInput.value = preset.grid;
  elements.customWords.value = preset.customWords;
  elements.optCommon.checked = false;
  elements.optCustom.checked = true;
  elements.optUppercase.checked = true;
  clearOutput();
  setStatus('msgLoaded', 'info', { desc: preset.description[currentLang] });
  lastStatus.presetId = id;
}

elements.btnAnalyze.addEventListener('click', analyze);
elements.btnClear.addEventListener('click', clearAll);
elements.btnLang.addEventListener('click', toggleLanguage);
elements.btnHelp.addEventListener('click', openHelpModal);
elements.btnModalClose.addEventListener('click', closeHelpModal);
elements.modalOverlay.addEventListener('click', closeHelpModal);
elements.presetSelect.addEventListener('change', (event) => { if (event.target.value) loadPreset(event.target.value); event.target.value = ''; });
document.addEventListener('keydown', (event) => {
  trapModalFocus(event);
  if (event.key === 'Escape' && !elements.helpModal.classList.contains('hidden')) closeHelpModal();
  else if (event.key === 'Enter' && event.ctrlKey && elements.helpModal.classList.contains('hidden')) { event.preventDefault(); analyze(); }
});

(function init() {
  const saved = localStorage.getItem('stegogrid-lang');
  if (saved === 'ja' || saved === 'en') currentLang = saved;
  applyTranslations();
})();
