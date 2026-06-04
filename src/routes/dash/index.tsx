"use client";

import { createAsync } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, onMount, Show } from "solid-js";
import { IconError, IconTrash } from "~/components/icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { useUser } from "~/components/contexts/UserCtx";
import { Subdomain } from "~/lib/db/schema";
import { getSubdomains } from "~/lib/db/data";

const VALID_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"] as const;
type RecordType = (typeof VALID_TYPES)[number];

async function fetchSubdomains(user: ReturnType<typeof useUser>): Promise<Subdomain[]> {
  const res = await getSubdomains(user(), true);

  console.log("Response status: ", res.status);

  if (!res.ok) {
    throw new Error("Failed to fetch subdomains");
  }

  let data = await res.json();
  console.log("Fetched subdomains: ", data);

  return data;
}

function ClaimSubdomainForm(props: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function submit() {
    if (!name().trim()) {
      setError("Subdomain required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subdomains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name(),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed");
      } else {
        props.onSuccess();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card class="border border-border rounded-lg p-4 bg-card flex flex-col gap-3">
      <Show when={error()}>
        <Alert class="bg-ctp-red text-ctp-base!">
          <IconError />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error()}
          </AlertDescription>
        </Alert>
      </Show>

      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-mono uppercase text-muted-foreground">
          subdomain
        </label>

        <TextField>
          <div class="flex items-center">
            <TextFieldInput
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="myapp"
              class="font-mono text-sm rounded rounded-r-none border-r-0"
            />

            <TextFieldLabel
              class="py-3 border-1 border-border font-mono rounded rounded-l-none px-2"
            >
              .loves.rs
            </TextFieldLabel>
          </div>
        </TextField>
      </div>

      <div class="flex gap-2">
        <Button
          onClick={props.onCancel}
          variant="destructive"
          class="px-3 py-1.5 border border-border rounded font-mono text-xs"
        >
          cancel
        </Button>

        <Button
          onClick={submit}
          disabled={loading()}
          class="px-3 py-1.5 bg-primary text-primary-foreground rounded font-mono text-xs"
        >
          {loading() ? "claiming..." : "claim"}
        </Button>
      </div>
    </Card>
  );
}

function Badge({ state }: { state: Subdomain["state"] }) {
  return (
    <span
      class={`text-xs font-mono px-2 py-0.5 rounded border ${state === "active"
        ? "bg-green/10 text-green border-green/30"
        : "bg-muted text-muted-foreground border-border"
        }`}
    >
      {state}
    </span>
  );
}

function AddRecordForm({
  subdomain,
  onSuccess,
  onCancel,
}: {
  subdomain: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [type, setType] = createSignal<RecordType>("A");
  const [value, setValue] = createSignal("");
  const [ttl, setTtl] = createSignal(3600);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function submit() {
    if (!value().trim()) {
      setError("Value is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/subdomains/${subdomain}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: type(), value: value(), ttl: ttl() }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to add record");
      } else {
        onSuccess();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="px-4 py-3 border-t border-border bg-background flex flex-col gap-3">
      <Show when={error()}>
        <p class="text-red text-xs font-mono">⚠ {error()}</p>
      </Show>
      <div class="grid grid-cols-[120px_1fr_110px] gap-2 items-end">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">type</label>
          <select
            value={type()}
            onInput={(e) => setType(e.currentTarget.value as RecordType)}
            class="bg-muted border border-border rounded text-foreground font-mono text-sm px-2 py-1.5 outline-none focus:border-accent"
          >
            <For each={VALID_TYPES}>{(t) => <option value={t}>{t}</option>}</For>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">value</label>
          <input
            type="text"
            value={value()}
            onInput={(e) => setValue(e.currentTarget.value)}
            placeholder="e.g. 49.205.216.130"
            class="bg-muted border border-border rounded text-foreground font-mono text-sm px-2 py-1.5 outline-none focus:border-accent w-full"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">ttl (s)</label>
          <input
            type="number"
            value={ttl()}
            onInput={(e) => setTtl(parseInt(e.currentTarget.value))}
            class="bg-muted border border-border rounded text-foreground font-mono text-sm px-2 py-1.5 outline-none focus:border-accent w-full"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <button
            onClick={onCancel}
            class="text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            cancel
          </button>
          <button
            onClick={submit}
            disabled={loading()}
            class="text-xs font-mono px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading() ? "adding..." : "add record"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubdomainCard({
  subdomain,
}: {
  subdomain: Subdomain;
}) {
  console.log("Rendering SubdomainCard for: ", subdomain);

  onMount(() => {
    console.log("Mounted SubdomainCard for: ", subdomain);
  })

  const [showingAddRecordForm, setShowingAddRecordForm] = createSignal(false);

  function computeSubdomain(subdomain: string, name: string) {
    if (name === "@") return `${subdomain}.loves.rs`;
    else return `${name}.${subdomain}.loves.rs`;
  }

  return (
    <Card class="border border-border rounded-lg p-4 bg-card">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-sm font-mono cursor-pointer" title={`${subdomain.name}.loves.rs`}
          onclick={() => {
            navigator.clipboard.writeText(`${subdomain.name}.loves.rs`);
          }}
        >
          <span class="">
            {subdomain.name}
          </span>
          .loves.rs
        </h2>
        <Badge state={subdomain.state} />
      </div>

      <Show when={subdomain.records.length > 0} fallback={<p class="text-xs text-muted-foreground">No DNS records yet.</p>}>
        <div class="flex flex-col gap-3">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr>
                <th class="border-b border-border pb-1">Type</th>
                <th class="border-b border-border pb-1">Name</th>
                <th class="border-b border-border pb-1">Value</th>
                <th class="border-b border-border pb-1">TTL</th>
                <th class="border-b border-border pb-1">Created At</th>
              </tr>
            </thead>
            <tbody>
              <For each={subdomain.records}>
                {(record) => (
                  <tr>
                    <td class="py-2 border-b border-border">
                      <span class="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {record.type}
                      </span>
                    </td>
                    <td class="py-2 border-b border-border">
                      <code class="font-mono text-xs text-foreground" title={computeSubdomain(subdomain.name, record.name)}>
                        {record.name === "@" ? "@" : `${record.name}.`}
                      </code>
                    </td>
                    <td class="py-2 border-b border-border">
                      <code class="font-mono text-xs text-foreground">{record.value}</code>
                    </td>
                    <td class="py-2 border-b border-border">
                      <code class="font-mono text-xs text-foreground">{record.ttl}</code>
                    </td>
                    <td class="py-2 border-b border-border">
                      <code class="font-mono text-xs text-muted-foreground">
                        {new Date(record.createdAt).toLocaleString()}
                      </code>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>

      <Show when={showingAddRecordForm()}>
        <AddRecordForm
          subdomain={subdomain.name}
          onSuccess={() => {
            // refetch subdomains to show the new record
          }}
          onCancel={() => {
            // do nothing, just close the form
          }}
        />
      </Show>
    </Card>
  );
}

export default function SubdomainsPage() {
  const user = useUser();

  const [showClaimForm, setShowClaimForm] = createSignal(false);
  const [subdomains] = createResource(() => user, async (user) => {
    if (!user) return [];
    return await fetchSubdomains(user);
  });

  // const subdomains = createAsync(async () => {
  //   return await fetchSubdomains(user);
  // });

  return (
    <div class="relative top-12 max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold my-4">Subdomains</h1>

      <Show when={subdomains()?.length !== 0}>
        <div class="flex flex-col gap-4">
          <For each={subdomains()}>
            {(sub) => (
              <SubdomainCard
                subdomain={sub}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={subdomains()?.length === 0}>
        <div class="border border-border rounded-lg p-6 text-center bg-card flex flex-col gap-4">
          <p class="text-sm text-muted-foreground">You don't have any subdomains yet.</p>
          <p class="text-xs text-muted-foreground/80">To claim a subdomain, please star the GitHub repo first!</p>
        </div>
      </Show>

      <div class="flex justify-end mt-6">
        <Button
          onClick={() => alert("To claim a subdomain, please star the GitHub repo first!")}
          class="text-xs font-mono px-3 py-1.5 rounded bg-primary text-primary-foreground"
        >
          {showClaimForm() ? "cancel" : "+ claim new"}
        </Button>

        <Show when={showClaimForm()}>
          <div class="mb-4">
            <ClaimSubdomainForm
              onSuccess={() => {
                setShowClaimForm(false);
              }}
              onCancel={() => setShowClaimForm(false)}
            />
          </div>
        </Show>
      </div>

    </div>
  );
}
