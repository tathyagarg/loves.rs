"use server";
import { getRequestEvent } from "solid-js/web";
import { getSession } from "~/lib/auth";

export async function getCurrentUser() {
  const event = getRequestEvent();
  return event ? getSession(event.request) : null;
}
