import { deleteSession } from "~/lib/auth";

export async function GET({ request }: { request: Request }) {
  const cookies = Object.fromEntries(
    request.headers.get("cookie")?.split("; ").map(c => {
      const [key, ...val] = c.split("=");
      return [key, val.join("=")];
    }) ?? []
  );

  if (cookies["session"]) {
    await deleteSession(cookies["session"]);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": "session=; HttpOnly; Path=/; Max-Age=0",
    },
  });
}
