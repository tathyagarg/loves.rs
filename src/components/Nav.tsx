import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "./ui/button";
import { getCurrentUser } from "~/lib/session";
import { IconGithub } from "./icons";

export default function Nav() {
  const user = createAsync(() => getCurrentUser());

  return (
    <nav class="h-[5em] relative z-3 px-8 py-5 flex items-center justify-between border-b border-border bg-ctp-base">
      <a href="/" class="flex items-center gap-2">
        <span class="text-primary font-mono text-sm tracking-widest uppercase">
          loves.rs
        </span>
      </a>

      <Show
        when={user()}
        fallback={
          <a href="/api/auth/github" rel="external">
            <Button variant="outline" size="sm" class="font-mono text-xs tracking-wider gap-2">
              <IconGithub />
              sign in with GitHub
            </Button>
          </a>
        }
      >
        {(u) => (
          <div class="flex items-center gap-3">
            <img src={u().avatarUrl} alt={u().username} class="w-7 h-7 rounded-full border border-border" />
            <span class="font-mono text-sm text-muted-foreground">{u().username}</span>
            <a href="/api/auth/logout" rel="external">
              <Button variant="ghost" size="sm" class="font-mono text-xs text-muted-foreground">
                sign out
              </Button>
            </a>
          </div>
        )}
      </Show>
    </nav>
  );
}
