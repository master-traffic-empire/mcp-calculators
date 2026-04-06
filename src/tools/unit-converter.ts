import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { convertUnit, convertTemperature } from "../calculations.js";

export function registerUnitConverter(server: McpServer) {
  server.registerTool(
    "convert_unit",
    {
      title: "Unit Converter",
      description:
        "Convert between units of length, weight, volume, and area. Supports metric and imperial units.",
      inputSchema: z.object({
        value: z.number().describe("The numeric value to convert"),
        from_unit: z.string().describe(
          "Source unit. Length: mm, cm, m, km, in, ft, yd, mi. Weight: mg, g, kg, t, oz, lb, st. Volume: ml, l, fl_oz, cup, pt, qt, gal. Area: mm2, cm2, m2, km2, in2, ft2, yd2, acre, ha."
        ),
        to_unit: z.string().describe("Target unit (same category as from_unit)"),
      }),
    },
    async ({ value, from_unit, to_unit }) => {
      const result = convertUnit(value, from_unit, to_unit);

      if (result.error) {
        return {
          content: [{ type: "text", text: `Error: ${result.error}` }],
        };
      }

      const text = [
        `${value} ${from_unit} = ${result.converted} ${to_unit}`,
        ``,
        `Conversion factor: 1 ${from_unit} = ${result.factor} ${to_unit}`,
        `Category: ${result.category}`,
        ``,
        `More conversions: https://thicket.sh/convert?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );

  server.registerTool(
    "convert_temperature",
    {
      title: "Temperature Converter",
      description:
        "Convert between Celsius, Fahrenheit, and Kelvin temperature scales.",
      inputSchema: z.object({
        value: z.number().describe("Temperature value to convert"),
        from_unit: z.enum(["C", "F", "K"]).describe(
          "Source scale: C (Celsius), F (Fahrenheit), K (Kelvin)"
        ),
        to_unit: z.enum(["C", "F", "K"]).describe("Target scale"),
      }),
    },
    async ({ value, from_unit, to_unit }) => {
      const result = convertTemperature(value, from_unit, to_unit);

      const text = [
        `${value}°${from_unit} = ${result.converted}°${to_unit}`,
        ``,
        `Common references:`,
        `  Water freezes: 0°C = 32°F = 273.15 K`,
        `  Body temp:     37°C = 98.6°F = 310.15 K`,
        `  Water boils:   100°C = 212°F = 373.15 K`,
        ``,
        `More conversions: https://thicket.sh/convert?utm_source=mcp&utm_medium=tool`,
      ].join("\n");

      return { content: [{ type: "text", text }] };
    }
  );
}
