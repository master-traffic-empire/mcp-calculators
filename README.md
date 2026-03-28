# @thicket/mcp-calculators

Free calculator tools for AI assistants. Calculate TDEE, BMI, mortgage payments, compound interest, take-home pay, and more — right from your AI conversation.

Every calculation returns a result plus a link to the full interactive calculator on our sites for deeper analysis.

## Available Tools

| Tool | Description | Site |
|------|-------------|------|
| `calculate_tdee` | Total Daily Energy Expenditure (Mifflin-St Jeor) | [CalcFit](https://fitness.thicket.sh/tdee) |
| `calculate_bmi` | Body Mass Index with WHO categories | [CalcFit](https://fitness.thicket.sh/bmi) |
| `calculate_mortgage` | Monthly mortgage payment, total interest | [MoneyLens](https://money.thicket.sh/mortgage) |
| `calculate_compound_interest` | Compound growth with monthly contributions | [MoneyLens](https://money.thicket.sh/compound-interest) |
| `calculate_take_home_pay` | Net pay after federal + state tax + FICA (all 50 states) | [PayScale Pro](https://paycheck.thicket.sh/take-home) |
| `calculate_percentage` | What is X% of Y, % change, X is what % of Y | [Thicket](https://thicket.sh) |
| `calculate_loan_payment` | Loan payment + first 12 months amortization | [MoneyLens](https://money.thicket.sh/loan) |
| `generate_password` | Cryptographically secure password generator | [KeyForge](https://keyforge.thicket.sh) |

## Quick Start

```bash
npx @thicket/mcp-calculators
```

## Add to Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "thicket-calculators": {
      "command": "npx",
      "args": ["@thicket/mcp-calculators"]
    }
  }
}
```

Config file location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Add to Claude Code

```bash
claude mcp add thicket-calculators -- npx @thicket/mcp-calculators
```

## Add to Cursor

In Cursor settings, add an MCP server:

```json
{
  "mcpServers": {
    "thicket-calculators": {
      "command": "npx",
      "args": ["@thicket/mcp-calculators"]
    }
  }
}
```

## Example Usage

Once installed, ask your AI assistant:

- "What's my TDEE? I'm a 30-year-old male, 80kg, 180cm, moderately active"
- "Calculate my mortgage payment for a $400,000 loan at 6.5% over 30 years"
- "How much will $10,000 grow in 20 years at 7% with $500/month contributions?"
- "What's my take-home pay on a $95,000 salary in California?"
- "Generate a 24-character password with symbols"

## How It Works

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes calculator tools via stdio transport. Any MCP-compatible AI client (Claude Desktop, Claude Code, Cursor, etc.) can discover and call these tools.

Each tool:
1. Takes typed parameters (validated with Zod schemas)
2. Runs the calculation locally (no API calls, no data sent anywhere)
3. Returns the result + a link to the full interactive calculator

All calculations run locally on your machine. No data is sent to any server.

## Built by

[Thicket](https://thicket.sh) — a portfolio of free utility websites operated by an autonomous AI agent team.

## License

MIT
