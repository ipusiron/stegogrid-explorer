(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.StegoGridCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const LIMITS = Object.freeze({
    maxCells: 20000,
    maxRows: 500,
    maxColumns: 500,
    maxCustomWords: 500,
    maxWordLength: 100,
    maxResults: 5000
  });

  const COMMON_WORDS = Object.freeze([
    'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HAD',
    'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS',
    'HOW', 'MAN', 'NEW', 'NOW', 'OLD', 'SEE', 'WAY', 'WHO', 'BOY', 'DID',
    'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'KEY', 'CODE', 'WORD',
    'FIND', 'HIDE', 'TEXT', 'GRID', 'LINE', 'OPEN', 'READ', 'SEEK', 'TRUE', 'DATA'
  ]);

  const DIRECTIONS = Object.freeze({
    R: Object.freeze({ id: 'R', dy: 0, dx: 1, arrow: '→' }),
    L: Object.freeze({ id: 'L', dy: 0, dx: -1, arrow: '←' }),
    D: Object.freeze({ id: 'D', dy: 1, dx: 0, arrow: '↓' }),
    U: Object.freeze({ id: 'U', dy: -1, dx: 0, arrow: '↑' }),
    DR: Object.freeze({ id: 'DR', dy: 1, dx: 1, arrow: '↘' }),
    UL: Object.freeze({ id: 'UL', dy: -1, dx: -1, arrow: '↖' }),
    DL: Object.freeze({ id: 'DL', dy: 1, dx: -1, arrow: '↙' }),
    UR: Object.freeze({ id: 'UR', dy: -1, dx: 1, arrow: '↗' })
  });

  class CoreError extends Error {
    constructor(code, details = {}) {
      super(code);
      this.name = 'CoreError';
      this.code = code;
      this.details = details;
    }
  }

  function isLetter(char) {
    return typeof char === 'string' && /^[A-Za-z]$/.test(char);
  }

  function preprocessText(text, options = {}) {
    const removeEmptyLines = options.removeEmptyLines !== false;
    const removeSpaces = options.removeSpaces !== false;
    let lines = String(text).replace(/\r\n?/g, '\n').split('\n');

    if (removeEmptyLines) lines = lines.filter((line) => line.trim().length > 0);
    if (removeSpaces) {
      lines = lines.map((line) => line.replace(/[\t\v\f \u00a0\u1680\u2000-\u200a\u202f\u205f\u3000]/gu, ''));
    }
    return lines.join('\n');
  }

  function buildGrid(text, uppercase = true, limits = LIMITS) {
    const lines = String(text).replace(/\r\n?/g, '\n').split('\n');
    const rows = lines.map((line) => Array.from(line));
    const height = rows.length;
    const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const cellCount = height * width;

    if (!width || !height) return { grid: [], width: 0, height: 0, cellCount: 0 };
    if (height > limits.maxRows) throw new CoreError('tooManyRows', { count: height, limit: limits.maxRows });
    if (width > limits.maxColumns) throw new CoreError('tooManyColumns', { count: width, limit: limits.maxColumns });
    if (cellCount > limits.maxCells) throw new CoreError('tooManyCells', { count: cellCount, limit: limits.maxCells });

    const grid = rows.map((source) => {
      const row = [];
      for (let column = 0; column < width; column += 1) {
        const raw = source[column] || '';
        if (isLetter(raw)) {
          row.push({ char: uppercase ? raw.toUpperCase() : raw, type: 'letter' });
        } else {
          row.push({ char: raw, type: 'block' });
        }
      }
      return row;
    });

    return { grid, width, height, cellCount };
  }

  function buildDictionary(options = {}, limits = LIMITS) {
    const uppercase = options.uppercase !== false;
    const words = new Set();

    if (options.useCommon !== false) {
      for (const word of COMMON_WORDS) words.add(uppercase ? word : word);
    }

    if (options.useCustom !== false && String(options.customText || '').trim()) {
      const tokens = String(options.customText).split(/[\n,]+/).map((token) => token.trim()).filter(Boolean);
      if (tokens.length > limits.maxCustomWords) {
        throw new CoreError('tooManyWords', { count: tokens.length, limit: limits.maxCustomWords });
      }
      for (let token of tokens) {
        const length = Array.from(token).length;
        if (length > limits.maxWordLength) {
          throw new CoreError('wordTooLong', { word: token, count: length, limit: limits.maxWordLength });
        }
        if (uppercase) token = token.toUpperCase();
        if (token.length >= 3 && /^[A-Za-z]+$/.test(token)) words.add(token);
      }
    }

    return Array.from(words).sort((a, b) => b.length - a.length || a.localeCompare(b));
  }

  function buildTrie(dictionary) {
    const root = { next: new Map(), words: [] };
    for (const word of dictionary) {
      let node = root;
      for (const char of word) {
        if (!node.next.has(char)) node.next.set(char, { next: new Map(), words: [] });
        node = node.next.get(char);
      }
      node.words.push(word);
    }
    return root;
  }

  function canonicalPathKey(word, path) {
    const forward = path.map(({ r, c }) => `${r},${c}`).join(';');
    const reverse = [...path].reverse().map(({ r, c }) => `${r},${c}`).join(';');
    return `${word}|${forward < reverse ? forward : reverse}`;
  }

  function searchGrid(gridInfo, dictionary, directions, limits = LIMITS) {
    const { grid, width, height } = gridInfo;
    const trie = buildTrie(dictionary);
    const hits = [];
    const seen = new Map();
    let truncated = false;

    outer:
    for (const direction of directions) {
      for (let startR = 0; startR < height; startR += 1) {
        for (let startC = 0; startC < width; startC += 1) {
          let node = trie;
          const path = [];
          let r = startR;
          let c = startC;

          for (let step = 0; step < limits.maxWordLength; step += 1) {
            if (r < 0 || r >= height || c < 0 || c >= width) break;
            const cell = grid[r][c];
            if (cell.type !== 'letter' || !node.next.has(cell.char)) break;
            node = node.next.get(cell.char);
            path.push({ r, c });

            for (const word of node.words) {
              const wordPath = path.slice();
              const key = canonicalPathKey(word, wordPath);
              if (seen.has(key)) {
                const existing = seen.get(key);
                if (!existing.mergedDirections.includes(direction.id)) existing.mergedDirections.push(direction.id);
                continue;
              }
              const hit = {
                word,
                direction: direction.id,
                mergedDirections: [direction.id],
                start: wordPath[0],
                end: wordPath[wordPath.length - 1],
                path: wordPath,
                length: wordPath.length
              };
              seen.set(key, hit);
              hits.push(hit);
              if (hits.length >= limits.maxResults) {
                truncated = true;
                break outer;
              }
            }
            r += direction.dy;
            c += direction.dx;
          }
        }
      }
    }

    return { hits, truncated };
  }

  function filterAndSortHits(hits, options = {}) {
    const query = String(options.query || '').trim().toLowerCase();
    const direction = String(options.direction || '');
    const minLength = Math.max(0, Number(options.minLength) || 0);
    const sort = options.sort || 'order';
    const indexed = hits.map((hit, index) => ({ hit, index })).filter(({ hit }) => {
      if (query && !hit.word.toLowerCase().includes(query)) return false;
      if (direction && !(hit.mergedDirections || [hit.direction]).includes(direction)) return false;
      return hit.length >= minLength;
    });

    const directionOrder = Object.keys(DIRECTIONS);
    indexed.sort((a, b) => {
      if (sort === 'word') return a.hit.word.localeCompare(b.hit.word) || a.index - b.index;
      if (sort === 'lengthDesc') return b.hit.length - a.hit.length || a.hit.word.localeCompare(b.hit.word) || a.index - b.index;
      if (sort === 'direction') return directionOrder.indexOf(a.hit.direction) - directionOrder.indexOf(b.hit.direction) || a.index - b.index;
      return a.index - b.index;
    });
    return indexed.map(({ hit }) => hit);
  }

  function exportHit(hit) {
    return {
      word: hit.word,
      direction: hit.direction,
      directionArrow: DIRECTIONS[hit.direction].arrow,
      mergedDirections: [...(hit.mergedDirections || [hit.direction])],
      start: { row: hit.start.r + 1, column: hit.start.c + 1 },
      end: { row: hit.end.r + 1, column: hit.end.c + 1 },
      length: hit.length,
      path: hit.path.map(({ r, c }) => ({ row: r + 1, column: c + 1 }))
    };
  }

  function serializeResultsJson(hits, filters = {}) {
    return `${JSON.stringify({
      schemaVersion: 1,
      resultCount: hits.length,
      filters: {
        query: String(filters.query || ''),
        direction: String(filters.direction || ''),
        minLength: Math.max(0, Number(filters.minLength) || 0),
        sort: String(filters.sort || 'order')
      },
      results: hits.map(exportHit)
    }, null, 2)}\n`;
  }

  function csvCell(value) {
    let text = String(value == null ? '' : value);
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function serializeResultsCsv(hits) {
    const rows = [['word', 'direction', 'direction_arrow', 'merged_directions', 'start_row', 'start_column', 'end_row', 'end_column', 'length', 'path']];
    for (const hit of hits) {
      const item = exportHit(hit);
      rows.push([
        item.word,
        item.direction,
        item.directionArrow,
        item.mergedDirections.join('|'),
        item.start.row,
        item.start.column,
        item.end.row,
        item.end.column,
        item.length,
        item.path.map(({ row, column }) => `${row}:${column}`).join('|')
      ]);
    }
    return `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
  }

  return {
    LIMITS,
    COMMON_WORDS,
    DIRECTIONS,
    CoreError,
    isLetter,
    preprocessText,
    buildGrid,
    buildDictionary,
    buildTrie,
    searchGrid,
    filterAndSortHits,
    serializeResultsJson,
    serializeResultsCsv
  };
});
