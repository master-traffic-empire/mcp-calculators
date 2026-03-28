import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculatePercentage } from "../calculations.js";

export function registerPercentage(server: McpServer) {
  server.registerTool(
    "calculate_percentage",
    {
      title: "Percentage Calculator",
      description:
        'Versatile percentage calculator. Three operations: "of" (what is X% of Y?), "change" (% change from Y to X), "is_what_percent" (X is what % of Y?).',
      inputSchema: z.object({
        operation: z
          .enum(["of", "change", "is_what_percent"])
          .describe(
            '"of" = what is X% of Y, "change" = % change from y to x, "is_what_percent" = x is what % of y'
          ),
        x: z.number().describe("First number (percentage for 'of', new value for 'change', part for 'is_what_percent')"),
        y: z.number().describe("Second number (base for 'of', old value for 'change', whole for 'is_what_percent')"),
      }),
    },
    async ({ operation, x, y }) => {
      const result = calculatePercentage(
        operation as "of" | "change" | "is_what_percent",
        x,
        y
      );

      const text = [
        `Result: ${result.result}`,
        result.explanation,
        ``,
        `Calculated by Thicket Tools | More calculators: https://thicket.sh?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );
}
