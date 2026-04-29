---
title: "DukeDine - Campus Dining Tracker"
date: "2026-03-02"
description: "A full-stack meal logging application for tracking dining experiences at Duke University facilities with nutrition tracking, featuring a React Native mobile app, React web dashboard, and Node.js backend deployed on AWS EC2 with Docker."
thumbnail: "LogoDarkMode.png"
technologies: ["React Native", "Expo", "React", "Node.js", "Express", "Supabase", "PostgreSQL", "Docker", "AWS EC2", "Tailwind CSS", "Redis"]
githubUrl: null
demoUrl: null
demoMessage: null
projectUrl: "https://dukedine.com"
---

# DukeDine: Tracking What You Eat on Campus

As Duke students, we technically have access to nutritional information through NetNutrition, which is a legacy web app that lists ingredients and macros for every dining hall item.

But in reality, almost nobody uses it.

The UI is clunky. It’s difficult to search. There’s no way to log meals. No history. No personalization. No feedback loop.

And if you’re trying to eat intentionally or even just consciously, whether that means hitting protein goals, maintaining weight, or just avoiding mystery calories, staying consistent in a university dining hall is incredibly difficult.

DukeDine was built to fix that.

We bring all Duke dining data into a modern platform where students can log meals, track nutrition over time, and instantly see which foods align with their goals.

---

## Motivation

This project started when a friend approached me with the idea:  
“What if there were a better way to track what we’re actually eating at Duke?”

We realized there was no existing solution built specifically for university dining ecosystems. Generic calorie trackers don’t integrate with campus menus. NetNutrition only displays static data. There was no system that connected:

- Dining hall menus  
- Actual meal logging  
- Longitudinal nutrition tracking  
- Goal-based feedback  

We wanted to build something that genuinely helped students eat better without adding friction to their lives.

University is one of the hardest environments to maintain a clean diet. You’re busy. Food is buffet-style. Portions are ambiguous. Temptation is everywhere.

So we built a system that makes the “healthy choice” the easy choice.

---

## The Blue Devil Score (Deterministic Macro Scoring)

One of our core features is a deterministic macro scoring model we call the **Blue Devil Score**.

Instead of telling users what they *should* prioritize, we let them decide.

Users can dynamically adjust sliders to weight:
- Protein
- Calories
- Micronutrients
- Other nutritional factors

Each menu item is then scored using a deterministic formula based on those weights.

This gives every food a personalized score that reflects how well it aligns with that user’s specific goals.

It’s simple.
It’s transparent.
And it updates instantly.

Rather than overwhelming users with raw macro tables, we translate complex nutrition data into an intuitive signal.

---

## The Tech Stack

DukeDine is built as a modern, production-grade full-stack system.

### Mobile App (React Native + Expo)
- Offline-first architecture using SQLite
- TanStack Query for synchronization
- Queued logging when offline
- Designed to feel native and fast

### Web Dashboard (React + Tailwind)
- Admin dashboard for managing restaurants and menu data
- Analytics and reporting views
- Responsive UI with a focus on clarity and speed

### Backend API (Node.js + Express)
- RESTful API for menu data and meal logs
- Background job processing with BullMQ + Redis
- Python scraping scripts for ingesting NetNutrition data

### Database & Auth (Supabase + PostgreSQL)
- Relational schema modeling restaurants → menus → categories → items
- Row Level Security (RLS) policies
- Email and OAuth authentication
- Real-time subscriptions

---

## Data Ingestion: Scraping NetNutrition

Since NetNutrition has no public API, we built our own ingestion pipeline.

We wrote Python scripts that scrape the site, normalize the data, and populate our PostgreSQL database.

Challenges included:
- Inconsistent formatting
- Missing values
- Nested category structures
- Maintaining alignment with Duke’s menu hierarchy

We designed a schema in Supabase that mirrors Duke’s restaurant → menu → category → item structure, ensuring everything stays relational and queryable.

This forced me to deeply understand:
- Database normalization
- Foreign key constraints
- Indexing for performance
- Data consistency across updates

---

## Iron Logic: Going Agentic

About halfway through the project, DukeDine grew a second half.

The nutrition side is structured: menus, items, macros, logs. Clean relational data.

But strength training isn't like that.

When you finish a lift, you don't fill out a form. You jot something into your notes app:

> *bench 225x5x3, last set felt heavy, 6hrs sleep, 200mg pre*

That's not a row in a database. That's prose with structure buried inside it.

So we built **Iron Logic**, an agentic subsystem that lives alongside the nutrition tables. It turns messy brain dumps into structured workout data, runs RAG over your reflections, and reasons across your training, sleep, caffeine, and mood.

It's the second half of DukeDine, and it's the part I learned the most building.

---

### The Three Core Agents

Iron Logic runs on three Claude agents (via AWS Bedrock), each with a single job.

**Parser** — takes a brain dump and emits structured JSON via tool-use. One row per *set*, not per exercise, so working-set fidelity is preserved. It also pulls out any daily-life signals the user mentioned (sleep hours, caffeine, mood) and routes them to a separate `iron_daily_metrics` table.

**Synthesis** — runs automatically on page load. Correlates recent workouts with recent macros and writes a short prose summary. Hard guardrail: if the overlap is too thin, it returns *"Correlation data insufficient for a principled conclusion."* instead of inventing one.

**Coach** — RAG-grounded Q&A. Embeds the user's question, runs pgvector cosine search over their reflections, and answers with cited dates. If the evidence isn't there, it says so.

Each one is small. Each one does one thing. And each one is forced to admit when it doesn't know.

---

### Bridgewater Principles as System Prompts

This is the part that took the longest to get right.

The default failure mode of an LLM is confident hallucination. For a fitness coach that's a deal-breaker. If the Coach tells me my bench went up 15 lbs in March when it didn't, I lose trust in the entire app.

So every agent's system prompt encodes intellectual humility, modeled on Ray Dalio's *Principles*:

- **Parser:** prefer `null` over a guess.
- **Synthesis:** the insufficient-data clause is non-negotiable.
- **Coach:** cite the date or admit the gap.
- **Splitter:** never assign a date you can't justify.

Then we layer a **citation verifier** on top — a post-hoc check that scans every date and number the agent claims and confirms it actually appears in the input. If verification fails, the response comes back with `verified: false` and the UI surfaces an unverified-warning badge.

The humility isn't decoration. It's the product.

---

### The Iron Analyst

Phase 1 added a fourth agent that triangulates structured workouts × daily metrics × retrieved reflections, then returns prose plus a **provider-neutral chart spec**:

```
{ type, x, y, series: [{ name, color, points: [{ x, y, date, label }] }] }
```

Web renders it with recharts, mobile renders the same shape with React Native View primitives. If we ever swap chart libraries, only those two renderers change. The agent's contract is stable.

---

### Adversarial Vision

For nutrition labels and meal photos, we use Claude vision with two tools:

- `record_nutrition` / `record_meal` — commit a confident parse.
- `request_clarification` — admit ambiguity, return a question with options and a reason.

Instead of writing zero-macro garbage when the model can't read a label, the modal shows the user the actual question: *"Is this serving size 1 cup or 2/3 cup?"* with one-click options.

For meal photos there's no OCR fallback (OCR can't help with a plate of food), but the same adversarial pattern applies — the model returns dishes, per-dish confidence, and a full assumptions list. The user sees what the model assumed *before* saving.

---

### The Splitter Agent

Phase 3e tackled multi-day notes-app dumps. Paste a week of training in one shot and the Splitter Agent breaks it into per-day chunks.

The hard rule: **never guess a date.**

- "today," "tonight," "yesterday" → safe to anchor.
- Absolute dates → resolve directly.
- "Monday" → only if there's an absolute marker elsewhere in the dump.
- Anything fuzzier ("a few days ago") → ask.

If anything is ambiguous, the splitter returns a clarification request with proposed dates as one-click buttons. The whole dump is transactional — every chunk parses, embeds, and commits in one BEGIN/COMMIT, or none of it does.

A wrong split silently corrupts every downstream metric. So the splitter is allowed to be slow, but never wrong.

---

### Teach the Coach

The Parser knows standard lifting shorthand out of the box (`@RPE`, `BW`, `ss`, plate counts, set-paren notation). But everyone has personal shorthand.

When the Parser sees notation it doesn't recognize, it adds it to an `unfamiliar_terms` array with 1-3 guesses. The UI shows each one as a chip with the model's guesses; the user confirms in one click and the term is saved to a per-user glossary.

Phase 3f.C added a bootstrap pass — a separate agent reads every reflection a user has written and proposes draft glossary entries with verbatim quotes as evidence.

The Coach gets smarter the more you use it.

---

### Date-Aware Tool Loops

The Coach and Analyst default to a 30-day window for cost and prompt size. But users ask things like *"how was my bench Feb 2"* or *"since November."*

Both agents now have a `load_history(from_date, to_date)` tool they call mid-conversation when they need data outside the default window. The agent loops — invoke → tool_use → tool_result → invoke — up to four calls per request. The route returns a `tool_calls` audit trail so the UI can show *"fetched March data"* and the user knows exactly what the agent looked at.

It's a small change with a big UX payoff: the agent stops saying *"I don't have data for that"* when the data exists, it just wasn't loaded.

---

### Stack notes

- **Claude** via `@anthropic-ai/bedrock-sdk` — Sonnet 4.6 for chat, Haiku 4.5 for vision.
- **Embeddings** via Cohere `embed-english-v3` on Bedrock (1024-dim, asymmetric document/query).
- **Vector store**: pgvector inside the same Supabase Postgres.
- **Guest mode**: a fixed demo user seeded with 4 weeks of realistic training data. Demo agent endpoints are live but rate-limited per IP and capped by a global daily token budget — recruiters can ask real questions and get real, citation-checked answers without burning the wallet.

---

### What Building Agents Taught Me

CRUD apps live in code. Agentic apps live in prompts.

The Coach's behavior isn't really defined by the route handler — it's defined by the system prompt, the tool schemas, and the citation verifier sitting on the response. Changing one word in a prompt can change the entire feel of the product.

That was uncomfortable at first. Code is precise. Prompts are not.

But once I leaned into it, three lessons stuck:

- **System prompts are policy, not boilerplate.** The Bridgewater humility rules are what make the app trustworthy. Soften them and the product softens with them.
- **Tool-use is the right escape hatch.** Forcing the model to choose between *commit* and *admit ambiguity* is dramatically better than hoping it phrases its uncertainty in prose.
- **Provider-neutral contracts age well.** Pinning the chart spec, the embedding dimension, and the API shape — not the specific library or model — meant we swapped Voyage → Cohere with one file changed.

Iron Logic is still evolving. But the scaffolding is in place, and I now think about every new feature as either *deterministic* or *agentic* before writing a single line.

---

## Docker, AWS, and Deployment

Before DukeDine, I had never deployed a full-stack application to production.

Now we run on AWS EC2 using Docker containers.

### Docker

I learned how to:
- Write Dockerfiles
- Use multi-stage builds
- Manage environment variables securely
- Handle port mappings
- Containerize backend services and Redis

Understanding containerization fundamentally changed how I think about environments and reproducibility.

### AWS EC2

We configured:
- EC2 instances
- Security groups
- Nginx reverse proxy
- SSL certificates
- Domain routing

Deployment was one of the hardest parts of the project. Things that work locally do not always work in production. Debugging environment mismatches, networking issues, and service communication taught me more than any class could.

### CI/CD & Team Workflow

Since this is my first serious team project, I had to learn professional collaboration practices:

- Feature branching
- Pull requests
- Code reviews
- Writing clear commit messages
- CI pipelines
- Automated testing
- Deployment workflows

When you work alone, you can be messy.

When you work with teammates, your code has to communicate.

That shift was huge for me.

---

## Major Challenges

### 1. Schema Design in Supabase
Getting all relational tables interconnected correctly was harder than expected. Restaurants connect to menus, menus to categories, categories to items, and items to logs.

Small schema mistakes compound quickly.

### 2. Authentication
Managing authentication across mobile and web while enforcing RLS policies required careful configuration and debugging.

### 3. Offline-First Architecture
Ensuring logs sync correctly when users reconnect to the internet required queue design and conflict handling.

### 4. Scaling Considerations
We’re actively thinking about:
- Caching strategies (Redis)
- Concurrent user handling
- Optimizing expensive queries
- Preventing scraping failures

---

## Working on a Real Team

This project has been a crash course in collaborative engineering.

A friend brought the idea.
I teamed up with my roommate and another close collaborator.

We’ve had to:
- Divide ownership cleanly
- Merge conflicting changes
- Design interfaces between frontend and backend
- Document decisions
- Ship incrementally instead of perfectly

It’s very different from building solo side projects.

And it’s made me significantly more disciplined as an engineer.

---

## Future Goals

We are nowhere near finished.

Next steps include:

- Refining the mobile UI and improving responsiveness
- Turning it into a fully polished mobile app
- Improving caching and backend robustness
- Scaling to other universities that use NetNutrition
- Supporting additional nutrition platforms
- Adding machine learning models to help users understand trends and predict goal progress

Long term, we want DukeDine to work for any university student trying to eat intentionally.

---

## Lessons Learned

DukeDine taught me:

- How real systems break in production
- How to design relational databases properly
- How to deploy and maintain cloud infrastructure
- How to collaborate in a structured engineering environment
- How to turn a vague idea into a live product

Most importantly, it showed me the difference between writing code and building systems.

And that difference is everything.