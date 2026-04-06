# MCP Calculators

[![npm version](https://img.shields.io/npm/v/@thicket-team/mcp-calculators.svg)](https://www.npmjs.com/package/@thicket-team/mcp-calculators)
[![npm downloads](https://img.shields.io/npm/dm/@thicket-team/mcp-calculators.svg)](https://www.npmjs.com/package/@thicket-team/mcp-calculators)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

**8 free calculator tools for AI assistants — no API key, no data sent anywhere.**

Run BMI, TDEE, mortgage, compound interest, take-home pay, loan, percentage, and password calculations directly inside Claude, Cursor, Windsurf, and any MCP-compatible AI client.

```bash
npx @thicket-team/mcp-calculators
```

---

## Tools

| Tool | What it does | Site |
|------|-------------|------|
| `calculate_bmi` | Body Mass Index with WHO weight category | [CalcFit](https://fitness.thicket.sh/bmi) |
| `calculate_tdee` | Total Daily Energy Expenditure (Mifflin-St Jeor) | [CalcFit](https://fitness.thicket.sh/tdee) |
| `calculate_mortgage` | Monthly payment, total interest, amortization | [MoneyLens](https://money.thicket.sh/mortgage) |
| `calculate_compound_interest` | Compound growth with optional monthly contributions | [MoneyLens](https://money.thicket.sh/compound-interest) |
| `calculate_take_home_pay` | Net pay after federal + state tax + FICA (all 50 US states) | [PayScale Pro](https://paycheck.thicket.sh/take-home) |
| `calculate_loan_payment` | Payment + first 12 months amortization schedule | [MoneyLens](https://money.thicket.sh/loan) |
| `calculate_percentage` | % of Y, % change between two values, X is what % of Y | [Thicket](https://thicket.sh) |
| `generate_password` | Cryptographically secure password (length, symbols, digits) | [KeyForge](https://keyforge.thicket.sh) |

---

## Install

### Claude Desktop

Edit `claude_desktop_config.json`:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-calculators": {
      "command": "npx",
      "args": ["-y", "@thicket-team/mcp-calculators"]
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add mcp-calculators -- npx -y @thicket-team/mcp-calculators
```

### Cursor

Open **Settings → MCP** and add:

```json
{
  "mcpServers": {
    "mcp-calculators": {
      "command": "npx",
      "args": ["-y", "@thicket-team/mcp-calculators"]
    }
  }
}
```

### Windsurf

In `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "mcp-calculators": {
      "command": "npx",
      "args": ["-y", "@thicket-team/mcp-calculators"]
    }
  }
}
```

### Any other MCP client

```json
{
  "command": "npx",
  "args": ["-y", "@thicket-team/mcp-calculators"]
}
```

---

## Usage examples

Once installed, ask your AI assistant:

```
What's my TDEE? I'm a 32-year-old female, 65kg, 168cm, lightly active.
```
```
Calculate my monthly mortgage payment: $450,000 loan, 6.75% rate, 30-year term, 20% down.
```
```
How much will $15,000 grow in 25 years at 8% annual return with $400/month contributions?
```
```
What's my take-home pay on a $120,000 salary in Texas?
```
```
Generate a 20-character password with uppercase, numbers, and symbols.
```

---

## How it works

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server using **stdio transport**.

Each tool:
1. Accepts typed, validated parameters (Zod schemas)
2. Runs the calculation **100% locally** — no network requests, no data sent anywhere
3. Returns the numeric result **plus a link** to the full interactive calculator on [thicket.sh](https://thicket.sh) for detailed breakdowns

**Privacy:** All calculations happen on your machine. Nothing is transmitted.

---

## Directory listings

This package is indexed on:

- [Smithery.ai](https://smithery.ai/server/@thicket-team/mcp-calculators) — `smithery.yaml` present in repo root
- [Glama.ai](https://glama.ai/mcp/servers) — search "mcp-calculators"
- [npm](https://www.npmjs.com/package/@thicket-team/mcp-calculators)

### Submit to additional directories (copy-paste guide)

**Glama.ai** — Visit [glama.ai/mcp/servers](https://glama.ai/mcp/servers), click **"Add Server"**, submit:
```
https://github.com/master-traffic-empire/mcp-calculators
```

**MCP.so** — Comment on [github.com/chatmcp/mcpso/issues/1](https://github.com/chatmcp/mcpso/issues/1):
```
@thicket-team/mcp-calculators — https://www.npmjs.com/package/@thicket-team/mcp-calculators
8 free calculator tools (BMI, TDEE, mortgage, compound interest, take-home pay, loan, percentage, password). No API key. Install: npx @thicket-team/mcp-calculators
```

**MCP.directory** — Visit [mcp.directory/submit](https://mcp.directory/submit), enter:
```
https://github.com/master-traffic-empire/mcp-calculators
```

**Official MCP Registry** — A `server.json` is included in the repo root. Push a new version tag to trigger the GitHub Actions OIDC publish workflow:
```bash
git tag v1.0.2 && git push origin v1.0.2
```
Glama and PulseMCP auto-ingest from the Official Registry within 24–72h.

---

## Development

```bash
git clone https://github.com/master-traffic-empire/mcp-calculators.git
cd mcp-calculators
npm install
npm run build
node build/index.js   # runs the MCP server on stdio
```

---

## Built by

[Thicket](https://thicket.sh) — a portfolio of free utility websites.

## License

MIT
