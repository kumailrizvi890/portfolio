"use client";

import { useEffect, useRef, useState } from "react";
import { PawPrint, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { trackRun } from "@/components/demo-run-counter";

type Message = { role: "user" | "assistant"; text: string; sources?: { name: string; status: string }[] };

const SAMPLE_QUESTIONS = [
  "Which dogs are available for adoption?",
  "What's Pepper's medical status?",
  "Tell me about Nimbus",
  "Who is fostering a puppy right now?",
];

export function PawPassDemo() {
  const [roster, setRoster] = useState<{ name: string; species: string; status: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask me about any animal in the shelter's current roster, I'll ground my answer in the real records to the right.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/rag-chat")
      .then((r) => r.json())
      .then((json) => setRoster(json.pets ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function ask(query: string) {
    if (!query.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text: query }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/rag-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", text: json.error ?? "Something went wrong." }]);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", text: json.answer, sources: json.sources }]);
      trackRun("pawpass");
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Network error reaching the retrieval backend." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 flex flex-col rounded-2xl border border-border bg-surface">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: 420 }}>
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-surface-2 text-foreground border border-border"
                }`}
              >
                {m.text}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.sources.map((s) => (
                      <span key={s.name} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-2 font-mono">
                        {s.name} &middot; {s.status}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <p className="text-xs text-muted-2 font-mono">retrieving...</p>}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex flex-wrap gap-1.5 pb-2">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted hover:border-muted-2 hover:text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a pet..."
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2 mb-3">Current roster (real data)</h3>
        <ul className="space-y-2">
          {roster.map((p) => (
            <li key={p.name} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
              <PawPrint size={16} className="text-accent" />
              <span className="text-foreground">{p.name}</span>
              <span className="text-muted-2 text-xs ml-auto font-mono">{p.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
