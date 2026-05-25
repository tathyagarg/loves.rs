"use server";

import { generateState, GitHub } from "arctic";

export async function GET() {
  const github = new GitHub(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!,
    process.env.GITHUB_REDIRECT_URI!
  );

  const state = generateState();
  const url = github.createAuthorizationURL(state, ["read:user", "user:email"]);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": `gh_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`,
    },
  })
}
