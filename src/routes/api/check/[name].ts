import { Params } from "@solidjs/router";
import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { subdomains } from "~/lib/db/schema";
import { RESERVED_NAMES } from "~/lib/reserved";

export async function GET({ params }: { params: Params }) {
  const name = params.name;

  if (!name) {
    return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
  }

  if (RESERVED_NAMES.includes(name.toLowerCase())) {
    return new Response(
      JSON.stringify({ error: "Name is reserved" }),
      { status: 400 }
    );
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    return new Response(
      JSON.stringify({ error: "Name can only contain lowercase letters, numbers, and hyphens" }),
      { status: 400 }
    );
  }

  try {
    const result = await db
      .select()
      .from(subdomains)
      .where(eq(subdomains.name, name));

    const available = result.length === 0;

    return new Response(
      JSON.stringify({ available }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Database error" }),
      { status: 500 }
    );
  }
}
