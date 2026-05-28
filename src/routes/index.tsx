import Footer from "~/components/Footer";
import Nav from "~/components/Nav";
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
        <Nav></Nav>

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
              { step: "01", label: "sign in with GitHub", desc: "Authenticate with your GitHub account — no new passwords.", },
              { step: "02", label: "star the repo", desc: "Give the project a star to unlock the claim form.", },
              { step: "03", label: "claim your subdomain", desc: "Pick your name, point it somewhere, done." },
            ].map((f, i) => (
              <div class="overflow-hidden relative group border border-border rounded-[var(--radius)] p-5 flex flex-col gap-3"
                classList={{
                  "bg-ctp-green": i === 0,
                  "bg-ctp-blue": i === 1,
                  "bg-ctp-pink": i === 2,
                }}
              >
                <div
                  class="absolute left-1/2 bottom-0 w-[300px] h-[300px] rounded-full bg-black/10 pointer-events-none -translate-x-1/2 translate-y-1/2 scale-0 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-100 group-hover:translate-y-1/4
                    shadow-[0_0_80px_rgba(0,0,0,0.1)]
                    "
                >
                </div>

                <span class="text-ctp-base font-mono text-2xl font-bold leading-none">{f.step}</span>
                <div class="flex flex-col gap-1">
                  <span class="text-ctp-base font-mono text-sm font-medium">{f.label}</span>
                  <span class="text-ctp-base text-sm leading-relaxed">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        <Footer></Footer>
      </div>
    </main>
  );
}
