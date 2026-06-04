import { createAsync } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import Footer from "~/components/Footer";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { getCurrentUser } from "~/lib/session";


export default function Home() {
  const user = createAsync(() => getCurrentUser());

  const [subdomain, setSubdomain] = createSignal("");
  const [availStatus, setAvailStatus] = createSignal<"idle" | "checking" | "available" | "taken">("idle");
  const [err, setErr] = createSignal<string | null>(null);

  async function checkAvailability() {
    setAvailStatus("checking");

    if (!subdomain()) {
      setErr("Subdomain is required");
      setAvailStatus("idle");
      return;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(subdomain())) {
      setErr("Invalid subdomain");
      setAvailStatus("idle");
      return;
    }

    console.log("Checking availability for: ", subdomain());
    const res = await fetch(`/api/check/${encodeURIComponent(subdomain())}`);
    const data = await res.json();

    if (data.error) {
      setErr(data.error);
      setAvailStatus("idle");
      return;
    }

    if (data.available) {
      setAvailStatus("available");
    } else {
      setAvailStatus("taken");
    }
  }

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
              <div>
                <Show when={err()} fallback={null}>
                  <div class="p-3 mb-3 text-sm text-ctp-base bg-ctp-red rounded font-mono">
                    {err()}
                  </div>
                </Show>

                <div class="flex flex-row items-center justify-between gap-2 w-full">
                  <TextField>
                    <div class="flex items-center gap-2 flex-1">
                      <TextFieldInput
                        placeholder="yourname"
                        class="font-mono text-sm flex-1"
                        value={subdomain()}
                        onInput={(e) => {
                          setAvailStatus("idle");
                          setSubdomain(e.currentTarget.value)
                          setErr(null);
                        }}
                      />
                      <span class="text-muted-foreground font-mono text-sm shrink-0">.loves.rs</span>
                    </div>
                  </TextField>

                  <div class="justify-self-end">
                    <Show when={availStatus() === "available"}>
                      <span title="This subdomain is available">
                        <svg width="24" height="24" viewBox="0 -4 24 24" id="meteor-icon-kit__solid-checkmark" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.06066 6.4393C2.47487 5.85355 1.52513 5.85355 0.93934 6.4393C0.353553 7.0251 0.353553 7.9749 0.93934 8.5607L7.93934 15.5607C8.52513 16.1464 9.47487 16.1464 10.0607 15.5607L23.0607 2.56066C23.6464 1.97487 23.6464 1.02513 23.0607 0.43934C22.4749 -0.14645 21.5251 -0.14645 20.9393 0.43934L9 12.3787L3.06066 6.4393z" fill="var(--color-ctp-green)" /></svg>
                      </span>
                    </Show>
                    <Show when={availStatus() === "taken"}>
                      <span title="This subdomain is already taken">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-ctp-red)"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 6L6 18" />
                          <path d="M6 6L18 18" />
                        </svg>
                      </span>
                    </Show>
                    <Show when={availStatus() === "checking"}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 inline-block mr-1 animate-spin">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </Show>
                  </div>
                </div>
              </div>
              <Button class="w-full font-mono text-sm mt-1" onclick={checkAvailability}>
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

          <Show when={user()}>
            <Button
              variant="link"
              size="lg"
              class="font-mono text-sm mt-8"
            >
              <a href="/dash" class="w-full h-full">
                Go to Dashboard
              </a>
            </Button>
          </Show>
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
