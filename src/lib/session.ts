"use server";
import { getRequestEvent } from "solid-js/web";
import { getSession } from "~/lib/auth";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const event = getRequestEvent();
  return event ? getSession(event.request) : null;
}

export async function userHasStarred(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/starred`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  if (!res.ok) {
    return false
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data.some((repo) => repo.full_name === "tathyagarg/loves.rs");
  }

  return false
}

export async function approveUser(username: string) {
  await db.update(users).set({
    hasStarred: true,
  }).where(eq(users.username, username))
}
