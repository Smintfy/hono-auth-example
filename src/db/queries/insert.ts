import { db } from "../index";
import { InsertUser, usersTable } from "../schema";

export async function createUser(data: InsertUser) {
  return db.insert(usersTable).values(data).returning({ id: usersTable.id });
}