import {
  doublePrecision,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const listings = pgTable("listings", {
  calLink: text("cal_link").notNull(),
  category: text("category").notNull(),
  city: text("city").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  description: text("description").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  imageUrl: text("image_url").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  region: text("region").notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
