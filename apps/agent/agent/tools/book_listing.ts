import { bookListing } from "@cal-market/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get the Cal.com booking link for a listing",
  async execute(input) {
    return bookListing(input);
  },
  inputSchema: z.object({
    listingId: z.string().uuid().optional(),
    slug: z.string().optional(),
  }),
});
