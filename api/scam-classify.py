"""Cluster Pulse's sibling demo: the scam classifier behind Qmail.

This is a real, deterministic heuristic classifier (weighted lexical +
structural signal scoring), not a random number generator and not a live
call to a paid LLM API. It intentionally mirrors the *shape* of the
LLM-based classifier shipped in the real Qmail project (JSON-in, JSON-out,
signal list + rationale) without requiring an API key for recruiters
clicking around a public demo.

Runs on Vercel's Python runtime as a standard serverless function using the
BaseHTTPRequestHandler convention.
"""

import json
import re
from http.server import BaseHTTPRequestHandler

URGENCY_PHRASES = [
    "act now", "immediately", "urgent", "final notice", "your account will be",
    "within 24 hours", "verify your account", "suspended", "act today",
    "limited time", "last warning", "response required",
]

MONEY_PHRASES = [
    "wire transfer", "gift card", "bitcoin", "crypto", "western union",
    "processing fee", "claim your", "prize", "refund of $", "tax refund",
    "inheritance", "beneficiary",
]

CREDENTIAL_PHRASES = [
    "confirm your password", "click here to verify", "update your billing",
    "login to confirm", "social security number", "one-time code", "otp",
]

GENERIC_GREETINGS = ["dear customer", "dear user", "dear valued", "dear sir/madam", "dear winner"]

FREE_EMAIL_DOMAINS = {"gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com"}

CORPORATE_KEYWORDS = ["bank", "paypal", "amazon", "microsoft", "apple", "irs", "netflix", "support"]


def _find_hits(text: str, phrases: list[str]) -> list[str]:
    return [p for p in phrases if p in text]


def classify(subject: str, sender: str, body: str) -> dict:
    text = f"{subject}\n{body}".lower()
    sender_l = sender.lower().strip()

    signals: list[str] = []
    score = 0

    urgency_hits = _find_hits(text, URGENCY_PHRASES)
    if urgency_hits:
        score += 22
        signals.append(f"Urgency language ({urgency_hits[0]!r})")

    money_hits = _find_hits(text, MONEY_PHRASES)
    if money_hits:
        score += 30
        signals.append(f"Requests money movement ({money_hits[0]!r})")

    cred_hits = _find_hits(text, CREDENTIAL_PHRASES)
    if cred_hits:
        score += 28
        signals.append(f"Asks for credentials ({cred_hits[0]!r})")

    greeting_hits = _find_hits(text, GENERIC_GREETINGS)
    if greeting_hits:
        score += 10
        signals.append("Generic greeting, not addressed by name")

    link_count = len(re.findall(r"https?://", text))
    if link_count >= 2:
        score += 12
        signals.append(f"{link_count} outbound links in a short message")

    domain_match = re.search(r"@([\w.-]+)$", sender_l)
    domain = domain_match.group(1) if domain_match else ""
    claims_corporate = any(k in text for k in CORPORATE_KEYWORDS)
    if claims_corporate and domain in FREE_EMAIL_DOMAINS:
        score += 26
        signals.append(f"Claims to be a company but sends from {domain}")

    exclaim_count = text.count("!")
    if exclaim_count >= 3:
        score += 8
        signals.append("Excessive punctuation / urgency formatting")

    score = max(0, min(100, score))

    if score >= 65:
        verdict = "scam"
    elif score >= 30:
        verdict = "suspicious"
    else:
        verdict = "safe"
        signals = signals or ["No high-risk lexical or structural signals found"]

    rationale = {
        "scam": "Multiple high-weight signals fired together (money movement, credential harvesting, or spoofed sender). This pattern matches classic phishing structure.",
        "suspicious": "At least one meaningful risk signal fired, but not enough to fully confirm intent. Qmail would flag this for a second look rather than auto-block it.",
        "safe": "No urgency, credential, or money-movement patterns detected in subject or body.",
    }[verdict]

    return {
        "verdict": verdict,
        "score": score,
        "signals": signals,
        "rationale": rationale,
    }


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        subject = str(data.get("subject", ""))[:2000]
        sender = str(data.get("sender", ""))[:200]
        body_text = str(data.get("body", ""))[:6000]

        if not (subject or body_text):
            self._send_json(400, {"error": "Provide at least a subject or body to classify"})
            return

        result = classify(subject, sender, body_text)
        self._send_json(200, result)
