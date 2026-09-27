"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setErrorMsg("Network error. Please try emailing directly.");
      setStatus("error");
    }
  }

  const reduce = useReducedMotion();

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Let’s talk
        </motion.h2>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Hiring for a new-grad or internship SWE / AI engineering role? This form writes straight to my
          database (yes, the one Supabase demo above is reading from too) - and pings my phone the moment
          it lands.
        </p>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-status-ok/30 bg-status-ok/10 p-6 text-sm text-status-ok"
          >
            Message received. I’ll get back to you at the email you gave, usually within a day.
          </motion.div>
        ) : (
          <motion.form
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-border/70 bg-surface/40 p-6 backdrop-blur-md sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
                  placeholder="Ada Lovelace"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent"
                placeholder="What are you hiring for?"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-status-down">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-transform hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
            <p className="text-xs text-muted-2">
              Prefer email? <a href={`mailto:${profile.email}`} className="underline hover:text-foreground">{profile.email}</a>
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
}
