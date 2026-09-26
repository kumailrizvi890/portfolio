"""PawPass demo backend: a small, real retrieval-augmented pipeline over a
seeded shelter dataset.

This is genuine retrieval (keyword/BM25-lite scoring over a fixed corpus,
top-k selection, then answer composition grounded in the retrieved
records) rather than a call to the Gemini API, matching the "always works,
no API key required" constraint for a public recruiter-facing demo. The
real PawPass project swaps this retrieval + a small local corpus for a
vector index and an LLM call; the retrieval contract is the same shape.
"""

import json
import re
from collections import Counter
from http.server import BaseHTTPRequestHandler

PET_RECORDS = [
    {
        "name": "Biscuit",
        "species": "dog",
        "breed": "Shepherd mix",
        "age": "4 years",
        "status": "available",
        "location": "Bothell shelter, Kennel 3",
        "notes": "House-trained, good with kids, mild hip dysplasia managed with daily glucosamine.",
        "care_log": ["2026-09-20: vet check, weight stable at 62 lbs", "2026-09-24: adoption meet-and-greet scheduled"],
    },
    {
        "name": "Nimbus",
        "species": "cat",
        "breed": "Domestic shorthair",
        "age": "1 year",
        "status": "foster",
        "location": "Foster home, R. Alvarez",
        "notes": "Recovering from upper respiratory infection, on antibiotics through Oct 3.",
        "care_log": ["2026-09-18: started 10-day antibiotic course", "2026-09-25: appetite back to normal"],
    },
    {
        "name": "Pepper",
        "species": "dog",
        "breed": "Terrier mix",
        "age": "2 years",
        "status": "medical hold",
        "location": "Bothell shelter, Medical Bay 1",
        "notes": "Post-op ACL recovery, not available for adoption until cleared by vet on Oct 15.",
        "care_log": ["2026-09-10: ACL surgery completed", "2026-09-23: physical therapy session, good mobility progress"],
    },
    {
        "name": "Clementine",
        "species": "cat",
        "breed": "Orange tabby",
        "age": "6 years",
        "status": "available",
        "location": "Bothell shelter, Cat Room 2",
        "notes": "Senior cat, needs a quiet home without young kids, litter-trained, very affectionate.",
        "care_log": ["2026-09-21: dental cleaning completed", "2026-09-24: weekly weight check, stable"],
    },
    {
        "name": "Duke",
        "species": "dog",
        "breed": "Labrador mix",
        "age": "5 months",
        "status": "foster",
        "location": "Foster home, T. Nguyen",
        "notes": "Puppy, still working on crate training, up to date on first two rounds of vaccines.",
        "care_log": ["2026-09-19: second vaccine round administered", "2026-09-26: crate training going well, sleeping through the night"],
    },
    {
        "name": "Willow",
        "species": "rabbit",
        "breed": "Holland Lop",
        "age": "3 years",
        "status": "available",
        "location": "Bothell shelter, Small Animal Room",
        "notes": "Litter-trained, needs another rabbit or a lot of daily attention, slightly overweight.",
        "care_log": ["2026-09-22: diet adjusted, reduced pellet portion", "2026-09-25: weight re-check next Friday"],
    },
]


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _record_text(record: dict) -> str:
    return " ".join(
        [
            record["name"],
            record["species"],
            record["breed"],
            record["age"],
            record["status"],
            record["location"],
            record["notes"],
            " ".join(record["care_log"]),
        ]
    )


def retrieve(query: str, k: int = 3) -> list[dict]:
    query_tokens = Counter(_tokenize(query))
    scored = []
    for record in PET_RECORDS:
        record_tokens = Counter(_tokenize(_record_text(record)))
        overlap = sum(min(count, record_tokens[token]) for token, count in query_tokens.items())
        # Small boost for an exact name mention, the most common query shape.
        if record["name"].lower() in query.lower():
            overlap += 5
        if overlap > 0:
            scored.append((overlap, record))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [record for _, record in scored[:k]]


def compose_answer(query: str, hits: list[dict]) -> str:
    if not hits:
        names = ", ".join(p["name"] for p in PET_RECORDS)
        return (
            "I couldn't ground an answer in the current shelter records for that question. "
            f"I can currently answer questions about: {names}."
        )

    lines = []
    for record in hits:
        lines.append(
            f"{record['name']} ({record['breed']}, {record['age']}) is currently marked "
            f"'{record['status']}' at {record['location']}. {record['notes']} "
            f"Latest log: {record['care_log'][-1]}"
        )
    return " ".join(lines)


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

    def do_GET(self):
        # Lets the frontend list the seeded roster without a POST.
        self._send_json(200, {"pets": [{"name": p["name"], "species": p["species"], "status": p["status"]} for p in PET_RECORDS]})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        query = str(data.get("query", ""))[:500].strip()
        if not query:
            self._send_json(400, {"error": "Ask a question about a pet in the roster"})
            return

        hits = retrieve(query)
        answer = compose_answer(query, hits)
        self._send_json(
            200,
            {
                "answer": answer,
                "sources": [{"name": h["name"], "status": h["status"]} for h in hits],
            },
        )
