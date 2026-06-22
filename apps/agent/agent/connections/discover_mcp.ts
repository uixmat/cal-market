import { defineMcpClientConnection } from "eve/connections";

const webAppUrl = process.env.DISCOVER_WEB_URL ?? "http://localhost:3000";

export default defineMcpClientConnection({
  description:
    "Discover marketplace MCP tools exposed by the web app (search_listings, book_listing).",
  url: `${webAppUrl}/api/mcp`,
});
