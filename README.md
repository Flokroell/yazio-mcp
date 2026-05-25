# yazio-mcp

Connect your [Yazio](https://www.yazio.com) calorie tracker to Claude and other AI agents via [MCP](https://modelcontextprotocol.io).

Track calories, log meals, monitor macros, manage water intake, and analyze nutrition trends -- all through natural conversation with your AI assistant.

> "How many calories do I have left today?" / "Log 200g chicken breast for lunch" / "How's my protein this week?"

## What it does

- **Daily dashboard** -- calories eaten/remaining/burned, macros, water, steps, meal breakdown
- **Food logging** -- search 1M+ foods in Yazio's database, log meals, remove entries
- **Water tracking** -- add water intake (handles cumulative math automatically)
- **Weight tracking** -- log weigh-ins, view history and trends over time
- **Weekly analysis** -- 7-day averages for calories, protein, carbs, fat, water
- **Goal tracking** -- see your calorie, macro, step, weight, and water targets
- **Exercise data** -- view logged workouts with duration, calories burned, distance

## Quick Start

### Option 1: npx (recommended)

No install needed. Add to your Claude config:

**Claude Code** (`~/.claude/.mcp.json`):

```json
{
  "mcpServers": {
    "yazio": {
      "command": "npx",
      "args": ["-y", "@flokroell/yazio-mcp"],
      "env": {
        "YAZIO_EMAIL": "your@email.com",
        "YAZIO_PASSWORD": "your-password"
      }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "yazio": {
      "command": "npx",
      "args": ["-y", "@flokroell/yazio-mcp"],
      "env": {
        "YAZIO_EMAIL": "your@email.com",
        "YAZIO_PASSWORD": "your-password"
      }
    }
  }
}
```

### Option 2: Global install

```bash
npm install -g @flokroell/yazio-mcp
```

Then use `"command": "@flokroell/yazio-mcp"` instead of npx in the config above.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YAZIO_EMAIL` | Yes | Your Yazio account email |
| `YAZIO_PASSWORD` | Yes | Your Yazio account password |

## Available Tools

| Tool | Description | Key inputs |
|------|-------------|------------|
| `get_daily_summary` | Calories, macros, water, steps for a date | `date?` |
| `get_meals` | All food entries grouped by meal | `date?` |
| `search_food` | Search Yazio's food database (1M+ items) | `query`, `country?` |
| `log_food` | Add a food item to your diary | `product_id`, `meal`, `amount_g` |
| `remove_food` | Remove a food entry | `item_id` |
| `get_goals` | Calorie/macro/step/water/weight targets | -- |
| `get_weight` | Latest weight or history over a date range | `start_date?`, `end_date?` |
| `log_weight` | Record a weight measurement | `weight_kg` |
| `get_water` | Water intake with goal progress | `date?` |
| `log_water` | Add water (auto-calculates cumulative total) | `amount_ml` |
| `get_weekly_summary` | 7-day nutrition averages and daily breakdown | `end_date?` |
| `get_exercises` | Logged workouts, calories burned, duration | `date?` |

All dates use `YYYY-MM-DD` format and default to today when omitted.

## Examples

### Check your day

> **You:** "How am I doing on calories today?"
>
> **Claude:** You've eaten 1,847 of your 2,700 kcal goal. That's 853 remaining.
> Protein: 142g / 180g -- carbs: 198g / 270g -- fat: 62g / 90g.
> You also burned 320 kcal from your morning run, so your adjusted remaining is 1,173 kcal.

### Log a meal

> **You:** "Log 200g chicken breast for lunch"
>
> **Claude:** *searches "chicken breast" -> finds product -> logs 200g under lunch*
>
> Logged! 200g Chicken Breast for lunch: 330 kcal, 62g protein, 0g carbs, 7.2g fat.

### Weekly review

> **You:** "How was my protein intake this week?"
>
> **Claude:** Your 7-day protein average is 156g/day (goal: 180g).
> You hit your target on 3 of 7 days. Tuesday and Thursday were low at 98g and 112g.
> Consider adding a protein shake on training days to close the gap.

### Water tracking

> **You:** "Add 500ml water"
>
> **Claude:** Added 500ml. You're at 1,750ml / 3,000ml (58%). About 5 more glasses to hit your goal.

## How it works

This MCP server connects to Yazio's mobile API (`yzapi.yazio.com/v15`) using the same credentials you use to log into the Yazio app. Authentication is via OAuth2 password grant -- your token is held in memory only and never written to disk.

**Note:** This is an unofficial integration. Yazio does not provide a public API. The endpoints are reverse-engineered from the mobile app and may change without notice.

## Privacy and Security

- **Local only** -- runs on your machine, no third-party servers involved
- **Credentials** -- your email/password are passed via environment variables, never stored in files
- **Token** -- OAuth access token is held in memory only, never persisted to disk
- **No telemetry** -- zero analytics, tracking, or data collection

## Development

```bash
git clone https://github.com/Flokroell/yazio-mcp.git
cd yazio-mcp
npm install
cp .env.example .env  # add your Yazio credentials
npm run dev            # runs with tsx, hot reload
npm run build          # compile TypeScript to dist/
npm run lint           # type-check without emitting
```

### Project structure

```
src/
  index.ts           # MCP server setup + tool registration
  client/
    api.ts           # Yazio API client (all HTTP calls)
    auth.ts          # OAuth2 authentication
  tools/
    get-daily-summary.ts
    get-meals.ts
    search-food.ts
    log-food.ts
    remove-food.ts
    get-goals.ts
    get-weight.ts
    log-weight.ts
    get-water.ts
    log-water.ts
    get-weekly-summary.ts
    get-exercises.ts
  types/
    api.ts           # TypeScript interfaces for API responses
```

## Requirements

- Node.js >= 18
- A [Yazio](https://www.yazio.com) account (free or Pro)

## License

[MIT](LICENSE)
