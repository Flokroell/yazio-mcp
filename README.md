# yazio-mcp

MCP server for [Yazio](https://www.yazio.com) calorie tracking. Lets Claude (and any MCP-compatible AI agent) read and write your nutrition data.

## Features

- **Daily summary** -- calories eaten/remaining/burned, macros, water, steps
- **Meal logging** -- search foods, log meals, remove entries
- **Water tracking** -- read and add water intake (handles cumulative math for you)
- **Weight tracking** -- read current weight, log new entries
- **Goal access** -- calorie/macro/step/water targets
- **Weekly trends** -- 7-day averages for spotting patterns
- **Exercises** -- view logged workouts and calories burned

## Install

```bash
npm install -g yazio-mcp
```

Or run directly with npx:

```bash
npx yazio-mcp
```

## Setup

1. Set your Yazio credentials as environment variables:

```bash
export YAZIO_EMAIL="your@email.com"
export YAZIO_PASSWORD="your-password"
```

2. Add to your Claude Desktop config (`~/.claude/settings.json` or Claude Desktop's MCP settings):

```json
{
  "mcpServers": {
    "yazio": {
      "command": "npx",
      "args": ["yazio-mcp"],
      "env": {
        "YAZIO_EMAIL": "your@email.com",
        "YAZIO_PASSWORD": "your-password"
      }
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `get_daily_summary` | Calories, macros, water, steps for a date |
| `get_meals` | All food entries grouped by meal |
| `search_food` | Search Yazio's food database |
| `log_food` | Add a food item to your diary |
| `remove_food` | Remove a food entry |
| `get_goals` | Your calorie/macro/step/water targets |
| `get_weight` | Most recent weight entry |
| `log_weight` | Add a weight measurement |
| `get_water` | Water intake for a date |
| `log_water` | Add water (handles cumulative total automatically) |
| `get_weekly_summary` | 7-day nutrition averages |
| `get_exercises` | Logged workouts for a date |

## Example usage

Ask Claude:

- "How many calories did I eat today?"
- "Log 200g chicken breast for lunch"
- "How much protein did I get this week on average?"
- "Add 500ml water"
- "What's my calorie goal?"

## Development

```bash
git clone https://github.com/flokroll/yazio-mcp.git
cd yazio-mcp
npm install
cp .env.example .env  # add your credentials
npm run dev
```

## How it works

This server uses Yazio's undocumented mobile API (`yzapi.yazio.com/v15`). Authentication is via OAuth2 password grant using the same credentials you use to log into the Yazio app.

**Note:** This is an unofficial integration. Yazio does not offer a public API -- this relies on reverse-engineered endpoints that may change without notice.

## License

MIT
