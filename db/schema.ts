import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const User = sqliteTable('user', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});