"""Regenerates public/resume-kumail-rizvi.pdf from the resume content on
file. Kept as a script (not a one-off) so the resume can be regenerated if
content changes, matching the "everything in the repo is real, reproducible
work" spirit of the rest of the project.

Run: python3 scripts/generate_resume.py
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.colors import HexColor

INK = HexColor("#18181b")
MUTED = HexColor("#52525b")
ACCENT = HexColor("#b45309")

styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=18, textColor=INK, spaceAfter=2),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=9, textColor=MUTED, spaceAfter=10),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=11, textColor=ACCENT,
        spaceBefore=12, spaceAfter=4, alignment=TA_LEFT,
    ),
    "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10, textColor=INK, spaceAfter=1),
    "meta": ParagraphStyle("meta", fontName="Helvetica-Oblique", fontSize=9, textColor=MUTED, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.5, textColor=INK, leading=13, spaceAfter=6),
}

doc = SimpleDocTemplate(
    "public/resume-kumail-rizvi.pdf",
    pagesize=letter,
    topMargin=0.55 * inch,
    bottomMargin=0.55 * inch,
    leftMargin=0.65 * inch,
    rightMargin=0.65 * inch,
    title="Syed Kumail Rizvi - Resume",
    author="Syed Kumail Rizvi",
)

story = []


def section(title):
    story.append(Paragraph(title.upper(), styles["section"]))
    story.append(HRFlowable(width="100%", thickness=0.6, color=ACCENT, spaceAfter=6))


def entry(role, org, period, detail):
    story.append(Paragraph(f"{role} <font color='#52525b'>| {org}</font>", styles["role"]))
    story.append(Paragraph(period, styles["meta"]))
    story.append(Paragraph(detail, styles["body"]))


story.append(Paragraph("SYED KUMAIL RIZVI", styles["name"]))
story.append(
    Paragraph(
        "kumailrizvi890@gmail.com | (425) 364-2649 | linkedin.com/in/syedkumailrizvi | github.com/kumailrizvi890",
        styles["contact"],
    )
)

section("Summary")
story.append(
    Paragraph(
        "Computer Science senior (B.S. Software Engineering) at University of Washington, Bothell, "
        "graduating December 2027, seeking full-time Software / AI Engineering (New Grad) and internship "
        "roles. Full-stack builder across Python, Java, Go, React, and TypeScript with hackathon experience "
        "shipping LLM-integrated products end to end, including a RAG-based chatbot, a rule-based scam "
        "classifier, and a Go microservice for fleet observability, from design through deployment.",
        styles["body"],
    )
)

section("Education")
story.append(Paragraph("B.S. Computer Science, Software Engineering <font color='#52525b'>| GPA 3.60</font>", styles["role"]))
story.append(Paragraph("University of Washington, Bothell &middot; Expected December 2027", styles["meta"]))
story.append(
    Paragraph(
        "Relevant coursework: Data Structures &amp; Algorithms I/II, Algorithm Analysis &amp; Design, "
        "Software Engineering, Database Systems, Computer Programming I/II.",
        styles["body"],
    )
)

section("Technical Skills")
story.append(Paragraph("<b>Languages:</b> Python, Java, Go, C++, TypeScript, JavaScript, HTML, CSS", styles["body"]))
story.append(Paragraph("<b>Frameworks:</b> React, Next.js, Tailwind CSS, Pygame", styles["body"]))
story.append(
    Paragraph(
        "<b>Infra &amp; Platforms:</b> Git, REST APIs, OAuth/SSO, distributed systems, Azure, Vercel, Supabase, Docker",
        styles["body"],
    )
)
story.append(
    Paragraph(
        "<b>AI/ML:</b> LLM integration, OpenAI &amp; Gemini APIs, Retrieval-Augmented Generation, Text-to-Speech APIs, MCP tool orchestration",
        styles["body"],
    )
)

section("Projects")
entry(
    "Cluster Pulse", "Personal project",
    "2026",
    "Go microservice simulating fleet health, latency, and rollout risk scoring for a set of production-style "
    "clusters, deployed as a Vercel serverless function with a live TypeScript dashboard on top.",
)
entry(
    "Qmail, AI Scam-Detection Email Client (PWA)", "5th Place, WSU Hackathon 2025",
    "2025",
    "Led branding, UX, and build of an Apple-inspired, responsive PWA in React/TypeScript/Tailwind. Shipped "
    "AI-powered scam detection (LLM-based content classification with JSON response parsing), SSO login "
    "(Replit OAuth), and encrypted message storage seeded by Azure Quantum RNG.",
)
entry(
    "UP2DATE, AI Internship Application Optimization Platform", "DubHacks Hackathon",
    "2025",
    "Originated the idea and led a 4-person team; built the front end for a platform predicting internship "
    "posting windows from historical data, plus AI-driven resume and cover-letter keyword optimization.",
)
entry(
    "PawPass, Shelter & Foster Coordination Platform (PWA)", "Personal project",
    "2025",
    "Built an offline-capable PWA with pet profiles, care logs, shift checklists, and emergency alerts. Built "
    "a retrieval-augmented (RAG) chatbot grounding Gemini responses in an internal pet-records database.",
)
entry(
    "AI Workflow Automation, Personal Operations Platform", "Claude (Anthropic)",
    "2025 to present",
    "Built a multi-agent automation system on Claude, integrating 10+ MCP tools (Notion, Gmail, job-search/CRM "
    "APIs) into scheduled workflows, with live dashboards replacing manual tracking across job search and "
    "business operations.",
)

section("Work Experience")
entry("Brand Ambassador", "Instacart, Caper Carts", "Jul 2024 to Oct 2024",
      "Supported the launch of Instacart's AI-powered Caper Carts, driving a 25% increase in customer "
      "engagement through hands-on guidance across 500+ product implementations.")
entry("Service Crew", "Hot Iron Mongolian Grill", "Jul 2023 to Jul 2024",
      "Managed restocking, cashiering, and customer service, contributing to $5,000+ in daily sales.")

section("Leadership & Activities")
entry("Vice President", "Pakistan Student Association, UW Bothell", "Jul 2023 to Jul 2026",
      "Organized and led 5+ events per academic year, including Iftar gatherings and cricket matches.")
entry("Vice President", "International Student Society, UW Bothell", "Jul 2023 to Jul 2026",
      "Partnered with student groups on career and academic programming, including Global Careers CPT/OPT "
      "sessions. Founding member, Cricket Club.")

section("Awards")
story.append(
    Paragraph(
        "Dean's List (5 terms, 2024-25) &middot; Valedictorian, Top 5%, Henry M. Jackson HS (4.0 GPA) &middot; "
        "WA State Honors Award (Top 10%) &middot; Cambridge CAIE O-Levels: 7 A*s, 1 A",
        styles["body"],
    )
)

doc.build(story)
print("Wrote public/resume-kumail-rizvi.pdf")
