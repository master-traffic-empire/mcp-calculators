import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateLoanPayment } from "../calculations.js";

export function registerLoan(server: McpServer) {
  server.registerTool(
    "calculate_loan_payment",
    {
      title: "Loan Payment Calculator",
      description:
        "Calculate monthly loan payment with full amortization schedule (first 12 months). Works for auto loans, personal loans, student loans, etc.",
      inputSchema: z.object({
        amount: z.number().positive().describe("Loan amount in dollars"),
        annual_rate: z
          .number()
          .min(0)
          .max(50)
          .describe("Annual interest rate as a percentage (e.g., 5.9 for 5.9%)"),
        term_months: z
          .number()
          .int()
          .min(1)
          .max(600)
          .describe("Loan term in months (e.g., 60 for 5-year loan)"),
      }),
    },
    async ({ amount, annual_rate, term_months }) => {
      const result = calculateLoanPayment(amount, annual_rate, term_months);

      const lines = [
        `Monthly payment: $${result.monthly_payment.toLocaleString()}`,
        `Total payment: $${result.total_payment.toLocaleString()}`,
        `Total interest: $${result.total_interest.toLocaleString()}`,
        ``,
        `Loan: $${amount.toLocaleString()} at ${annual_rate}% for ${term_months} months`,
        ``,
      ];

      if (result.amortization_first_12.length > 0) {
        lines.push(`First 12 months amortization:`);
        for (const row of result.amortization_first_12) {
          lines.push(
            `  Month ${row.month}: $${row.payment} (principal: $${row.principal}, interest: $${row.interest}, balance: $${row.balance})`
          );
        }
        lines.push(``);
      }

      lines.push(
        `Calculated by MoneyLens | Full schedule: https://money.thicket.sh/loan?utm_source=mcp&utm_medium=tool`
      );

      return { content: [{ type: "text", text: lines.join("\n") }] };
    }
  );
}
