import { eq } from "drizzle-orm";
import { db } from ".";
import { subdomains, User } from "./schema";

export async function getSubdomains(user: User | undefined, dns = false) {
  const subs = dns ? await db.query.subdomains.findMany({
    where: eq(subdomains.ownerId, user?.id ?? ""),
    with: { records: true },
  }) : await db.query.subdomains.findMany({
    where: eq(subdomains.ownerId, user?.id ?? ""),
  });

  return new Response(JSON.stringify(subs), {
    headers: { "Content-Type": "application/json" },
  });
}
