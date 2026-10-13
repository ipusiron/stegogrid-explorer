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
    analyze: '解析', clear: 'クリア', hits: 'ヒット数', shown: '表示中', uniqueWords: 'ユニーク語', grid: 'グリッド', results: '結果一覧',
    word: '単語', dir: '方向', start: '開始', end: '終了', len: '長さ', helpTitle: 'ヘルプ', closeHelp: 'ヘルプを閉じる', switchLanguage: '英語に切り替える',
    resultToolsLabel: '結果の絞り込みと出力', filterWord: '単語を含む', filterWordPlaceholder: '例: CODE', filterDirection: '方向', allDirections: 'すべて', minimumLength: '最小文字数',
    sortBy: '並び順', sortOrder: '検出順', sortWord: '単語順', sortLength: '長い順', sortDirection: '方向順', resetFilters: '絞り込み解除',
    exportJson: 'JSON保存', exportCsv: 'CSV保存', exportNote: '保存対象は表示中の一致結果だけです。入力した全文は含みません。', noFilterResults: '絞り込み条件に一致する結果はありません。',
    pathDetail: '選択した経路', clearSelection: '選択解除', mergedDirectionNote: '同じセル列で逆方向にも一致したため、1件にまとめています。', pathStepLabel: '{index}文字目: {char}（{coord}）',
    visibleSummary: '全{total}件のうち{shown}件を表示', msgExported: '{format}を{count}件保存しました。',
    toolTabsLabel: 'ツールのモード', tabExplorer: 'グリッド探索', tabExperiment: '偶然一致の実験',
    experimentTitle: '偶然一致の実験', experimentIntro: '再現可能なランダムA-Zグリッドを生成し、代表50語の3文字語と4文字以上の語が偶然現れる頻度を比較します。',
    experimentCaveat: '選んだ条件での経験的な比較です。隠しメッセージの存在確率を計算したり、作者の意図を証明したりするものではありません。',
    experimentSeed: 'シード', experimentRows: '行数', experimentColumns: '列数', experimentTrials: '試行回数', experimentAlphabet: '文字集合', experimentDictionary: '辞書', experimentDictionaryValue: '代表50語',
    experimentDirections: '探索方向', experimentDirectionsValue: '全8方向', experimentLimit: '処理上限', experimentLimitValue: '生成セル合計250,000個', runExperiment: '実験する', exportExperiment: '再現用JSONを保存',
    experimentResults: '実験結果', threeLetterWords: '3文字語', fourPlusWords: '4文字以上の語', trialsWithMatch: '1件以上一致した試行', totalMatches: '総一致数',
    experimentInterpretation: '割合は、1件以上一致したランダムグリッドの比率です。理論確率や検知スコアではありません。', topMatchedWords: '一致回数の多い語', matchCount: '一致数',
    noExperimentMatches: 'この試行では代表50語の一致がありませんでした。', firstGridSample: '最初に生成したグリッド', sampleHitSummary: '最初のグリッド: {count}件一致（{words}）', sampleNoHits: '最初のグリッド: 一致なし',
    experimentSummary: 'シード「{seed}」で{rows}×{columns}を{trials}回生成（合計{cells}セル）', fingerprintLabel: '再現ID: {fingerprint}', msgExperimentDone: '同じ条件とシードで同じ結果を再現できます。',
    msgExperimentInvalid: '{field}は{min}〜{max}の整数で指定してください。', msgExperimentTooLarge: '生成セル合計が上限を超えています（{count}個、上限{limit}個）。行・列・試行回数を減らしてください。',
    msgExperimentSeedTooLong: 'シードが長すぎます（{count}文字、上限{limit}文字）。',
    msgExperimentExported: '再現用JSONを保存しました。',
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
    analyze: 'Analyze', clear: 'Clear', hits: 'Hits', shown: 'Shown', uniqueWords: 'Unique words', grid: 'Grid', results: 'Results',
    word: 'Word', dir: 'Direction', start: 'Start', end: 'End', len: 'Length', helpTitle: 'Help', closeHelp: 'Close help', switchLanguage: 'Switch to Japanese',
    resultToolsLabel: 'Result filters and exports', filterWord: 'Word contains', filterWordPlaceholder: 'e.g. CODE', filterDirection: 'Direction', allDirections: 'All', minimumLength: 'Minimum length',
    sortBy: 'Sort by', sortOrder: 'Detection order', sortWord: 'Word', sortLength: 'Longest first', sortDirection: 'Direction', resetFilters: 'Reset filters',
    exportJson: 'Save JSON', exportCsv: 'Save CSV', exportNote: 'Only the visible matches are saved; the full input text is not included.', noFilterResults: 'No results match the filters.',
    pathDetail: 'Selected path', clearSelection: 'Clear selection', mergedDirectionNote: 'Reverse directions matched the same cells, so they are combined into one result.', pathStepLabel: 'Character {index}: {char} ({coord})',
    visibleSummary: 'Showing {shown} of {total}', msgExported: 'Saved {count} results as {format}.',
    toolTabsLabel: 'Tool modes', tabExplorer: 'Grid search', tabExperiment: 'Chance-match experiment',
    experimentTitle: 'Chance-match experiment', experimentIntro: 'Generate reproducible random A-Z grids and compare how often three-letter and longer words from the built-in 50-word list appear by chance.',
    experimentCaveat: 'This is an empirical comparison under the selected conditions. It does not calculate the probability of a hidden message or prove authorial intent.',
    experimentSeed: 'Seed', experimentRows: 'Rows', experimentColumns: 'Columns', experimentTrials: 'Trials', experimentAlphabet: 'Alphabet', experimentDictionary: 'Dictionary', experimentDictionaryValue: 'Built-in 50 words',
    experimentDirections: 'Directions', experimentDirectionsValue: 'All 8 directions', experimentLimit: 'Work limit', experimentLimitValue: '250,000 generated cells', runExperiment: 'Run experiment', exportExperiment: 'Save reproducibility JSON',
    experimentResults: 'Experiment results', threeLetterWords: 'Three-letter words', fourPlusWords: 'Words of four or more letters', trialsWithMatch: 'Trials with at least one match', totalMatches: 'Total matches',
    experimentInterpretation: 'The rate is the share of random grids with at least one match. It is not a theoretical probability or a detection score.', topMatchedWords: 'Most frequent matches', matchCount: 'Matches',
    noExperimentMatches: 'No word from the built-in list matched in these trials.', firstGridSample: 'First generated grid', sampleHitSummary: 'First grid: {count} matches ({words})', sampleNoHits: 'First grid: no matches',
    experimentSummary: 'Generated {trials} grids of {rows}×{columns} with seed “{seed}” ({cells} cells total)', fingerprintLabel: 'Reproduction ID: {fingerprint}', msgExperimentDone: 'The same seed and conditions reproduce the same result.',
    msgExperimentInvalid: 'Enter {field} as an integer from {min} to {max}.', msgExperimentTooLarge: 'The generated-cell total exceeds the limit ({count}; limit {limit}). Reduce rows, columns, or trials.',
    msgExperimentSeedTooLong: 'The seed is too long ({count} characters; limit {limit}).',
    msgExperimentExported: 'Saved the reproducibility JSON.',
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
    ['基本的な使い方', [], ['グリッドテキストを入力します。', '必要なら探索単語と方向を指定します。', '「解析」を押すかCtrl+Enterを使います。', '結果行をクリックまたはEnter／Spaceで選ぶと、各文字と1始まりの座標を確認できます。']],
    ['結果の整理と保存', ['単語・方向・最小文字数で結果を絞り込み、検出順・単語順・長い順・方向順に並べ替えられます。'], ['盤面の強調、件数、一覧、経路詳細は表示中の結果に連動します。', 'JSON／CSVには表示中の一致結果だけを保存し、入力した全文は含めません。']],
    ['偶然一致の実験', ['同じシード・行数・列数・試行回数なら、同じランダムグリッドと集計結果を再現できます。'], ['代表50語を全8方向で探索し、3文字語と4文字以上の語を比較します。', '割合は1件以上一致した試行の比率であり、理論確率、検知率、隠しメッセージの存在確率ではありません。', '生成セル合計は250,000個までです。']],
    ['処理規則', [], ['大文字化ONではグリッドと辞書を大文字へそろえます。OFFでは大小文字を区別します。', '空白除去は行を維持したままタブ・半角・全角などの横方向の空白を除去します。', 'ASCII英字以外は1コードポイントのブロックとなり、単語はそこをまたぎません。', TRANSLATIONS.ja.limitNote]],
    ['結果の限界', [TRANSLATIONS.ja.caveat], []],
    ['サンプル', ['プリセットは代表50語をOFF、指定単語をONにし、説明した語だけを教材として探索します。'], []]
  ],
  en: [
    ['What is StegoGrid Explorer?', ['This learning tool treats multi-line text as a character grid and searches for ASCII English words in eight horizontal, vertical, and diagonal directions.'], []],
    ['Basic usage', [], ['Enter grid text.', 'Choose search words and directions if needed.', 'Select Analyze or press Ctrl+Enter.', 'Click a result row, or use Enter/Space, to inspect every character and its one-based coordinate.']],
    ['Organize and save results', ['Filter results by word, direction, and minimum length, then sort by detection order, word, descending length, or direction.'], ['Grid highlights, counts, the table, and path details stay synchronized with visible results.', 'JSON and CSV exports contain only visible matches and never include the full input text.']],
    ['Chance-match experiment', ['The same seed, rows, columns, and trial count reproduce the same random grids and summary.'], ['The built-in 50 words are searched in all eight directions and compared as three-letter versus four-or-more-letter groups.', 'The rate is the share of trials with at least one match, not a theoretical probability, detection rate, or probability of a hidden message.', 'The generated-cell total is limited to 250,000.']],
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
  statHits: document.getElementById('stat-hits'), statShown: document.getElementById('stat-shown'), statUnique: document.getElementById('stat-unique'), statGrid: document.getElementById('stat-grid'),
  gridContainer: document.getElementById('grid-container'), resultsSection: document.getElementById('results-section'), resultsBody: document.getElementById('results-body'),
  resultFilterWord: document.getElementById('result-filter-word'), resultFilterDirection: document.getElementById('result-filter-direction'), resultFilterMinLength: document.getElementById('result-filter-min-length'), resultSort: document.getElementById('result-sort'),
  btnResetResults: document.getElementById('btn-reset-results'), btnExportJson: document.getElementById('btn-export-json'), btnExportCsv: document.getElementById('btn-export-csv'),
  visibleSummary: document.getElementById('visible-summary'), noFilterResults: document.getElementById('no-filter-results'), resultsTableWrapper: document.getElementById('results-table-wrapper'),
  hitDetail: document.getElementById('hit-detail'), btnClearFocus: document.getElementById('btn-clear-focus'), detailWord: document.getElementById('detail-word'), detailDirections: document.getElementById('detail-directions'), detailStart: document.getElementById('detail-start'), detailEnd: document.getElementById('detail-end'), detailLength: document.getElementById('detail-length'), detailMergedNote: document.getElementById('detail-merged-note'), pathSteps: document.getElementById('path-steps'),
  tabExplorer: document.getElementById('tab-explorer'), tabExperiment: document.getElementById('tab-experiment'), panelExplorer: document.getElementById('panel-explorer'), panelExperiment: document.getElementById('panel-experiment'),
  experimentSeed: document.getElementById('experiment-seed'), experimentRows: document.getElementById('experiment-rows'), experimentColumns: document.getElementById('experiment-columns'), experimentTrials: document.getElementById('experiment-trials'),
  btnRunExperiment: document.getElementById('btn-run-experiment'), btnExportExperiment: document.getElementById('btn-export-experiment'), experimentMessage: document.getElementById('experiment-message'), experimentResults: document.getElementById('experiment-results'),
  experimentFingerprint: document.getElementById('experiment-fingerprint'), experimentSummary: document.getElementById('experiment-summary'), experimentThreeRate: document.getElementById('experiment-three-rate'), experimentThreeTrials: document.getElementById('experiment-three-trials'), experimentThreeTotal: document.getElementById('experiment-three-total'),
  experimentFourRate: document.getElementById('experiment-four-rate'), experimentFourTrials: document.getElementById('experiment-four-trials'), experimentFourTotal: document.getElementById('experiment-four-total'),
  experimentTopBody: document.getElementById('experiment-top-body'), experimentTopWrapper: document.getElementById('experiment-top-wrapper'), experimentNoTop: document.getElementById('experiment-no-top'), experimentSampleGrid: document.getElementById('experiment-sample-grid'), experimentSampleHits: document.getElementById('experiment-sample-hits'),
  directionCheckboxes: Object.fromEntries(Object.keys(DIRECTIONS).map((id) => [id, document.getElementById(`dir-${id.toLowerCase()}`)]))
};

let currentLang = 'ja';
let currentHits = [];
let visibleHits = [];
let currentGridInfo = null;
let focusedHitId = null;
let lastStatus = null;
let returnFocusElement = null;
let activeToolTab = 'explorer';
let lastExperiment = null;
let lastExperimentMessage = null;

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

function setActiveToolTab(name, moveFocus = false) {
  activeToolTab = name === 'experiment' ? 'experiment' : 'explorer';
  const experimentActive = activeToolTab === 'experiment';
  elements.tabExplorer.classList.toggle('active', !experimentActive);
  elements.tabExperiment.classList.toggle('active', experimentActive);
  elements.tabExplorer.setAttribute('aria-selected', experimentActive ? 'false' : 'true');
  elements.tabExperiment.setAttribute('aria-selected', experimentActive ? 'true' : 'false');
  elements.tabExplorer.tabIndex = experimentActive ? -1 : 0;
  elements.tabExperiment.tabIndex = experimentActive ? 0 : -1;
  elements.panelExplorer.classList.toggle('hidden', experimentActive);
  elements.panelExperiment.classList.toggle('hidden', !experimentActive);
  if (moveFocus) (experimentActive ? elements.tabExperiment : elements.tabExplorer).focus();
}

function experimentFieldName(name) {
  return t(({ rows: 'experimentRows', columns: 'experimentColumns', trials: 'experimentTrials' })[name] || 'experimentTrials');
}

function renderExperimentMessage() {
  elements.experimentMessage.replaceChildren();
  if (!lastExperimentMessage) return;
  const message = document.createElement('div');
  message.className = `message message-${lastExperimentMessage.type}`;
  message.textContent = t(lastExperimentMessage.key, lastExperimentMessage.replacements);
  elements.experimentMessage.appendChild(message);
}

function setExperimentMessage(key, type = 'info', replacements = {}) {
  lastExperimentMessage = key ? { key, type, replacements } : null;
  renderExperimentMessage();
}

function formatRate(rate) {
  return new Intl.NumberFormat(currentLang === 'ja' ? 'ja-JP' : 'en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rate);
}

function renderExperiment() {
  renderExperimentMessage();
  if (!lastExperiment) return;
  const { conditions, groups, topWords, sample, fingerprint } = lastExperiment;
  elements.experimentSummary.textContent = t('experimentSummary', { seed: conditions.seed, rows: conditions.rows, columns: conditions.columns, trials: conditions.trials, cells: conditions.generatedCells.toLocaleString(currentLang === 'ja' ? 'ja-JP' : 'en-US') });
  elements.experimentFingerprint.textContent = t('fingerprintLabel', { fingerprint });
  elements.experimentThreeRate.textContent = formatRate(groups.three.trialRate);
  elements.experimentThreeTrials.textContent = `${groups.three.trialsWithMatch} / ${conditions.trials}`;
  elements.experimentThreeTotal.textContent = String(groups.three.totalMatches);
  elements.experimentFourRate.textContent = formatRate(groups.fourPlus.trialRate);
  elements.experimentFourTrials.textContent = `${groups.fourPlus.trialsWithMatch} / ${conditions.trials}`;
  elements.experimentFourTotal.textContent = String(groups.fourPlus.totalMatches);
  elements.experimentTopBody.replaceChildren();
  topWords.forEach((item) => {
    const row = document.createElement('tr');
    [item.word, String(item.length), String(item.count)].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    elements.experimentTopBody.appendChild(row);
  });
  elements.experimentNoTop.classList.toggle('hidden', topWords.length !== 0);
  elements.experimentTopWrapper.classList.toggle('hidden', topWords.length === 0);
  elements.experimentSampleGrid.textContent = sample.lines.join('\n');
  elements.experimentSampleHits.textContent = sample.hits.length
    ? t('sampleHitSummary', { count: sample.hits.length, words: sample.hits.map((hit) => `${hit.word}${hit.directionArrow}`).join(', ') })
    : t('sampleNoHits');
  elements.experimentResults.classList.remove('hidden');
  elements.btnExportExperiment.disabled = false;
}

function runExperiment() {
  setExperimentMessage(null);
  try {
    lastExperiment = Core.runChanceExperiment({
      seed: elements.experimentSeed.value,
      rows: elements.experimentRows.value,
      columns: elements.experimentColumns.value,
      trials: elements.experimentTrials.value
    });
    elements.experimentSeed.value = lastExperiment.conditions.seed;
    renderExperiment();
    setExperimentMessage('msgExperimentDone');
  } catch (error) {
    lastExperiment = null;
    elements.experimentResults.classList.add('hidden');
    elements.btnExportExperiment.disabled = true;
    if (error.code === 'invalidExperimentValue') {
      setExperimentMessage('msgExperimentInvalid', 'error', { field: experimentFieldName(error.details.name), min: error.details.min, max: error.details.max });
    } else if (error.code === 'experimentTooLarge') {
      setExperimentMessage('msgExperimentTooLarge', 'error', error.details);
    } else if (error.code === 'experimentSeedTooLong') {
      setExperimentMessage('msgExperimentSeedTooLong', 'error', error.details);
    } else {
      setExperimentMessage('msgParseError', 'error');
    }
  }
}

function exportExperiment() {
  if (!lastExperiment) return;
  const stamp = new Date().toISOString().slice(0, 10);
  downloadText(`stegogrid-experiment-${stamp}.json`, Core.serializeExperimentJson(lastExperiment), 'application/json;charset=utf-8');
  setExperimentMessage('msgExperimentExported');
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
  if (currentGridInfo) renderFilteredView();
  renderExperiment();
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
  elements.hitDetail.classList.add('hidden');
  currentHits = [];
  visibleHits = [];
  currentGridInfo = null;
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
  hits.forEach((hit, index) => {
    const row = document.createElement('tr');
    row.dataset.hitId = hit.id;
    row.tabIndex = 0;
    row.setAttribute('aria-label', t('resultRowLabel', { word: hit.word, direction: directionText(hit), start: coordinateText(hit.start), end: coordinateText(hit.end) }));
    const numberCell = document.createElement('td');
    const indicator = document.createElement('span');
    indicator.className = `color-indicator hl-${hit.colorIndex}`;
    indicator.setAttribute('aria-hidden', 'true');
    numberCell.append(indicator, document.createTextNode(String(index + 1)));
    row.appendChild(numberCell);
    [hit.word, hit.mergedDirections.map((id) => DIRECTIONS[id].arrow).join(' / '), coordinateText(hit.start), coordinateText(hit.end), String(hit.length)].forEach((value, cellIndex) => {
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

function updateStats(height, width) {
  elements.statHits.textContent = String(currentHits.length);
  elements.statShown.textContent = String(visibleHits.length);
  elements.statUnique.textContent = String(new Set(currentHits.map((hit) => hit.word)).size);
  elements.statGrid.textContent = `${height}×${width}`;
  elements.stats.classList.remove('hidden');
}

function resultOptions() {
  return {
    query: elements.resultFilterWord.value,
    direction: elements.resultFilterDirection.value,
    minLength: Number(elements.resultFilterMinLength.value) || 3,
    sort: elements.resultSort.value
  };
}

function resetResultControls() {
  elements.resultFilterWord.value = '';
  elements.resultFilterDirection.value = '';
  elements.resultFilterMinLength.value = '3';
  elements.resultSort.value = 'order';
}

function directionText(hit) {
  return hit.mergedDirections
    .map((id) => `${DIRECTIONS[id].arrow} ${t(`dir${directionKey(id)}`)}`)
    .join(' / ');
}

function renderHitDetail(hit) {
  if (!hit || !currentGridInfo) {
    elements.hitDetail.classList.add('hidden');
    elements.pathSteps.replaceChildren();
    return;
  }
  elements.detailWord.textContent = hit.word;
  elements.detailDirections.textContent = directionText(hit);
  elements.detailStart.textContent = coordinateText(hit.start);
  elements.detailEnd.textContent = coordinateText(hit.end);
  elements.detailLength.textContent = String(hit.length);
  const merged = hit.mergedDirections.length > 1;
  elements.detailMergedNote.textContent = merged ? t('mergedDirectionNote') : '';
  elements.detailMergedNote.classList.toggle('hidden', !merged);
  elements.pathSteps.replaceChildren();
  hit.path.forEach(({ r, c }, index) => {
    const item = document.createElement('li');
    const cell = currentGridInfo.grid[r] && currentGridInfo.grid[r][c];
    const char = cell && cell.type === 'letter' ? cell.char : '';
    item.textContent = `${char} ${coordinateText({ r, c })}`;
    item.setAttribute('aria-label', t('pathStepLabel', { index: index + 1, char, coord: coordinateText({ r, c }) }));
    elements.pathSteps.appendChild(item);
  });
  elements.hitDetail.classList.remove('hidden');
}

function renderFilteredView() {
  if (!currentGridInfo) return;
  visibleHits = Core.filterAndSortHits(currentHits, resultOptions());
  if (focusedHitId && !visibleHits.some((hit) => hit.id === focusedHitId)) focusedHitId = null;
  renderGrid(currentGridInfo.grid);
  applyHighlights(visibleHits);
  renderResults(visibleHits);
  updateStats(currentGridInfo.height, currentGridInfo.width);
  elements.visibleSummary.textContent = t('visibleSummary', { shown: visibleHits.length, total: currentHits.length });
  elements.noFilterResults.classList.toggle('hidden', visibleHits.length !== 0);
  elements.resultsTableWrapper.classList.toggle('hidden', visibleHits.length === 0);
  elements.btnExportJson.disabled = visibleHits.length === 0;
  elements.btnExportCsv.disabled = visibleHits.length === 0;
  renderHitDetail(focusedHitId ? currentHits.find((hit) => hit.id === focusedHitId) : null);
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
  renderHitDetail(hit);
}

function clearFocus() {
  focusedHitId = null;
  elements.gridContainer.querySelectorAll('.grid-cell').forEach((cell) => cell.classList.remove('dimmed'));
  elements.resultsBody.querySelectorAll('tr').forEach((row) => { row.classList.remove('selected', 'dimmed'); row.removeAttribute('aria-selected'); });
  renderHitDetail(null);
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
    currentGridInfo = gridInfo;
    currentHits = result.hits.map((hit, index) => ({ ...hit, id: `hit-${index}`, colorIndex: index % COLOR_PALETTE_SIZE }));
    resetResultControls();
    elements.resultsSection.classList.toggle('hidden', currentHits.length === 0);
    renderFilteredView();
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

function downloadText(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function exportResults(format) {
  if (!visibleHits.length) return;
  const stamp = new Date().toISOString().slice(0, 10);
  if (format === 'JSON') {
    downloadText(`stegogrid-results-${stamp}.json`, Core.serializeResultsJson(visibleHits, resultOptions()), 'application/json;charset=utf-8');
  } else {
    downloadText(`stegogrid-results-${stamp}.csv`, `\uFEFF${Core.serializeResultsCsv(visibleHits)}`, 'text/csv;charset=utf-8');
  }
  setStatus('msgExported', 'info', { format, count: visibleHits.length });
}

elements.btnAnalyze.addEventListener('click', analyze);
elements.btnClear.addEventListener('click', clearAll);
elements.btnClearFocus.addEventListener('click', clearFocus);
elements.btnResetResults.addEventListener('click', () => { resetResultControls(); renderFilteredView(); });
elements.btnExportJson.addEventListener('click', () => exportResults('JSON'));
elements.btnExportCsv.addEventListener('click', () => exportResults('CSV'));
elements.btnRunExperiment.addEventListener('click', runExperiment);
elements.btnExportExperiment.addEventListener('click', exportExperiment);
elements.tabExplorer.addEventListener('click', () => setActiveToolTab('explorer'));
elements.tabExperiment.addEventListener('click', () => setActiveToolTab('experiment'));
[elements.tabExplorer, elements.tabExperiment].forEach((tab) => tab.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const experiment = event.key === 'ArrowRight' || event.key === 'End';
  setActiveToolTab(experiment ? 'experiment' : 'explorer', true);
}));
[elements.resultFilterWord, elements.resultFilterMinLength].forEach((element) => element.addEventListener('input', renderFilteredView));
[elements.resultFilterDirection, elements.resultSort].forEach((element) => element.addEventListener('change', renderFilteredView));
elements.btnLang.addEventListener('click', toggleLanguage);
elements.btnHelp.addEventListener('click', openHelpModal);
elements.btnModalClose.addEventListener('click', closeHelpModal);
elements.modalOverlay.addEventListener('click', closeHelpModal);
elements.presetSelect.addEventListener('change', (event) => { if (event.target.value) loadPreset(event.target.value); event.target.value = ''; });
document.addEventListener('keydown', (event) => {
  trapModalFocus(event);
  if (event.key === 'Escape' && !elements.helpModal.classList.contains('hidden')) closeHelpModal();
  else if (event.key === 'Enter' && event.ctrlKey && elements.helpModal.classList.contains('hidden')) {
    event.preventDefault();
    if (activeToolTab === 'experiment') runExperiment(); else analyze();
  }
});

(function init() {
  const saved = localStorage.getItem('stegogrid-lang');
  if (saved === 'ja' || saved === 'en') currentLang = saved;
  applyTranslations();
  setActiveToolTab('explorer');
})();
