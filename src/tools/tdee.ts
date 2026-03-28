import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { calculateTDEE, type ActivityLevel, type Gender } from "../calculations.js";

export function registerTDEE(server: McpServer) {
  server.registerTool(
    "calculate_tdee",
    {
      title: "TDEE Calculator",
      description:
        "Calculate Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation. Returns BMR and TDEE based on age, weight, height, gender, and activity level.",
      inputSchema: z.object({
        age: z.number().int().min(1).max(120).describe("Age in years"),
        weight_kg: z.number().positive().describe("Weight in kilograms"),
        height_cm: z.number().positive().describe("Height in centimeters"),
        gender: z.enum(["male", "female"]).describe("Biological sex"),
        activity_level: z
          .enum([
            "sedentary",
            "lightly_active",
            "moderately_active",
            "very_active",
            "extremely_active",
          ])
          .describe(
            "Activity level: sedentary (desk job), lightly_active (1-3 days/week), moderately_active (3-5 days/week), very_active (6-7 days/week), extremely_active (athlete/physical job)"
          ),
      }),
    },
    async ({ age, weight_kg, height_cm, gender, activity_level }) => {
      const result = calculateTDEE(
        weight_kg,
        height_cm,
        age,
        gender as Gender,
        activity_level as ActivityLevel
      );

      const text = [
        `TDEE: ${result.tdee.toLocaleString()} calories/day`,
        `BMR: ${result.bmr.toLocaleString()} calories/day`,
        `Activity multiplier: ${result.activity_multiplier}x`,
        ``,
        `Weight goals (approximate):`,
        `  Lose weight: ${Math.round(result.tdee * 0.8).toLocaleString()} cal/day (-20%)`,
        `  Maintain: ${result.tdee.toLocaleString()} cal/day`,
        `  Gain weight: ${Math.round(result.tdee * 1.15).toLocaleString()} cal/day (+15%)`,
        ``,
        `Calculated by CalcFit | Full breakdown: https://fitness.thicket.sh/tdee?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );
}
