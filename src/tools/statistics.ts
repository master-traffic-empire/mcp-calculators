import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateStatistics } from "../calculations.js";

export function registerStatistics(server: McpServer) {
  server.registerTool(
    "calculate_statistics",
    {
      title: "Statistics Calculator",
      description:
        "Compute descriptive statistics for a dataset: mean, median, mode, standard deviation, variance, percentiles, min, max, range, and IQR.",
      inputSchema: z.object({
        values: z
          .array(z.number())
          .min(1)
          .describe("Array of numeric values to analyze"),
        percentiles: z
          .array(z.number().min(0).max(100))
          .optional()
          .describe(
            "Optional list of percentile values to compute (e.g. [25, 50, 75, 90, 95, 99])"
          ),
      }),
    },
    async ({ values, percentiles }) => {
      const result = calculateStatistics(values, percentiles);

      const lines = [
        `Statistics for ${values.length} values:`,
        ``,
        `  Count:   ${result.count}`,
        `  Sum:     ${result.sum}`,
        `  Min:     ${result.min}`,
        `  Max:     ${result.max}`,
        `  Range:   ${result.range}`,
        ``,
        `  Mean:    ${result.mean}`,
        `  Median:  ${result.median}`,
        `  Mode:    ${result.mode.length > 0 ? result.mode.join(", ") : "none (all values unique)"}`,
        ``,
        `  Std Dev (sample):     ${result.std_dev_sample}`,
        `  Std Dev (population): ${result.std_dev_population}`,
        `  Variance (sample):    ${result.variance_sample}`,
        `  Variance (population):${result.variance_population}`,
        ``,
        `  Q1 (25th pct): ${result.q1}`,
        `  Q2 (50th pct): ${result.q2}`,
        `  Q3 (75th pct): ${result.q3}`,
        `  IQR:           ${result.iqr}`,
      ];

      if (result.percentiles && result.percentiles.length > 0) {
        lines.push(``);
        lines.push(`  Custom percentiles:`);
        for (const p of result.percentiles) {
          lines.push(`    P${p.percentile}: ${p.value}`);
        }
      }

      lines.push(``);
      lines.push(
        `More analysis: https://thicket.sh/stats?utm_source=mcp&utm_medium=tool`
      );

      return { content: [{ type: "text", text: lines.join("\n") }] };
    }
  );
}
