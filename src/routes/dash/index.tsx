import { createResource, createSignal, For, onMount, Show } from "solid-js";
import { IconError, IconTrash } from "~/components/icons";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

const VALID_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"] as const;
type RecordType = (typeof VALID_TYPES)[number];

interface DnsRecord {
  subdomain: string;
  type: RecordType;
  name: string;
  value: string;
  createdAt: string;
}

interface Subdomain {
  name: string;
  ownerId: string;
  state: "active" | "reserved";
  createdAt: string;
  records: DnsRecord[];
}

async function fetchSubdomains(): Promise<Subdomain[]> {
  const res = await fetch("/api/subdomains?dns=true",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch subdomains");
  }
  return await res.json();
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
            placeholder="e.g. 1.2.3.4"
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
          <Button
            onClick={onCancel}
            variant="outline"
            class="text-xs font-mono px-3 py-1.5 rounded border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            cancel
          </Button>
          <Button
            onClick={submit}
            disabled={loading()}
            class="text-xs font-mono px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading() ? "adding..." : "add record"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SubdomainCard({
  subdomain,
  onRefetch,
}: {
  subdomain: Subdomain;
  onRefetch: () => void;
}) {
  const [showForm, setShowForm] = createSignal(false);
  const [expanded, setExpanded] = createSignal(true);

  async function deleteRecord(record: DnsRecord) {
    if (!confirm("Delete this record?")) return;
    await fetch(`/api/subdomains/${subdomain.name}/records`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: record.type, value: record.value }),
    });
    onRefetch();
  }

  async function deleteSubdomain() {
    if (!confirm(`Delete ${subdomain.name}.loves.rs and all its records?`)) return;
    await fetch(`/api/subdomains/${subdomain.name}`, { method: "DELETE" });
    onRefetch();
  }

  console.log("Rendering card for: ", subdomain);

  return (
    <div class="border border-border rounded-lg overflow-hidden bg-card">
      <div
        class="flex items-center justify-between px-4 py-3 bg-card cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded(!expanded())}
      >
        <div class="flex items-center gap-2.5">
          <span class="font-mono text-sm text-foreground">
            <span class="text-primary">{subdomain.name}</span>.loves.rs
          </span>
          <Badge state={subdomain.state} />
          <span class="font-mono text-[11px] text-muted-foreground/50">
            {subdomain.records.length} record{subdomain.records.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div class="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            onClick={() => { setShowForm(!showForm()); setExpanded(true); }}
            class="text-xs font-mono px-3 py-1.5"
          >
            {showForm() ? "— cancel" : "+ add record"}
          </Button>
          <Button
            variant="destructive"
            onClick={deleteSubdomain}
            class="text-xs font-mono px-3 py-1.5"
          >
            delete
          </Button>
          <span class="text-muted-foreground/40 text-xs ml-1 select-none">
            {expanded() ? "▲" : "▼"}
          </span>
        </div>
      </div>

      <Show when={expanded()}>
        <Show when={subdomain.records.length > 0}>
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr class="border-t border-border bg-muted/30">
                <For each={["type", "name", "value", "created", ""] as const}>
                  {(h) => (
                    <th class="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider px-4 py-2 text-left font-normal">
                      {h}
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={subdomain.records}>
                {(record) => (
                  <tr class="border-t border-border/50 hover:bg-muted/20 transition-colors">
                    <td class="px-4 py-2.5 font-mono text-primary w-20">{record.type}</td>
                    <td class="px-4 py-2.5 font-mono text-foreground">{record.name}</td>
                    <td class="px-4 py-2.5 font-mono text-foreground">{record.value}</td>
                    <td class="px-4 py-2.5 font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td class="px-4 py-2.5 text-right w-16">
                      <button
                        onClick={() => deleteRecord(record)}
                        class="font-mono text-ctp-red/75 hover:text-ctp-red transition-colors"
                      >
                        <IconTrash class="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>

        <Show when={subdomain.records.length === 0 && !showForm()}>
          <div class="px-4 py-4 font-mono text-xs text-muted-foreground/50 border-t border-border">
            no dns records yet — add one to activate this subdomain
          </div>
        </Show>

        <Show when={showForm()}>
          <AddRecordForm
            subdomain={subdomain.name}
            onSuccess={() => { setShowForm(false); onRefetch(); }}
            onCancel={() => setShowForm(false)}
          />
        </Show>
      </Show>
    </div>
  );
}

export default function SubdomainsPage() {
  const [showClaimForm, setShowClaimForm] = createSignal(false);
  const [ready, setReady] = createSignal(false);

  onMount(() => setReady(true));

  const [subdomains, { refetch }] = createResource(ready, fetchSubdomains);

  return (
    <div class="relative z-3 top-12 max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 class="text-2xl font-bold tracking-tight">My Subdomains</h1>

      <For each={subdomains()}>
        {(sub) => (
          <SubdomainCard
            subdomain={sub}
            onRefetch={refetch}
          />
        )}
      </For>

      <Show when={!subdomains.loading}>
        <Show when={(subdomains()?.length ?? 0) < 3}>
          <Button
            onClick={() => setShowClaimForm(!showClaimForm())}
            class="text-xs font-mono px-3 py-1.5 rounded bg-primary text-primary-foreground"
          >
            {showClaimForm() ? "cancel" : "+ claim new"}
          </Button>
        </Show>
      </Show>

      <Show when={showClaimForm()}>
        <div class="mb-4">
          <ClaimSubdomainForm
            onSuccess={() => {
              setShowClaimForm(false);
              refetch();
            }}
            onCancel={() => setShowClaimForm(false)}
          />
        </div>
      </Show>
    </div>
  );
}
