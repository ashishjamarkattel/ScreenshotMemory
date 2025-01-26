import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const spaces = pgTable("spaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  type: text("type").notNull(), // website, note, document
  url: text("url"),
  metadata: jsonb("metadata"),
  spaceId: serial("space_id").references(() => spaces.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const spacesRelations = relations(spaces, ({ many }) => ({
  memories: many(memories),
}));

export const memoriesRelations = relations(memories, ({ one }) => ({
  space: one(spaces, {
    fields: [memories.spaceId],
    references: [spaces.id],
  }),
}));

export const insertSpaceSchema = createInsertSchema(spaces);
export const selectSpaceSchema = createSelectSchema(spaces);
export const insertMemorySchema = createInsertSchema(memories);
export const selectMemorySchema = createSelectSchema(memories);

export type Space = typeof spaces.$inferSelect;
export type Memory = typeof memories.$inferSelect;
