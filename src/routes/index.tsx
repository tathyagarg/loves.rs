import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TextField, TextFieldInput } from "~/components/ui/text-field";

export default function Home() {
  return (
    <main class="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <div class="pointer-events-none fixed inset-0 z-1 overflow-hidden">
        <div class="absolute inset-0 animate-[stripes_30s_linear_infinite]"
          style="background: repeating-linear-gradient(
      105deg,
      transparent 0px,
      transparent 120px,
      rgba(from var(--color-ctp-base) r g b / 0.25) 120px,
      rgba(from var(--color-ctp-base) r g b / 0.25) 240px
    ); background-size: 200% 100%;"
        />
      </div>

      <div class="z-2 relative flex-1 flex flex-col">
        {/* Nav */}
        <nav class="px-8 py-5 flex items-center justify-between border-b border-border">
          <span class="text-primary font-mono text-sm tracking-widest uppercase">
            loves.rs
          </span>
          <a href="/api/auth/github" rel="external">
            <Button variant="outline" size="sm" class="font-mono text-xs tracking-wider gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              sign in with GitHub
            </Button>
          </a>
        </nav>

        {/* Hero */}
        <section class="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 class="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-2xl">
            a subdomain on{" "}
            <br />
            <span class="text-primary">loves.rs</span>
          </h1>

          <p class="text-muted-foreground text-lg max-w-md mb-12 leading-relaxed">
            Claim a free subdomain in seconds.
          </p>

          {/* Claim form */}
          <Card id="get-started" class="w-full max-w-md shadow-md">
            <CardContent class="pt-6 flex flex-col gap-3">
              <div class="flex items-center gap-2">

                <TextField>
                  <div class="flex items-center gap-2 flex-1">
                    <TextFieldInput placeholder="yourname" class="font-mono text-sm flex-1" />
                    <span class="text-muted-foreground font-mono text-sm shrink-0">.loves.rs</span>
                  </div>
                </TextField>
              </div>
              <Button class="w-full font-mono text-sm mt-1">
                check availability
              </Button>
            </CardContent>
          </Card>

          <p class="mt-5 text-muted-foreground text-xs font-mono">
            e.g.{" "}
            <span class="text-foreground">alice.loves.rs</span>,{" "}
            <span class="text-foreground">dev.loves.rs</span>,{" "}
            <span class="text-foreground">blog.loves.rs</span>
          </p>
        </section>

        <Separator />

        <section class="px-8 py-8 max-w-3xl mx-auto w-full">
          <p class="text-muted-foreground font-mono text-xs tracking-widest uppercase mb-8 text-center">how it works</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "01", label: "sign in with GitHub", desc: "Authenticate with your GitHub account — no new passwords." },
              { step: "02", label: "star the repo", desc: "Give the project a star to unlock the claim form." },
              { step: "03", label: "claim your subdomain", desc: "Pick your name, point it somewhere, done." },
            ].map((f) => (
              <div class="bg-card border border-border rounded-[var(--radius)] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_-5px_var(--secondary)] hover:-translate-y-1">
                <span class="text-primary font-mono text-2xl font-bold leading-none">{f.step}</span>
                <div class="flex flex-col gap-1">
                  <span class="text-foreground font-mono text-sm font-medium">{f.label}</span>
                  <span class="text-muted-foreground text-sm leading-relaxed">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />
        <footer class="px-8 py-5 text-center text-muted-foreground font-mono text-xs">
          Made with ❤️ by{" "}
          <a href="https://arson.dev/" target="_blank" class="text-ctp-sky-600 hover:underline">
            Tathya
          </a>.
        </footer>
      </div>
    </main>
  );
}
