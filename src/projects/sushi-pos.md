---
title: "Sushi POS System"
date: "2025-05-12"
description: "A full-stack point-of-sale system built for restaurants — covers order management, table tracking, customer ordering, photo moderation, and a deep analytics panel called The Lens."
thumbnail: "KoiSushi.jpeg"
technologies: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "TanStack Query", "Tailwind CSS", "Supabase"]
githubUrl: "https://github.com/JoshuaHartlep/Sushi-Point-of-Sale-Interface"
demoUrl: "https://sushi-point-of-sale-interface.vercel.app/"
demoMessage: null
---

# Sushi POS System

This started as a personal project inspired by a local all-you-can-eat sushi place in Durham, NC. I wanted to build something that actually felt useful — not just a CRUD tutorial dressed up as a portfolio piece. What ended up shipping is a full-stack POS system covering menu management, order processing, table tracking, a customer-facing ordering UI, image moderation, and a full analytics panel I built from scratch called The Lens.

It's flexible enough to work for any restaurant, not just sushi.

## Stack

The backend is a FastAPI application written in Python 3.12, exposing a REST API under `/api/v1`. The database is PostgreSQL hosted on Supabase, accessed via SQLAlchemy. The frontend is React + TypeScript, built with Vite and styled with Tailwind CSS. State and server data are managed with TanStack React Query and React contexts. Images are stored on backend disk and served directly by FastAPI.

In production the frontend runs on Vercel, the backend on Render, and the database on Supabase. The split means the frontend deploys instantly on every push, while the backend runs as a persistent web service.

## Manager Interface

The manager side of the app is where most of the operational complexity lives.

**Dashboard** gives a quick read on the day — order counts, revenue stats, and a recent orders feed with per-order totals. It's the landing page when staff open the app.

**Menu management** handles categories, items, meal period availability (lunch / dinner / both), item availability toggles, and official item images. Each menu item also has a customer photo gallery that managers can review directly from this page.

**Orders** covers the full lifecycle — creating orders, editing line items, updating statuses, applying discounts, and adding order notes. The system distinguishes between AYCE (all-you-can-eat) and regular orders, which affects pricing logic throughout.

**Modifiers** lets managers create per-category add-ons and modifications with their own pricing.

**Tables** tracks status (available, occupied, etc.), capacity, and party/guest fields. CRUD throughout.

**Settings** has a General tab wired to the backend — restaurant name, timezone, current meal period (lunch or dinner), and AYCE prices for each period. The other settings tabs (Notifications, Security, Users, Billing) are UI placeholders for now.

## Customer Ordering UI

The customer-facing interface lives at `/customer` and is completely separate from the manager view. It's table-aware via a `?table=` query param — the app checks table availability and routes the customer through an onboarding flow before dropping them into the menu.

From there it's a two-tab layout: the menu and their current order (My Order). Customers can browse items, open a detail modal, add things to their cart, and place their order. Item availability is meal-period-aware — dinner-only items don't show up during lunch service, which is controlled from the manager side in real time.

AYCE vs regular pricing is driven by the restaurant settings and the customer's choice at onboarding, and it flows through to every item in the cart.

Customers can also upload photos for individual menu items, which go into a pending queue before they're approved and shown publicly. Every photo has a report button so other customers can flag inappropriate content.

Want to see it? Here's a live customer view: [Customer Ordering UI (Table 5)](https://sushi-point-of-sale-interface.vercel.app/customer?table=5)

## Customer Photo Moderation

Uploaded photos don't go live automatically. The flow is:

1. Customer uploads a photo → stored with `status = pending`
2. Pending photos are hidden from all customer-facing views
3. Manager opens `/moderation` and either approves (sets `status = approved`) or deletes the photo entirely — which removes both the file on disk and the database row
4. A separate `/moderation` Reported tab surfaces any photo with a nonzero report count
5. Only approved photos appear in the public gallery

The moderation page has a fullscreen lightbox for reviewing photos before making a call. It was one of the more satisfying features to build because it closes a real loop — customers can contribute to the app, but nothing goes public without a human in the middle.

## The Lens — Analytics Panel

The Lens is the part of this project I'm most proud of. It's a power-user analytics environment built for exploration: observe a number, drill into what drove it, compare it against another period, and let the system surface anomalies automatically.

I built it in three phases, all without pulling in any new libraries — raw SQL via SQLAlchemy `text()`, Python's stdlib `statistics` module for anomaly detection, and an SVG bar chart built from scratch.

### Phase 1 — Explore

The Overview tab has a time range selector (7 days, 30 days, or custom), a meal period filter, and a bar chart that renders from raw SVG. Clicking a bar zooms to that specific day.

Below the chart is a sortable drill table showing value, order count, and percentage of total. Clicking a row drills deeper — category → items in that category → day-of-week for those items. Each drill step pushes to a breadcrumb trail so you can backtrack.

The backend drives this with two endpoints: `/analytics/summary` for the bar chart (supports `group_by` values like `day`, `week`, `hour`, `category`, `item`, `order_type`) and `/analytics/drill` for the table (supports `dimension` values like `category`, `item`, `day`, `day_of_week`, `hour`, `table`). All endpoints share a unified filter layer so every combination of filters just works.

### Phase 2 — Compare and Explain

Compare mode swaps the drill table for a side-by-side A/B breakdown. You pick two time windows (or two meal periods), and the system runs the same dimensional query for both and merges the results with delta and percentage change. Positive deltas highlight in one color, negative in another.

The Explain button opens a DecomposePanel that breaks revenue into its component drivers — order count and average order value — with a daily timeseries underneath. It answers "why did this number change?" without requiring the user to know which dimension to look at first.

### Phase 3 — Signals

Signals is the automated anomaly detection tab. It scans daily metrics over a rolling 14-day window and flags any day that deviated significantly from expected behavior.

The method is intentionally transparent — no black boxes. For each metric (total revenue, order count, avg order value), the system computes the window mean and standard deviation using Python's `statistics` module, then calculates a z-score for each day: `z = (day_value − mean) / std`. Days where `|z| > 2` are flagged as medium severity; `|z| > 3` as high. If std is zero or there are fewer than 3 data points, the system returns nothing rather than producing garbage output.

Each signal card shows the metric, date, a plain-English message (e.g. "Revenue dropped 38% below 14-day average"), the z-score, and the actual vs. expected values. Clicking a card sets the date range to that specific day and drops you into the Overview drill view — so a signal is always one click away from exploration.

The Signals tab has a live badge showing the current anomaly count, and a methodology footnote at the bottom keeps the math visible so managers can judge whether to trust a given flag.

## What I Learned

Building this end-to-end sharpened a few things I'd only touched at the surface before:

- **Full-stack ownership** — designing a data model, writing the API, and then consuming that API in a UI that real people use surfaces every assumption you made in the schema. I rewrote parts of the orders model twice because the frontend kept revealing edge cases the backend hadn't thought about.
- **SQL as a first-class tool** — The Lens pushed me to write real analytical SQL instead of leaning on an ORM for everything. The shared filter/condition layer (`build_conditions()`) was one of the cleaner architectural decisions I made: one place that translates UI state into SQL WHERE clauses, used by every analytics endpoint.
- **UX under constraint** — the customer ordering flow has to work fast, on mobile, and with no training. That forced a level of UX care I don't apply to most internal tools.
- **Anomaly detection without overengineering** — the Signals feature could have been a machine learning problem. Keeping it as a z-score over a rolling window means it's auditable, fast, and doesn't require training data. Sometimes the right answer is statistics, not a model.
