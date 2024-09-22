import { eq } from "drizzle-orm";

import { db } from "../index";
import { SelectUser, usersTable } from "../schema";

export async function getUserByEmail(email: string): Promise<SelectUser | undefined> {
  return await db.select().from(usersTable).where(eq(usersTable.email, email)).get();
}