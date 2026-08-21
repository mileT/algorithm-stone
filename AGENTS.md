# AGENTS.md

## Cursor Cloud specific instructions

This repository contains two independent products:

1. **algorithm-stone** (repo root, Python) — generates the SVG algorithm roadmaps
   referenced by `README.md`. Source in `src/`, entry point `src/main.py`.
2. **neetcode-daily** (`neetcode-daily/`, React + TypeScript + Vite) — a NeetCode 250
   daily-practice web app. See `neetcode-daily/README.md`.

The update script (run automatically on startup) installs both dependency sets:
`npm install` for `neetcode-daily/`, and a Python 3.9 virtualenv at `.venv/` with
`requirements.txt`. System packages (`graphviz`, `python3.9`, `libxml2-dev`,
`libxslt1-dev`) come from the VM snapshot and are NOT reinstalled by the update script.

### neetcode-daily (primary web app)

- Standard scripts are in `neetcode-daily/package.json` (`dev`, `build`, `lint`, `preview`).
- Run from the `neetcode-daily/` directory. Dev server: `npm run dev` (Vite, http://localhost:5173).
- Lint uses `oxlint` (`npm run lint`); it currently emits a couple of non-blocking warnings.
- All progress/notes persist in the browser `localStorage` — there is no backend or database.

### algorithm-stone (Python roadmap generator)

- Must be run with the project virtualenv and from inside `src/` because it uses bare
  module imports: `cd src && ../.venv/bin/python main.py`.
- Requires Python 3.9 specifically — the pinned `lxml==4.6.2` (used via
  `BeautifulSoup(..., "xml")`) does not build on newer Python. The `.venv` is built with
  Python 3.9 and legacy build tooling (`setuptools<60`, `--no-build-isolation`); do not
  upgrade `setuptools`/`pip` inside `.venv` or the old pinned packages stop building.
- Needs the `dot` binary from the `graphviz` system package on PATH.
- Running `main.py` reads cached data from `db/*.sqlite` and regenerates `images/*.svg`.
  `leetcode.update_db()` attempts a network call to leetcode-cn.com but is skipped when the
  cache is fresh and errors are swallowed, so it runs fully offline from the cached DB.
- Running it will modify `images/*.svg` and `db/codeforces.sqlite` (regenerated output/cache);
  revert those with `git checkout -- images/ db/` unless the regeneration is intended.
