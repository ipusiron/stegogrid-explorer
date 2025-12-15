/**
 * StegoGrid Explorer - Hidden Word Search in Text Grids
 * Searches for words in all 8 directions within a character grid.
 */

// ============================================================
// Constants
// ============================================================

const COMMON_WORDS = [
  'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HAD',
  'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS',
  'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'WAY', 'WHO', 'BOY', 'DID',
  'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'KEY', 'CODE', 'WORD',
  'FIND', 'HIDE', 'TEXT', 'GRID', 'LINE', 'OPEN', 'READ', 'SEEK', 'TRUE', 'DATA'
];

const DIRECTIONS = {
  R:  { id: 'R',  dy: 0,  dx: 1,  arrow: '→', name: 'Right' },
  L:  { id: 'L',  dy: 0,  dx: -1, arrow: '←', name: 'Left' },
  D:  { id: 'D',  dy: 1,  dx: 0,  arrow: '↓', name: 'Down' },
  U:  { id: 'U',  dy: -1, dx: 0,  arrow: '↑', name: 'Up' },
  DR: { id: 'DR', dy: 1,  dx: 1,  arrow: '↘', name: 'Down-Right' },
  UL: { id: 'UL', dy: -1, dx: -1, arrow: '↖', name: 'Up-Left' },
  DL: { id: 'DL', dy: 1,  dx: -1, arrow: '↙', name: 'Down-Left' },
  UR: { id: 'UR', dy: -1, dx: 1,  arrow: '↗', name: 'Up-Right' }
};

const COLOR_PALETTE_SIZE = 12;

// ============================================================
// i18n - Internationalization
// ============================================================

const TRANSLATIONS = {
  ja: {
    subtitle: '文字グリッドから隠し単語を全8方向で探索',
    input: '入力',
    output: '出力',
    samplePresets: 'サンプルプリセット',
    presetSelect: '-- プリセット --',
    presetHorizontal: '横・縦方向',
    presetDiagonal1: '斜め（↘↖）',
    presetDiagonal2: '斜め（↙↗）',
    gridTextLabel: 'グリッドテキスト（複数行）',
    gridTextPlaceholder: 'ここにテキストを貼り付けてください...\n各行がグリッドの1行になります。',
    customWordsLabel: '探索単語（1行1語またはカンマ区切り）',
    options: 'オプション',
    preprocessing: '前処理',
    removeEmptyLines: '空行を除去',
    removeSpaces: '空白を除去',
    settings: '設定',
    useCommonWords: '代表50語を使用',
    useCustomWords: '指定単語を使用',
    uppercaseNormalization: '大文字に正規化',
    nonLettersAsBlocks: '非英字をブロック扱い',
    directions: '探索方向',
    dirRight: '右',
    dirLeft: '左',
    dirDown: '下',
    dirUp: '上',
    dirDownRight: '右下',
    dirUpLeft: '左上',
    dirDownLeft: '左下',
    dirUpRight: '右上',
    analyze: '解析',
    clear: 'クリア',
    hits: 'ヒット数',
    uniqueWords: 'ユニーク語',
    grid: 'グリッド',
    results: '結果一覧',
    word: '単語',
    dir: '方向',
    start: '開始',
    end: '終了',
    len: '長さ',
    helpTitle: 'ヘルプ',
    footerRepo: 'GitHubリポジトリはこちら',
    msgEnterText: 'グリッドテキストを入力してください。',
    msgNoDictionary: '辞書に有効な単語がありません。代表語を有効にするか、単語を追加してください。',
    msgNoDirection: '少なくとも1つの探索方向を有効にしてください。',
    msgParseError: '入力からグリッドを構築できませんでした。',
    msgLargeGrid: '警告: 大きなグリッド（{count}セル）です。解析に時間がかかる場合があります。',
    msgNoWords: 'グリッド内に単語が見つかりませんでした。',
    msgLoaded: '読み込み完了: {desc}'
  },
  en: {
    subtitle: 'Explore hidden words in text grids from all 8 directions',
    input: 'Input',
    output: 'Output',
    samplePresets: 'Sample Presets',
    presetSelect: '-- Presets --',
    presetHorizontal: 'Horizontal / Vertical',
    presetDiagonal1: 'Diagonal (DR/UL)',
    presetDiagonal2: 'Diagonal (DL/UR)',
    gridTextLabel: 'Grid Text (multi-line)',
    gridTextPlaceholder: 'Paste your text here...\nEach line becomes a row in the grid.',
    customWordsLabel: 'Custom Words (one per line or comma-separated)',
    options: 'Options',
    preprocessing: 'Pre-processing',
    removeEmptyLines: 'Remove empty lines',
    removeSpaces: 'Remove spaces',
    settings: 'Settings',
    useCommonWords: 'Use common 50 words',
    useCustomWords: 'Use custom words',
    uppercaseNormalization: 'Uppercase normalization',
    nonLettersAsBlocks: 'Non-letters as blocks',
    directions: 'Directions',
    dirRight: 'Right',
    dirLeft: 'Left',
    dirDown: 'Down',
    dirUp: 'Up',
    dirDownRight: 'Down-Right',
    dirUpLeft: 'Up-Left',
    dirDownLeft: 'Down-Left',
    dirUpRight: 'Up-Right',
    analyze: 'Analyze',
    clear: 'Clear',
    hits: 'Hits',
    uniqueWords: 'Unique words',
    grid: 'Grid',
    results: 'Results',
    word: 'Word',
    dir: 'Dir',
    start: 'Start',
    end: 'End',
    len: 'Len',
    helpTitle: 'Help',
    footerRepo: 'GitHub Repository',
    msgEnterText: 'Please enter grid text.',
    msgNoDictionary: 'No valid words in dictionary. Enable common words or add custom words.',
    msgNoDirection: 'Please enable at least one search direction.',
    msgParseError: 'Could not parse grid from input.',
    msgLargeGrid: 'Warning: Large grid ({count} cells). Analysis may be slow.',
    msgNoWords: 'No words found in the grid.',
    msgLoaded: 'Loaded: {desc}'
  }
};

const HELP_CONTENT = {
  ja: `
<h3>StegoGrid Explorerとは？</h3>
<p>複数行のテキストを「文字グリッド」として扱い、横・縦・斜めの全8方向から英単語を探索・可視化するツールです。隠しメッセージ（縦読み・斜め読み・逆読み）の発見に役立ちます。</p>

<h3>基本的な使い方</h3>
<ul>
  <li><strong>Step 1:</strong> 「グリッドテキスト」に複数行のテキストを貼り付けます</li>
  <li><strong>Step 2:</strong> 必要に応じて「探索単語」に検出したい単語を追加します</li>
  <li><strong>Step 3:</strong> 「解析」ボタンをクリック（または <span class="keyboard-hint">Ctrl+Enter</span>）</li>
  <li><strong>Step 4:</strong> グリッド上のハイライトと結果一覧を確認します</li>
</ul>

<h3>探索方向</h3>
<p>8方向すべてを同時に探索できます：</p>
<ul>
  <li>横方向: → （右）、← （左）</li>
  <li>縦方向: ↓ （下）、↑ （上）</li>
  <li>斜め方向: ↘ ↖ ↙ ↗</li>
</ul>

<h3>オプション説明</h3>
<ul>
  <li><strong>空行を除去:</strong> 空の行を削除してグリッドを詰めます</li>
  <li><strong>空白を除去:</strong> 各行の空白文字を削除します</li>
  <li><strong>代表50語を使用:</strong> THE, AND, CODE などの一般的な英単語を検索対象に含めます</li>
  <li><strong>非英字をブロック扱い:</strong> 空白や記号を「壁」として扱い、単語がそれを跨がないようにします</li>
</ul>

<h3>結果の見方</h3>
<ul>
  <li>見つかった単語はグリッド上で<strong>色分けハイライト</strong>されます</li>
  <li>結果一覧の行をクリックすると、その単語だけを<strong>フォーカス表示</strong>できます</li>
  <li>複数の単語が重なるセルは<strong>太い枠線</strong>で表示されます</li>
</ul>

<h3>活用例</h3>
<ul>
  <li><strong>ステガノグラフィー学習:</strong> 縦読み・斜め読みメッセージの作成と検証</li>
  <li><strong>CTF/パズル:</strong> 暗号文や格子配置の隠しメッセージ探索</li>
  <li><strong>教育:</strong> 単語探しゲームの作成・解析</li>
</ul>

<h3>サンプルで試す</h3>
<p>「サンプルプリセット」から3種類のサンプルを読み込めます。それぞれ異なる方向で単語がヒットするよう設計されています。</p>
`,
  en: `
<h3>What is StegoGrid Explorer?</h3>
<p>A tool that treats multi-line text as a "character grid" and searches for English words in all 8 directions (horizontal, vertical, diagonal). Useful for discovering hidden messages (vertical reading, diagonal reading, reverse reading).</p>

<h3>Basic Usage</h3>
<ul>
  <li><strong>Step 1:</strong> Paste multi-line text into "Grid Text"</li>
  <li><strong>Step 2:</strong> Optionally add words to detect in "Custom Words"</li>
  <li><strong>Step 3:</strong> Click "Analyze" (or press <span class="keyboard-hint">Ctrl+Enter</span>)</li>
  <li><strong>Step 4:</strong> Check the highlighted grid and results list</li>
</ul>

<h3>Search Directions</h3>
<p>All 8 directions can be searched simultaneously:</p>
<ul>
  <li>Horizontal: → (Right), ← (Left)</li>
  <li>Vertical: ↓ (Down), ↑ (Up)</li>
  <li>Diagonal: ↘ ↖ ↙ ↗</li>
</ul>

<h3>Options Explained</h3>
<ul>
  <li><strong>Remove empty lines:</strong> Removes blank lines to compact the grid</li>
  <li><strong>Remove spaces:</strong> Removes space characters from each line</li>
  <li><strong>Use common 50 words:</strong> Includes common English words like THE, AND, CODE in search</li>
  <li><strong>Non-letters as blocks:</strong> Treats spaces and symbols as "walls" that words cannot cross</li>
</ul>

<h3>Understanding Results</h3>
<ul>
  <li>Found words are <strong>color-highlighted</strong> on the grid</li>
  <li>Click a row in the results to <strong>focus</strong> on that word</li>
  <li>Cells where multiple words overlap have a <strong>thick border</strong></li>
</ul>

<h3>Use Cases</h3>
<ul>
  <li><strong>Steganography learning:</strong> Create and verify vertical/diagonal reading messages</li>
  <li><strong>CTF/Puzzles:</strong> Search for hidden messages in ciphers and grid arrangements</li>
  <li><strong>Education:</strong> Create and analyze word search games</li>
</ul>

<h3>Try with Samples</h3>
<p>Load one of 3 samples from "Sample Presets". Each is designed to hit words in different directions.</p>
`
};

let currentLang = 'ja';

function t(key, replacements = {}) {
  let text = TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });

  // Update page title
  document.title = currentLang === 'ja'
    ? 'StegoGrid Explorer - 文字グリッド探索ツール'
    : 'StegoGrid Explorer - Grid Word Search Tool';

  // Update language button label
  const langLabel = document.getElementById('lang-label');
  if (langLabel) {
    langLabel.textContent = currentLang === 'ja' ? 'EN' : 'JA';
  }

  // Update help content
  const helpContent = document.getElementById('help-content');
  if (helpContent) {
    helpContent.innerHTML = HELP_CONTENT[currentLang];
  }
}

function toggleLanguage() {
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('stegogrid-lang', currentLang);
  applyTranslations();
}

// ============================================================
// Sample Presets
// ============================================================

const PRESETS = {
  horizontal: {
    grid: `THEXOPEN
HCODEXXX
EXFINDXX
XXWORDXX
SEEKHIDE
DATAREAD`,
    customWords: 'OPEN\nFIND\nWORD\nSEEK\nDATA\nREAD',
    description: {
      ja: 'THE→, CODE↓, FIND→, WORD→, SEEK→, HIDE→, DATA→, READ→',
      en: 'THE→, CODE↓, FIND→, WORD→, SEEK→, HIDE→, DATA→, READ→'
    }
  },
  diagonal1: {
    grid: `CXXXXXXX
XOXXXXXX
XXDXXXXX
XXXEXXXX
XXXXHXXX
XXXXXIXX
XXXXXXDX
XXXXXXXE`,
    customWords: 'CODE\nHIDE',
    description: {
      ja: 'CODE↘ (1,1→4,4), HIDE↘ (5,5→8,8)',
      en: 'CODE↘ (1,1→4,4), HIDE↘ (5,5→8,8)'
    }
  },
  diagonal2: {
    grid: `XXXXXXXE
XXXXXXDX
XXXXXOXX
XXXXCXXX
XXXEXXXX
XXKXXXXX
XYXXXXXX
EXXXXXXX`,
    customWords: 'CODE\nKEY',
    description: {
      ja: 'CODE↗ (4,4→1,8), KEY↗ (7,1→5,3)',
      en: 'CODE↗ (4,4→1,8), KEY↗ (7,1→5,3)'
    }
  }
};

// ============================================================
// DOM Elements
// ============================================================

const elements = {
  gridInput: document.getElementById('grid-input'),
  customWords: document.getElementById('custom-words'),
  optCommon: document.getElementById('opt-common'),
  optCustom: document.getElementById('opt-custom'),
  optUppercase: document.getElementById('opt-uppercase'),
  optBlocks: document.getElementById('opt-blocks'),
  optRemoveEmptyLines: document.getElementById('opt-remove-empty-lines'),
  optRemoveSpaces: document.getElementById('opt-remove-spaces'),
  btnAnalyze: document.getElementById('btn-analyze'),
  btnClear: document.getElementById('btn-clear'),
  btnLang: document.getElementById('btn-lang'),
  btnHelp: document.getElementById('btn-help'),
  helpModal: document.getElementById('help-modal'),
  btnModalClose: document.getElementById('btn-modal-close'),
  modalOverlay: document.querySelector('.modal-overlay'),
  presetSelect: document.getElementById('preset-select'),
  messageArea: document.getElementById('message-area'),
  stats: document.getElementById('stats'),
  statHits: document.getElementById('stat-hits'),
  statUnique: document.getElementById('stat-unique'),
  statGrid: document.getElementById('stat-grid'),
  gridContainer: document.getElementById('grid-container'),
  resultsSection: document.getElementById('results-section'),
  resultsBody: document.getElementById('results-body'),
  directionCheckboxes: {
    R: document.getElementById('dir-r'),
    L: document.getElementById('dir-l'),
    D: document.getElementById('dir-d'),
    U: document.getElementById('dir-u'),
    DR: document.getElementById('dir-dr'),
    UL: document.getElementById('dir-ul'),
    DL: document.getElementById('dir-dl'),
    UR: document.getElementById('dir-ur')
  }
};

// ============================================================
// State
// ============================================================

let currentHits = [];
let focusedHitId = null;

// ============================================================
// Modal Functions
// ============================================================

function openHelpModal() {
  elements.helpModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
  elements.helpModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Escape HTML special characters to prevent XSS attacks
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function isLetter(char) {
  return /^[A-Za-z]$/.test(char);
}

function showMessage(text, type = 'info') {
  const validTypes = ['info', 'error', 'warning'];
  const safeType = validTypes.includes(type) ? type : 'info';
  const div = document.createElement('div');
  div.className = `message message-${safeType}`;
  div.textContent = text;
  elements.messageArea.innerHTML = '';
  elements.messageArea.appendChild(div);
}

function clearMessage() {
  elements.messageArea.innerHTML = '';
}

function getEnabledDirections() {
  const enabled = [];
  for (const [id, checkbox] of Object.entries(elements.directionCheckboxes)) {
    if (checkbox.checked) {
      enabled.push(DIRECTIONS[id]);
    }
  }
  return enabled;
}

// ============================================================
// Pre-processing
// ============================================================

function preprocessText(text, removeEmptyLines, removeSpaces) {
  let lines = text.split('\n');

  if (removeEmptyLines) {
    lines = lines.filter(line => line.trim().length > 0);
  }

  if (removeSpaces) {
    lines = lines.map(line => line.replace(/ /g, ''));
  }

  return lines.join('\n');
}

// ============================================================
// Grid Building
// ============================================================

function buildGrid(text, uppercase) {
  const lines = text.split('\n');
  const height = lines.length;
  let width = 0;

  for (const line of lines) {
    if (line.length > width) {
      width = line.length;
    }
  }

  if (height === 0 || width === 0) {
    return { grid: [], width: 0, height: 0 };
  }

  const grid = [];

  for (let r = 0; r < height; r++) {
    const row = [];
    const line = lines[r] || '';

    for (let c = 0; c < width; c++) {
      const rawChar = line[c] || '';
      let char = rawChar;

      if (uppercase && isLetter(char)) {
        char = char.toUpperCase();
      }

      if (isLetter(char)) {
        row.push({ char: char.toUpperCase(), type: 'letter' });
      } else {
        row.push({ char: '', type: 'block' });
      }
    }

    grid.push(row);
  }

  return { grid, width, height };
}

// ============================================================
// Dictionary Building
// ============================================================

function buildDictionary(useCommon, useCustom, customText, uppercase) {
  const wordSet = new Set();

  if (useCommon) {
    for (const word of COMMON_WORDS) {
      if (word.length >= 3) {
        wordSet.add(word.toUpperCase());
      }
    }
  }

  if (useCustom && customText.trim()) {
    const tokens = customText.split(/[\n,]+/);

    for (let token of tokens) {
      token = token.trim();

      if (uppercase) {
        token = token.toUpperCase();
      }

      if (token.length >= 3 && /^[A-Za-z]+$/.test(token)) {
        wordSet.add(token.toUpperCase());
      }
    }
  }

  const dict = Array.from(wordSet);
  dict.sort((a, b) => b.length - a.length || a.localeCompare(b));

  return dict;
}

// ============================================================
// Line Generation
// ============================================================

function generateLine(grid, startR, startC, dy, dx, height, width) {
  let text = '';
  const coords = [];
  let r = startR;
  let c = startC;

  while (r >= 0 && r < height && c >= 0 && c < width) {
    const cell = grid[r][c];
    text += cell.type === 'letter' ? cell.char : '#';
    coords.push({ r, c });
    r += dy;
    c += dx;
  }

  return { text, coords };
}

function generateLinesForDirection(grid, direction, height, width) {
  const lines = [];
  const { id, dy, dx } = direction;
  const startPoints = new Set();

  const addStartPoint = (r, c) => {
    const key = `${r},${c}`;
    if (!startPoints.has(key)) {
      startPoints.add(key);
      const line = generateLine(grid, r, c, dy, dx, height, width);
      if (line.text.length > 0) {
        lines.push({ ...line, direction: id });
      }
    }
  };

  switch (id) {
    case 'R':
      for (let r = 0; r < height; r++) addStartPoint(r, 0);
      break;
    case 'L':
      for (let r = 0; r < height; r++) addStartPoint(r, width - 1);
      break;
    case 'D':
      for (let c = 0; c < width; c++) addStartPoint(0, c);
      break;
    case 'U':
      for (let c = 0; c < width; c++) addStartPoint(height - 1, c);
      break;
    case 'DR':
      for (let c = 0; c < width; c++) addStartPoint(0, c);
      for (let r = 1; r < height; r++) addStartPoint(r, 0);
      break;
    case 'UL':
      for (let c = 0; c < width; c++) addStartPoint(height - 1, c);
      for (let r = 0; r < height - 1; r++) addStartPoint(r, width - 1);
      break;
    case 'DL':
      for (let c = 0; c < width; c++) addStartPoint(0, c);
      for (let r = 1; r < height; r++) addStartPoint(r, width - 1);
      break;
    case 'UR':
      for (let c = 0; c < width; c++) addStartPoint(height - 1, c);
      for (let r = 0; r < height - 1; r++) addStartPoint(r, 0);
      break;
  }

  return lines;
}

// ============================================================
// Word Search
// ============================================================

function searchLine(line, dictionary) {
  const hits = [];
  const { text, coords, direction } = line;

  const segments = [];
  let segmentStart = 0;

  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || text[i] === '#') {
      if (i > segmentStart) {
        segments.push({
          text: text.substring(segmentStart, i),
          offset: segmentStart
        });
      }
      segmentStart = i + 1;
    }
  }

  for (const segment of segments) {
    for (const word of dictionary) {
      if (word.length > segment.text.length) continue;

      let idx = 0;
      while ((idx = segment.text.indexOf(word, idx)) !== -1) {
        const globalStart = segment.offset + idx;
        const globalEnd = globalStart + word.length - 1;

        const path = [];
        for (let i = globalStart; i <= globalEnd; i++) {
          path.push(coords[i]);
        }

        hits.push({
          word,
          direction,
          start: coords[globalStart],
          end: coords[globalEnd],
          path,
          length: word.length
        });

        idx += 1;
      }
    }
  }

  return hits;
}

function performSearch(grid, dictionary, directions, height, width) {
  const allHits = [];
  let hitCounter = 0;

  for (const dir of directions) {
    const lines = generateLinesForDirection(grid, dir, height, width);

    for (const line of lines) {
      const hits = searchLine(line, dictionary);

      for (const hit of hits) {
        hit.id = `hit-${String(hitCounter).padStart(4, '0')}`;
        hit.colorIndex = hitCounter % COLOR_PALETTE_SIZE;
        allHits.push(hit);
        hitCounter++;
      }
    }
  }

  return allHits;
}

// ============================================================
// Rendering
// ============================================================

function renderGrid(grid, width) {
  const container = elements.gridContainer;
  container.innerHTML = '';

  const gridEl = document.createElement('div');
  gridEl.className = 'grid';
  gridEl.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < width; c++) {
      const cell = grid[r][c];
      const cellEl = document.createElement('div');
      cellEl.className = 'grid-cell';
      cellEl.dataset.r = r;
      cellEl.dataset.c = c;

      if (cell.type === 'block') {
        cellEl.classList.add('block');
      } else {
        cellEl.textContent = cell.char;
      }

      gridEl.appendChild(cellEl);
    }
  }

  container.appendChild(gridEl);
}

function applyHighlights(hits) {
  const cellHits = new Map();

  for (const hit of hits) {
    for (const coord of hit.path) {
      const key = `${coord.r},${coord.c}`;
      if (!cellHits.has(key)) {
        cellHits.set(key, []);
      }
      cellHits.get(key).push(hit);
    }
  }

  for (const [key, hitList] of cellHits) {
    const [r, c] = key.split(',').map(Number);
    const cellEl = document.querySelector(`.grid-cell[data-r="${r}"][data-c="${c}"]`);

    if (cellEl) {
      const lastHit = hitList[hitList.length - 1];
      cellEl.classList.add(`hl-${lastHit.colorIndex}`);
      cellEl.dataset.hitIds = hitList.map(h => h.id).join(',');

      if (hitList.length > 1) {
        cellEl.dataset.overlap = 'true';
      }
    }
  }
}

function renderResults(hits) {
  const tbody = elements.resultsBody;
  tbody.innerHTML = '';

  if (hits.length === 0) {
    elements.resultsSection.classList.add('hidden');
    return;
  }

  elements.resultsSection.classList.remove('hidden');

  hits.forEach((hit, index) => {
    const tr = document.createElement('tr');
    tr.dataset.hitId = hit.id;

    // Create cells safely without innerHTML for user data
    const createCell = (content, className = '') => {
      const td = document.createElement('td');
      if (className) td.className = className;
      td.textContent = content;
      return td;
    };

    // First cell with color indicator
    const td1 = document.createElement('td');
    const colorSpan = document.createElement('span');
    colorSpan.className = `color-indicator hl-${hit.colorIndex}`;
    td1.appendChild(colorSpan);
    td1.appendChild(document.createTextNode(String(index + 1)));
    tr.appendChild(td1);

    tr.appendChild(createCell(hit.word, 'word-cell'));
    tr.appendChild(createCell(DIRECTIONS[hit.direction].arrow, 'dir-cell'));
    tr.appendChild(createCell(`(${hit.start.r + 1}, ${hit.start.c + 1})`));
    tr.appendChild(createCell(`(${hit.end.r + 1}, ${hit.end.c + 1})`));
    tr.appendChild(createCell(hit.length));

    tr.addEventListener('click', () => toggleHitFocus(hit.id));

    tbody.appendChild(tr);
  });
}

function updateStats(hits, height, width) {
  const uniqueWords = new Set(hits.map(h => h.word)).size;

  elements.statHits.textContent = hits.length;
  elements.statUnique.textContent = uniqueWords;
  elements.statGrid.textContent = `${height}×${width}`;
  elements.stats.classList.remove('hidden');
}

// ============================================================
// Focus Mode
// ============================================================

function toggleHitFocus(hitId) {
  if (focusedHitId === hitId) {
    clearFocus();
  } else {
    applyFocus(hitId);
  }
}

function applyFocus(hitId) {
  focusedHitId = hitId;
  const hit = currentHits.find(h => h.id === hitId);
  if (!hit) return;

  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.classList.add('dimmed');
    cell.classList.remove('focused');
  });

  for (const coord of hit.path) {
    const cellEl = document.querySelector(`.grid-cell[data-r="${coord.r}"][data-c="${coord.c}"]`);
    if (cellEl) {
      cellEl.classList.remove('dimmed');
      cellEl.classList.add('focused');
    }
  }

  document.querySelectorAll('#results-body tr').forEach(tr => {
    if (tr.dataset.hitId === hitId) {
      tr.classList.add('selected');
      tr.classList.remove('dimmed');
    } else {
      tr.classList.add('dimmed');
      tr.classList.remove('selected');
    }
  });
}

function clearFocus() {
  focusedHitId = null;

  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.classList.remove('dimmed', 'focused');
  });

  document.querySelectorAll('#results-body tr').forEach(tr => {
    tr.classList.remove('selected', 'dimmed');
  });
}

// ============================================================
// Main Actions
// ============================================================

function analyze() {
  clearMessage();
  clearFocus();

  let inputText = elements.gridInput.value;
  const customText = elements.customWords.value;
  const useCommon = elements.optCommon.checked;
  const useCustom = elements.optCustom.checked;
  const useUppercase = elements.optUppercase.checked;
  const removeEmptyLines = elements.optRemoveEmptyLines.checked;
  const removeSpaces = elements.optRemoveSpaces.checked;
  const enabledDirections = getEnabledDirections();

  if (!inputText.trim()) {
    showMessage(t('msgEnterText'), 'error');
    elements.gridContainer.innerHTML = '';
    elements.resultsSection.classList.add('hidden');
    elements.stats.classList.add('hidden');
    return;
  }

  inputText = preprocessText(inputText, removeEmptyLines, removeSpaces);

  const dictionary = buildDictionary(useCommon, useCustom, customText, useUppercase);

  if (dictionary.length === 0) {
    showMessage(t('msgNoDictionary'), 'error');
    return;
  }

  if (enabledDirections.length === 0) {
    showMessage(t('msgNoDirection'), 'error');
    return;
  }

  const { grid, width, height } = buildGrid(inputText, useUppercase);

  if (height === 0 || width === 0) {
    showMessage(t('msgParseError'), 'error');
    return;
  }

  const cellCount = height * width;
  if (cellCount > 20000) {
    showMessage(t('msgLargeGrid', { count: cellCount }), 'warning');
  }

  const hits = performSearch(grid, dictionary, enabledDirections, height, width);
  currentHits = hits;

  renderGrid(grid, width);
  applyHighlights(hits);
  renderResults(hits);
  updateStats(hits, height, width);

  if (hits.length === 0) {
    showMessage(t('msgNoWords'), 'info');
  } else {
    clearMessage();
  }
}

function clearAll() {
  elements.gridInput.value = '';
  elements.customWords.value = '';
  elements.gridContainer.innerHTML = '';
  elements.resultsBody.innerHTML = '';
  elements.resultsSection.classList.add('hidden');
  elements.stats.classList.add('hidden');
  clearMessage();
  clearFocus();
  currentHits = [];
}

function loadPreset(presetId) {
  const preset = PRESETS[presetId];
  if (!preset) return;

  elements.gridInput.value = preset.grid;
  elements.customWords.value = preset.customWords;
  clearMessage();
  const desc = preset.description[currentLang] || preset.description.en;
  showMessage(t('msgLoaded', { desc }), 'info');
}

// ============================================================
// Event Listeners
// ============================================================

elements.btnAnalyze.addEventListener('click', analyze);
elements.btnClear.addEventListener('click', clearAll);
elements.btnLang.addEventListener('click', toggleLanguage);
elements.btnHelp.addEventListener('click', openHelpModal);
elements.btnModalClose.addEventListener('click', closeHelpModal);
elements.modalOverlay.addEventListener('click', closeHelpModal);

elements.presetSelect.addEventListener('change', (e) => {
  const presetId = e.target.value;
  if (presetId) {
    loadPreset(presetId);
    e.target.value = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    analyze();
  }
  if (e.key === 'Escape' && !elements.helpModal.classList.contains('hidden')) {
    closeHelpModal();
  }
});

// ============================================================
// Initialization
// ============================================================

(function init() {
  const savedLang = localStorage.getItem('stegogrid-lang');
  if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
    currentLang = savedLang;
  }
  applyTranslations();
})();
