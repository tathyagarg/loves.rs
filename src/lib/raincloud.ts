"use server";

import { db } from "./db";
import { records } from "./db/schema";
import { rigorouslyValidateSubdomain, validateSubdomain } from "./utils";

const parseTTL = (ttl: string): number => {
  if (ttl === "auto") {
    return 3600;
  }

  if (ttl.endsWith("d")) {
    return parseInt(ttl.slice(0, -1)) * 86400;
  }

  if (ttl.endsWith("h")) {
    return parseInt(ttl.slice(0, -1)) * 3600;
  }

  if (ttl.endsWith("m")) {
    return parseInt(ttl.slice(0, -1)) * 60;
  }

  if (ttl.endsWith("s")) {
    return parseInt(ttl.slice(0, -1));
  }

  return parseInt(ttl);
}

export async function createRecord(subdomain: string, name: string, data: any, type: string, ttl: string) {
  if (rigorouslyValidateSubdomain(name, false)) {
    throw new Error(`Invalid record name: "${name}"`);
  }

  console.log("Creating record:", { subdomain, name, data, type, ttl });
  const subName = name === "@" ? subdomain : `${name}.${subdomain}`;

  const result = await fetch("https://raincloudns.dev/api/v1/zones/loves.rs/records", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RAINCLOUD_API_KEY}`,
    },
    body: JSON.stringify([{
      type,
      name: subName,
      data,
      ttl,
    }]),
  })

  const value = Object.values(data)[0] as string;

  if (result.ok) {
    console.log("Record created successfully in Raincloud");
    await db.insert(records).values({
      subdomain,
      type,
      name,
      value,
      ttl: parseTTL(ttl),
    })
  }

  return result
}
