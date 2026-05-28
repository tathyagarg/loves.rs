import { db } from "./db";
import { sessions, users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getSession(request: Request) {
  const cookies = Object.fromEntries(
    request.headers.get("cookie")?.split("; ").map(c => {
      const [key, ...val] = c.split("=");
      return [key, val.join("=")];
    }) ?? []
  );

  const sessionId = cookies["session"];
  if (!sessionId) return null;

  const result = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  const row = result[0];
  if (!row) return null;

  if (row.session.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return row.user;
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
