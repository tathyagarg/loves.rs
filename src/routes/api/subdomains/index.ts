import { count, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { subdomains } from "~/lib/db/schema";
import { RESERVED_NAMES } from "~/lib/reserved";
import { getCurrentUser } from "~/lib/session";

export async function GET({ request }: { request: Request }) {
  const user = await getCurrentUser();

  const url = new URL(request.url);
  const dns = url.searchParams.get("dns") === "true";

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

export async function POST({ request }: { request: Request }) {
  const user = await getCurrentUser();

  const { name } = await request.json();

  if (!name) {
    return new Response(JSON.stringify({ error: "Name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // confirm user subdomain count is less than 3
  const subCount = (await db.select({
    count: count()
  }).from(subdomains).where(eq(subdomains.ownerId, user?.id ?? "")))[0].count;

  if (subCount >= 3) {
    return new Response(JSON.stringify({ error: "You can only have 3 subdomains" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // validate subdomain validity
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    return new Response(JSON.stringify({ error: "Invalid subdomain name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (RESERVED_NAMES.includes(name)) {
    return new Response(JSON.stringify({ error: "This subdomain name is reserved" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const existing = await db.query.subdomains.findFirst({
    where: eq(subdomains.name, name),
  });

  if (existing) {
    return new Response(JSON.stringify({ error: "Subdomain already exists" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sub = await db.insert(subdomains).values({
    name,
    ownerId: user?.id ?? "",
  }).returning();

  return new Response(JSON.stringify(sub), {
    headers: { "Content-Type": "application/json" },
  });
}
