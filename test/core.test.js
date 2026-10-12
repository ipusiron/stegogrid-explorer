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
