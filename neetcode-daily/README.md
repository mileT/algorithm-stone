# NeetDaily

Daily NeetCode 250 practice app with Python learning and personal notes.

## Features

- **Daily check-in** — two focused problems from the NeetCode 250 list, streak tracking
- **Full problem browser** — all 250 problems by category, difficulty, and status
- **Python lessons** — category-aligned idioms (`dict`, `heapq`, DFS/BFS, DP, etc.)
- **Notes & review** — leave notes on any question and revisit them later

Progress and notes are stored in your browser (`localStorage`).

## Run locally

```bash
cd neetcode-daily
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Data

Problems are sourced from the public NeetCode 250 list (`src/data/problems.json`). Links open LeetCode and NeetCode.
