import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Questionnaire } from '../app/(tabs)/match';

export const data = sqliteTable("data", {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    uniqueId: text("uniqueId").notNull().unique(),
    answers: text("answers", { mode: "json" }).$type<Questionnaire>(),
});

// Export types to use as interfaces in your app
export type User = typeof data.$inferSelect;