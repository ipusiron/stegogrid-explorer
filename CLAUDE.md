# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StegoGrid Explorer is a client-side web tool for discovering hidden words in text grids. It scans text in all 8 directions (horizontal, vertical, diagonal, and their reverses) to find English words, useful for steganography analysis, cipher puzzles, and CTF challenges.

## Technology Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- Client-side only (no backend/network requests)
- Hosted on GitHub Pages

## Development

Open `index.html` directly in a browser for local development. No build step required.

## File Structure

- `index.html` - Main HTML structure with input panel and output panel
- `style.css` - Mobile-first responsive CSS (breakpoints at 600px and 900px)
- `script.js` - Core logic including grid parsing, 8-direction search, and rendering

## Architecture

### Grid System
- Input text is parsed line-by-line into a 2D grid
- Non-letter characters become "block" cells that stop word matching
- Grid is padded to rectangular shape (max line width)

### Search Algorithm
- Lines are generated for each of 8 directions from appropriate start points
- Each line is split by block cells into segments
- Dictionary words are searched within each segment using indexOf
- Hits record word, direction, start/end coordinates, and full path

### Direction Definitions (script.js `DIRECTIONS` object)
| ID | Arrow | dy | dx | Start Points |
|----|-------|----|----|--------------|
| R  | →     | 0  | +1 | Left edge    |
| L  | ←     | 0  | -1 | Right edge   |
| D  | ↓     | +1 | 0  | Top edge     |
| U  | ↑     | -1 | 0  | Bottom edge  |
| DR | ↘     | +1 | +1 | Top + Left   |
| UL | ↖     | -1 | -1 | Bottom + Right |
| DL | ↙     | +1 | -1 | Top + Right  |
| UR | ↗     | -1 | +1 | Bottom + Left |

### Key Constants
- `COMMON_WORDS`: 50 built-in English words (3+ letters)
- `COLOR_PALETTE_SIZE`: 12 highlight colors that cycle
- `DIRECTIONS`: Direction metadata including vectors and arrows
