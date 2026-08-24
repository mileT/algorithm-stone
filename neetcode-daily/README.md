# NeetDaily

Daily NeetCode 250 practice app with Python learning and personal notes.

## Features

- **Daily check-in** — two focused problems from the NeetCode 250 list, streak tracking
- **Full problem browser** — all 250 problems by category, difficulty, and status
- **Python lessons** — category-aligned idioms (`dict`, `heapq`, DFS/BFS, DP, etc.)
- **Notes & review** — leave notes on any question and revisit them later
- **Daily email** — one question a day with topic hints (pattern, Python tools, nudge)

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

## Daily email

Each UTC day maps to **one** NeetCode 250 problem (cycling through the list). The email includes the question, difficulty, category, and topic hints from the matching Python lesson — not the solution.

Preview today's message:

```bash
npm run email:preview
```

Send it (Resend or SMTP):

```bash
cp .env.example .env   # then fill in secrets
npm run email:send
```

GitHub Actions sends it daily at **12:00 UTC** (repo-root `.github/workflows/daily-email.yml`). Add these repository secrets:

| Secret | Required | Purpose |
| --- | --- | --- |
| `DAILY_EMAIL_TO` | yes | Recipient(s), comma-separated |
| `DAILY_EMAIL_FROM` | yes | From address (`NeetDaily <you@domain>`) |
| `RESEND_API_KEY` | one of | [Resend](https://resend.com) API key |
| `SMTP_HOST` | one of | SMTP server if not using Resend |
| `SMTP_PORT` | no | Default `587` |
| `SMTP_SECURE` | no | `true` for port 465 |
| `SMTP_USER` / `SMTP_PASS` | no | SMTP credentials |

Use **Actions → Daily question email → Run workflow** to send a test. Open `/email` in the app to see today's question and hints.

## Data

Problems are sourced from the public NeetCode 250 list (`src/data/problems.json`). Links open LeetCode and NeetCode.
