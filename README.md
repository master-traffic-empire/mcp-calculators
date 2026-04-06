# @thicket-team/mcp-calculators

**11 tools** covering finance calculators, unit conversions, and statistics — all in one MCP server for Claude Desktop, Claude Code, Cursor, and any MCP-compatible AI client.

Every calculation runs locally on your machine. No API calls, no data sent anywhere.

## Why choose this package?

| Feature | @thicket-team/mcp-calculators | @rog0x/mcp-math-tools | @wrtnlabs/calculator-mcp |
|---------|:---:|:---:|:---:|
| Finance calculators (mortgage, loan, TDEE, BMI) | ✅ 8 tools | ❌ | ❌ |
| Unit converter (length, weight, volume, area) | ✅ | ✅ | ❌ |
| Temperature converter | ✅ | ✅ | ❌ |
| Descriptive statistics | ✅ | ✅ | ❌ |
| Math (arithmetic, trig, log) | ➖ | ❌ | ✅ 31 tools |
| Take-home pay (all 50 US states) | ✅ | ❌ | ❌ |
| Compound interest | ✅ | ❌ | ❌ |
| Password generator | ✅ | ❌ | ❌ |
| Links to interactive calculators | ✅ | ❌ | ❌ |

## Available Tools (v1.1.0)

### Finance & Health
| Tool | Description | Interactive Site |
|------|-------------|------|
| `calculate_tdee` | Total Daily Energy Expenditure (Mifflin-St Jeor) | [CalcFit](https://fitness.thicket.sh/tdee) |
| `calculate_bmi` | Body Mass Index with WHO categories | [CalcFit](https://fitness.thicket.sh/bmi) |
| `calculate_mortgage` | Monthly payment, total interest | [MoneyLens](https://money.thicket.sh/mortgage) |
| `calculate_compound_interest` | Compound growth + monthly contributions | [MoneyLens](https://money.thicket.sh/compound-interest) |
| `calculate_take_home_pay` | Net pay after federal + state tax + FICA (all 50 states) | [PayScale Pro](https://paycheck.thicket.sh/take-home) |
| `calculate_percentage` | % of, % change, X is what % of Y | [Thicket](https://thicket.sh) |
| `calculate_loan_payment` | Payment + first 12 months amortization | [MoneyLens](https://money.thicket.sh/loan) |
| `generate_password` | Cryptographically secure password generator | [KeyForge](https://keyforge.thicket.sh) |

### Unit Conversion *(new in v1.1.0)*
| Tool | Description |
|------|-------------|
| `convert_unit` | Length (mm/cm/m/km/in/ft/yd/mi), Weight (mg/g/kg/t/oz/lb/st), Volume (ml/l/fl_oz/cup/pt/qt/gal), Area (mm²/cm²/m²/km²/in²/ft²/yd²/acre/ha) |
| `convert_temperature` | Celsius ↔ Fahrenheit ↔ Kelvin |

### Statistics *(new in v1.1.0)*
| Tool | Description |
|------|-------------|
| `calculate_statistics` | Mean, median, mode, std dev (sample + population), variance, quartiles (Q1/Q2/Q3), IQR, custom percentiles |

## Quick Start

```bash
npx @thicket-team/mcp-calculators
```

## Add to Claude Desktop

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "thicket-calculators": {
      "command": "npx",
      "args": ["@thicket-team/mcp-calculators"]
    }
  }
}
```

Config file location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Add to Claude Code

```bash
claude mcp add thicket-calculators -- npx @thicket-team/mcp-calculators
```

## Add to Cursor

In Cursor settings → MCP → add server:

```json
{
  "mcpServers": {
    "thicket-calculators": {
      "command": "npx",
      "args": ["@thicket-team/mcp-calculators"]
    }
  }
}
```

## Add to Windsurf / Codeium

In `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "thicket-calculators": {
      "command": "npx",
      "args": ["@thicket-team/mcp-calculators"]
    }
  }
}
```

## Example Usage

Once installed, ask your AI assistant:

**Finance:**
- "What's my TDEE? I'm a 30-year-old male, 80kg, 180cm, moderately active"
- "Calculate my mortgage payment for a $400,000 loan at 6.5% over 30 years"
- "How much will $10,000 grow in 20 years at 7% with $500/month contributions?"
- "What's my take-home pay on a $95,000 salary in California?"

**Unit Conversion:**
- "Convert 5 miles to kilometers"
- "How many ounces are in 2.5 kilograms?"
- "Convert 98.6°F to Celsius"
- "Convert 500 ml to cups"

**Statistics:**
- "Calculate statistics for [12, 15, 18, 22, 25, 28, 31, 45]"
- "What's the standard deviation of my dataset: [100, 105, 98, 112, 95, 108]?"
- "Give me the 90th and 95th percentile of [...]"

## How It Works

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes tools via stdio transport. Any MCP-compatible AI client can discover and call these tools.

Each tool:
1. Takes typed parameters (validated with Zod schemas)
2. Runs calculations locally (no API calls, no data sent anywhere)
3. Returns formatted results + links to interactive calculators on [thicket.sh](https://thicket.sh)

## Built by

[Thicket](https://thicket.sh) — a portfolio of free utility websites operated by an autonomous AI agent team.

## License

MIT
