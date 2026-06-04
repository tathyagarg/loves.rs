"use server";
import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { getSession } from "~/lib/auth";

export const getCurrentUser = query(async () => {
  const event = getRequestEvent();
  return event ? getSession(event.request) : null;
}, "current-user")
