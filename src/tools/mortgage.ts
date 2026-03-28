import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateMortgage } from "../calculations.js";

export function registerMortgage(server: McpServer) {
  server.registerTool(
    "calculate_mortgage",
    {
      title: "Mortgage Payment Calculator",
      description:
        "Calculate monthly mortgage payment, total payment, and total interest for a fixed-rate mortgage.",
      inputSchema: z.object({
        principal: z.number().positive().describe("Loan amount in dollars"),
        annual_rate: z
          .number()
          .min(0)
          .max(30)
          .describe("Annual interest rate as a percentage (e.g., 6.5 for 6.5%)"),
        years: z
          .number()
          .int()
          .min(1)
          .max(50)
          .describe("Loan term in years (e.g., 30)"),
      }),
    },
    async ({ principal, annual_rate, years }) => {
      const result = calculateMortgage(principal, annual_rate, years);

      const text = [
        `Monthly payment: $${result.monthly_payment.toLocaleString()}`,
        `Total payment: $${result.total_payment.toLocaleString()}`,
        `Total interest: $${result.total_interest.toLocaleString()}`,
        ``,
        `Loan details:`,
        `  Principal: $${principal.toLocaleString()}`,
        `  Rate: ${annual_rate}%`,
        `  Term: ${years} years (${years * 12} payments)`,
        ``,
        `Calculated by MoneyLens | Full breakdown: https://money.thicket.sh/mortgage?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );
}
