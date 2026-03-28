import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateBMI } from "../calculations.js";

export function registerBMI(server: McpServer) {
  server.registerTool(
    "calculate_bmi",
    {
      title: "BMI Calculator",
      description:
        "Calculate Body Mass Index (BMI) from weight and height. Returns BMI value and WHO category.",
      inputSchema: z.object({
        weight_kg: z.number().positive().describe("Weight in kilograms"),
        height_cm: z.number().positive().describe("Height in centimeters"),
      }),
    },
    async ({ weight_kg, height_cm }) => {
      const result = calculateBMI(weight_kg, height_cm);

      const text = [
        `BMI: ${result.bmi}`,
        `Category: ${result.category}`,
        ``,
        `WHO BMI Categories:`,
        `  < 18.5: Underweight`,
        `  18.5-24.9: Normal weight`,
        `  25.0-29.9: Overweight`,
        `  30.0+: Obese`,
        ``,
        `Calculated by CalcFit | Full breakdown: https://fitness.thicket.sh/bmi?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );
}
