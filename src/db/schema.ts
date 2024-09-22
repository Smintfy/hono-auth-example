import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull(),
  email: text('password').notNull(),
  password: text('password').notNull()
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;