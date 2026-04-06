#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerTDEE } from "./tools/tdee.js";
import { registerBMI } from "./tools/bmi.js";
import { registerMortgage } from "./tools/mortgage.js";
import { registerCompoundInterest } from "./tools/compound-interest.js";
import { registerTakeHomePay } from "./tools/take-home-pay.js";
import { registerPercentage } from "./tools/percentage.js";
import { registerLoan } from "./tools/loan.js";
import { registerPassword } from "./tools/password.js";
import { registerUnitConverter } from "./tools/unit-converter.js";
import { registerStatistics } from "./tools/statistics.js";

function createServer() {
  const server = new McpServer({
    name: "@thicket/mcp-calculators",
    version: "1.1.0",
  });

  registerTDEE(server);
  registerBMI(server);
  registerMortgage(server);
  registerCompoundInterest(server);
  registerTakeHomePay(server);
  registerPercentage(server);
  registerLoan(server);
  registerPassword(server);
  registerUnitConverter(server);
  registerStatistics(server);

  return server;
}

// Smithery sandbox support — returns a fresh server instance for scanning
export function createSandboxServer() {
  return createServer();
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("@thicket/mcp-calculators server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
