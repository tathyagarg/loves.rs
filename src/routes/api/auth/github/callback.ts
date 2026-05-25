import { GitHub } from "arctic";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";

export async function GET({ request }: { request: Request }) {
  console.log("CLIENT ID: ", process.env.GITHUB_CLIENT_ID);

  const github = new GitHub(
    process.env.GITHUB_CLIENT_ID!,
    process.env.GITHUB_CLIENT_SECRET!,
    process.env.GITHUB_REDIRECT_URI!
  );

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookies = Object.fromEntries(
    request.headers.get("cookie")?.split("; ").map(c => c.split("=")) ?? []
  );
  const storedState = cookies["gh_oauth_state"];

  if (!code || !state || state !== storedState) {
    return new Response("Invalid state", { status: 400 });
  }

  const tokens = await github.validateAuthorizationCode(code);

  // fetch the github user
  const githubUser = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${tokens.accessToken()}` }
  }).then(r => r.json());

  const hasStarred = await fetch("https://api.github.com/user/starred/tathyagarg/loves.rs", {
    headers: { Authorization: `Bearer ${tokens.accessToken()}` }
  }).then(r => r.status === 204);

  let result = await db.insert(users).values({
    id: String(githubUser.id),
    username: githubUser.login,
    avatarUrl: githubUser.avatar_url,
    hasStarred,
  }).onConflictDoUpdate({
    target: users.id,
    set: {
      username: githubUser.login,
      avatarUrl: githubUser.avatar_url,
    }
  });

  console.log("Upserted user: ", result);

  return new Response(null, {
    status: 302,
    headers: { Location: "/" }
  });
}
