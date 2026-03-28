import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateCompoundInterest } from "../calculations.js";

export function registerCompoundInterest(server: McpServer) {
  server.registerTool(
    "calculate_compound_interest",
    {
      title: "Compound Interest Calculator",
      description:
        "Calculate compound interest growth over time with optional monthly contributions. Returns final balance, total interest earned, and yearly breakdown.",
      inputSchema: z.object({
        principal: z.number().min(0).describe("Starting amount in dollars"),
        annual_rate: z
          .number()
          .min(0)
          .max(100)
          .describe("Annual interest rate as a percentage (e.g., 7 for 7%)"),
        years: z.number().int().min(1).max(100).describe("Number of years"),
        monthly_contribution: z
          .number()
          .min(0)
          .default(0)
          .describe("Monthly contribution amount in dollars (default: 0)"),
      }),
    },
    async ({ principal, annual_rate, years, monthly_contribution }) => {
      const result = calculateCompoundInterest(
        principal,
        annual_rate,
        years,
        monthly_contribution
      );

      const lines = [
        `Final balance: $${result.final_balance.toLocaleString()}`,
        `Total contributions: $${result.total_contributions.toLocaleString()}`,
        `Total interest earned: $${result.total_interest_earned.toLocaleString()}`,
        ``,
        `Growth over ${years} years:`,
      ];

      // Show select years from the breakdown
      const milestones = [1, 5, 10, 15, 20, 25, 30, 40, 50].filter(
        (y) => y <= years
      );
      for (const year of milestones) {
        const entry = result.yearly_breakdown.find((e) => e.year === year);
        if (entry) {
          lines.push(`  Year ${year}: $${entry.balance.toLocaleString()}`);
        }
      }
      // Always show final year if not in milestones
      if (!milestones.includes(years)) {
        const last = result.yearly_breakdown[result.yearly_breakdown.length - 1];
        lines.push(`  Year ${years}: $${last.balance.toLocaleString()}`);
      }

      lines.push(``);
      lines.push(
        `Calculated by MoneyLens | Full breakdown: https://money.thicket.sh/compound-interest?utm_source=mcp&utm_medium=tool`
      );

      return { content: [{ type: "text", text: lines.join("\n") }] };
    }
  );
}
