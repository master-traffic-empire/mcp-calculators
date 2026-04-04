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

const server = new McpServer({
  name: "@thicket/mcp-calculators",
  version: "1.0.1",
});

// Register all calculator tools
registerTDEE(server);
registerBMI(server);
registerMortgage(server);
registerCompoundInterest(server);
registerTakeHomePay(server);
registerPercentage(server);
registerLoan(server);
registerPassword(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("@thicket/mcp-calculators server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
