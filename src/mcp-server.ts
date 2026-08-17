#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { reviewRepository } from "./core.js";
import { reviewToolSchema, toReviewRequest } from "./mcp-adapter.js";
import { capAgentReport } from "./report.js";

const server = new McpServer({ name: "repository-inspector", version: "2.0.0" });

server.registerTool(
  "review_repository",
  {
    description:
      "Inspects a Git repository and returns a review report. MCP callers may run only the named typecheck, test, and build checks; arbitrary commands are intentionally unavailable.",
    inputSchema: reviewToolSchema,
  },
  async (input) => {
    const report = capAgentReport(await reviewRepository(toReviewRequest(input)));
    return { content: [{ type: "text", text: report }] };
  },
);

await server.connect(new StdioServerTransport());
