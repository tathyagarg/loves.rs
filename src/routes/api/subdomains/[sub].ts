import { Params } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { subdomains } from "~/lib/db/schema";
import { getCurrentUser } from "~/lib/session";

export async function DELETE({ params }: { params: Params }) {
  const user = await getCurrentUser();
  const subName = params.sub;

  if (!subName) {
    return new Response(JSON.stringify({ error: "Subdomain is required" }), { status: 400 });
  }

  const sub = await db.query.subdomains.findFirst({
    where: eq(subdomains.name, subName),
  });

  if (!sub) {
    return new Response(JSON.stringify({ error: "Subdomain not found" }), { status: 404 });
  }

  if (sub.ownerId !== user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await db.delete(subdomains).where(eq(subdomains.name, subName));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
