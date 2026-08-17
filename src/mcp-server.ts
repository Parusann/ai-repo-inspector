#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { reviewRepository } from "./core.js";
import { reviewToolShape, toReviewRequest } from "./mcp-adapter.js";

const server = new McpServer({ name: "repository-inspector", version: "2.0.0" });

server.tool(
  "review_repository",
  "Inspects a Git repository and returns a review report.",
  reviewToolShape,
  async (input) => {
    const report = await reviewRepository(toReviewRequest(input));
    return { content: [{ type: "text", text: report }] };
  },
);

await server.connect(new StdioServerTransport());
