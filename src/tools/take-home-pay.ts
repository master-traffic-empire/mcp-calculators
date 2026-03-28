import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateTakeHomePay, type FilingStatus } from "../calculations.js";

export function registerTakeHomePay(server: McpServer) {
  server.registerTool(
    "calculate_take_home_pay",
    {
      title: "Take-Home Pay Calculator",
      description:
        "Calculate net take-home pay after federal tax, state tax, Social Security, and Medicare. Supports all 50 US states + DC.",
      inputSchema: z.object({
        gross_annual_salary: z
          .number()
          .positive()
          .describe("Gross annual salary in dollars"),
        state: z
          .string()
          .length(2)
          .describe("US state abbreviation (e.g., CA, TX, NY)"),
        filing_status: z
          .enum(["single", "married_jointly", "married_separately", "head_of_household"])
          .default("single")
          .describe("Tax filing status (default: single)"),
      }),
    },
    async ({ gross_annual_salary, state, filing_status }) => {
      const result = calculateTakeHomePay(
        gross_annual_salary,
        state,
        filing_status as FilingStatus
      );

      const text = [
        `Take-home pay for $${result.gross_annual.toLocaleString()}/year in ${state.toUpperCase()}:`,
        ``,
        `  Net annual:    $${result.net_annual.toLocaleString()}`,
        `  Net monthly:   $${result.net_monthly.toLocaleString()}`,
        `  Net biweekly:  $${result.net_biweekly.toLocaleString()}`,
        ``,
        `Deductions:`,
        `  Federal tax:       $${result.federal_tax.toLocaleString()}`,
        `  State tax (${state.toUpperCase()}):    $${result.state_tax.toLocaleString()}`,
        `  Social Security:   $${result.fica_social_security.toLocaleString()}`,
        `  Medicare:          $${result.fica_medicare.toLocaleString()}`,
        `  Total deductions:  $${result.total_deductions.toLocaleString()}`,
        ``,
        `Effective tax rate: ${result.effective_tax_rate}%`,
        ``,
        `Calculated by PayScale Pro | Full breakdown: https://paycheck.thicket.sh/take-home?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );
}
