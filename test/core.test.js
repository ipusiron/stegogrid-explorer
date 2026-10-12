const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../stegogrid-core.js');

const ALL_DIRECTIONS = Object.values(Core.DIRECTIONS);

test('uppercase normalization is optional and case-sensitive when disabled', () => {
  const normalized = Core.buildGrid('AbC', true);
  const preserved = Core.buildGrid('AbC', false);
  assert.equal(normalized.grid[0].map((cell) => cell.char).join(''), 'ABC');
  assert.equal(preserved.grid[0].map((cell) => cell.char).join(''), 'AbC');
  assert.deepEqual(Core.buildDictionary({ useCommon: false, customText: 'abc', uppercase: false }), ['abc']);
  assert.equal(Core.searchGrid(preserved, ['abc'], [Core.DIRECTIONS.R]).hits.length, 0);
  assert.equal(Core.searchGrid(Core.buildGrid('abc', false), ['abc'], [Core.DIRECTIONS.R]).hits.length, 1);
});

test('preprocessing normalizes line endings and removes horizontal Unicode whitespace', () => {
  assert.equal(Core.preprocessText('A\tB C\u3000D\r\n\r\nEF', { removeEmptyLines: true, removeSpaces: true }), 'ABCD\nEF');
});

test('grid coordinates count Unicode code points instead of UTF-16 code units', () => {
  const info = Core.buildGrid('A😀B', true);
  assert.equal(info.width, 3);
  assert.equal(info.grid[0][1].type, 'block');
  assert.equal(info.grid[0][2].char, 'B');
});

test('grid limits stop processing before search', () => {
  const text = Array.from({ length: 201 }, () => 'A'.repeat(100)).join('\n');
  assert.throws(() => Core.buildGrid(text, true), (error) => error.code === 'tooManyCells' && error.details.count === 20100);
});

test('dictionary limits and validation are deterministic', () => {
  const tooMany = Array.from({ length: 501 }, (_, i) => `WORD${i}`).join(',');
  assert.throws(() => Core.buildDictionary({ useCommon: false, customText: tooMany }), (error) => error.code === 'tooManyWords');
  assert.throws(() => Core.buildDictionary({ useCommon: false, customText: 'A'.repeat(101) }), (error) => error.code === 'wordTooLong');
  assert.deepEqual(Core.buildDictionary({ useCommon: false, customText: 'CODE, CODE, A1B, AB' }), ['CODE']);
});

test('a palindrome on the same cells is deduplicated across reverse directions', () => {
  const result = Core.searchGrid(Core.buildGrid('LEVEL'), ['LEVEL'], [Core.DIRECTIONS.R, Core.DIRECTIONS.L]);
  assert.equal(result.hits.length, 1);
  assert.equal(result.hits[0].direction, 'R');
  assert.deepEqual(result.hits[0].mergedDirections, ['R', 'L']);
});

test('all eight directions find their expected path', () => {
  const grids = {
    R: 'CODE', L: 'EDOC', D: 'C\nO\nD\nE', U: 'E\nD\nO\nC',
    DR: 'CXXX\nXOXX\nXXDX\nXXXE', UL: 'EXXX\nXDXX\nXXOX\nXXXC',
    DL: 'XXXC\nXXOX\nXDXX\nEXXX', UR: 'XXXE\nXXDX\nXOXX\nCXXX'
  };
  for (const [id, text] of Object.entries(grids)) {
    const result = Core.searchGrid(Core.buildGrid(text), ['CODE'], [Core.DIRECTIONS[id]]);
    assert.equal(result.hits.length, 1, id);
  }
});

test('the repaired presets have exact intended custom-word results', () => {
  const presets = [
    {
      grid: 'THEXOPEN\nXCODEXXX\nXXFINDXX\nXXWORDXX\nSEEKHIDE\nDATAREAD',
      words: ['THE', 'OPEN', 'CODE', 'FIND', 'WORD', 'SEEK', 'HIDE', 'DATA', 'READ'],
      expected: 9
    },
    {
      grid: 'CXXXXXXX\nXOXXXXXX\nXXDXXXXX\nXXXEXXXX\nXXXXHXXX\nXXXXXIXX\nXXXXXXDX\nXXXXXXXE',
      words: ['CODE', 'HIDE'], expected: 2
    },
    {
      grid: 'XXXXXXXE\nXXXXXXDX\nXXXXXOXX\nXXXXCXXX\nXXXYXXXX\nXXEXXXXX\nXKXXXXXX\nXXXXXXXX',
      words: ['CODE', 'KEY'], expected: 2
    }
  ];
  for (const preset of presets) {
    const result = Core.searchGrid(Core.buildGrid(preset.grid), preset.words, ALL_DIRECTIONS);
    assert.equal(result.hits.length, preset.expected);
  }
});

test('result limit reports truncation', () => {
  const limits = { ...Core.LIMITS, maxResults: 2 };
  const result = Core.searchGrid(Core.buildGrid('AAAAAAAA'), ['AAA'], [Core.DIRECTIONS.R], limits);
  assert.equal(result.hits.length, 2);
  assert.equal(result.truncated, true);
});

test('filters and stable sorting work without mutating source hits', () => {
  const source = [
    { word: 'KEY', direction: 'UR', mergedDirections: ['UR'], length: 3 },
    { word: 'CODE', direction: 'R', mergedDirections: ['R'], length: 4 },
    { word: 'LEVEL', direction: 'R', mergedDirections: ['R', 'L'], length: 5 }
  ];
  assert.deepEqual(Core.filterAndSortHits(source, { query: 'e', direction: 'L', minLength: 4 }).map((hit) => hit.word), ['LEVEL']);
  assert.deepEqual(Core.filterAndSortHits(source, { sort: 'lengthDesc' }).map((hit) => hit.word), ['LEVEL', 'CODE', 'KEY']);
  assert.deepEqual(source.map((hit) => hit.word), ['KEY', 'CODE', 'LEVEL']);
});

test('JSON and CSV exports use one-based coordinates and omit source text', () => {
  const hit = {
    word: 'LEVEL', direction: 'R', mergedDirections: ['R', 'L'], length: 5,
    start: { r: 0, c: 0 }, end: { r: 0, c: 4 }, path: Array.from({ length: 5 }, (_, c) => ({ r: 0, c }))
  };
  const json = JSON.parse(Core.serializeResultsJson([hit], { query: 'LEV', direction: 'L', minLength: 4, sort: 'word' }));
  assert.equal(json.schemaVersion, 1);
  assert.deepEqual(json.results[0].start, { row: 1, column: 1 });
  assert.deepEqual(json.results[0].mergedDirections, ['R', 'L']);
  assert.equal('sourceText' in json, false);
  const csv = Core.serializeResultsCsv([hit]);
  assert.match(csv, /^word,direction,direction_arrow,merged_directions,/);
  assert.match(csv, /LEVEL,R,→,R\|L,1,1,1,5,5,1:1\|1:2\|1:3\|1:4\|1:5/);
});

test('CSV export neutralizes spreadsheet formula prefixes', () => {
  const hit = {
    word: '=CMD', direction: 'R', mergedDirections: ['R'], length: 4,
    start: { r: 0, c: 0 }, end: { r: 0, c: 3 },
    path: Array.from({ length: 4 }, (_, c) => ({ r: 0, c }))
  };
  assert.match(Core.serializeResultsCsv([hit]), /\r\n'=CMD,R,/);
});
