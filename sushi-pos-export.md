---
pdf_options:
  format: A4
  margin: 18mm 22mm
  printBackground: true
stylesheet: sushi-pos-export.css
---

<div class="doc-header">
<h1>Sushi POS System</h1>
<div class="demo-video-link"><a href="https://youtu.be/hSqJBXkAYz8">🎬 Check out my demo video!!!</a></div>
<div class="doc-meta">Joshua Hartlep &nbsp;·&nbsp; <a href="https://github.com/JoshuaHartlep/Sushi-Point-of-Sale-Interface">GitHub Repo</a> &nbsp;·&nbsp; <a href="https://sushi-point-of-sale-interface.vercel.app">Link for Use</a></div>
<div class="tech-pills">
  <span class="tech-pill">React</span>
  <span class="tech-pill">TypeScript</span>
  <span class="tech-pill">FastAPI</span>
  <span class="tech-pill">Python</span>
  <span class="tech-pill">PostgreSQL</span>
  <span class="tech-pill">TanStack Query</span>
  <span class="tech-pill">Tailwind CSS</span>
  <span class="tech-pill">Supabase</span>
</div>
</div>

This started as a personal project inspired by a local all-you-can-eat sushi place in Durham, NC. I wanted to build something that actually felt useful, not just a CRUD tutorial dressed up as a portfolio piece. What ended up shipping is a full-stack POS system covering menu management, order processing, table tracking, a customer-facing ordering UI, image moderation, and a full analytics panel I built from scratch called The Lens.

It's flexible enough to work for any restaurant, not just sushi.

## Stack

The backend is a FastAPI application written in Python 3.12, exposing a REST API under `/api/v1`. The database is PostgreSQL hosted on Supabase, accessed via SQLAlchemy. The frontend is React + TypeScript, built with Vite and styled with Tailwind CSS. State and server data are managed with TanStack React Query and React contexts. Images are stored on backend disk and served directly by FastAPI.

In production the frontend runs on Vercel, the backend on Render, and the database on Supabase. The split means the frontend deploys instantly on every push, while the backend runs as a persistent web service.

## Manager Interface

The manager side of the app is where most of the operational complexity lives.

**Dashboard** gives a quick read on the day: order counts, revenue stats, and a live service feed with per-order totals and statuses. It's the landing page when staff open the app.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface dashboard.png" alt="Manager dashboard" />

**Menu management** handles categories, items, meal period availability (lunch / dinner / both), item availability toggles, and official item images. Each item card shows the photo, price, and description at a glance, with edit and delete actions inline.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface menu items.png" alt="Menu management page" />

Adding a new item is a single form covering name, description, price, category, meal period, and an image upload. The item shows up immediately in both the manager menu and the customer-facing ordering UI.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface add new menu item.png" alt="Add new menu item form" />

**Orders** covers the full lifecycle: creating orders, editing line items, updating statuses, applying discounts, and adding order notes. The system distinguishes between AYCE and regular orders, which affects pricing logic throughout.

**Modifiers** lets managers create per-category add-ons and modifications with their own pricing.

**Tables** tracks status (available, occupied, reserved, cleaning), capacity, and party/guest fields. The status board gives an at-a-glance read on the whole dining room.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface tables.png" alt="Dining hall table status board" />

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface add new table.png" alt="Add new table form" />

**Settings** has a General tab wired to the backend, covering restaurant name, timezone, current meal period, and AYCE prices for each period.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface settings and security.png" alt="Settings page" />

## Customer Ordering UI

The customer-facing interface lives at `/customer` and is completely separate from the manager view. It's table-aware via a `?table=` query param: the app checks table availability and routes the customer through an onboarding flow before dropping them into the menu.

The onboarding screen is minimal: confirm your table, set party size, and choose between AYCE (flat rate per person) or À La Carte (pay per item). That choice locks in pricing for the entire session.

<img class="mobile" src="public/images/Sushi POS Demo/customer interface/customerinterface logon menu.png" alt="Customer onboarding screen" />

From there it's a two-tab layout: the menu and the current order (My Order). Customers can browse items by category, open a detail modal to read the description, and customize with modifiers before adding to cart. Item availability is meal-period-aware, so dinner-only items don't show up during lunch service, controlled from the manager side in real time.

<img class="mobile" src="public/images/Sushi POS Demo/customer interface/customerinterface adding item.png" alt="Item detail modal with modifier options" />

AYCE pricing flows through to every item in the cart: individual items show as $0.00, with the flat-rate total displayed at the bottom.

<img class="mobile" src="public/images/Sushi POS Demo/customer interface/customerinterface order summary.png" alt="My Order tab showing AYCE cart" />

After placing an order, the customer gets a confirmation screen with their item list and a prompt to order more. The server is notified on the backend immediately.

<img class="mobile" src="public/images/Sushi POS Demo/customer interface/customerinterface order confirmation.png" alt="Order confirmation screen" />

Customers can also upload photos for individual menu items, which go into a pending queue before they're approved and shown publicly. Every photo has a report button so other customers can flag inappropriate content.

## Customer Photo Moderation

Uploaded photos don't go live automatically. The flow is:

1. Customer uploads a photo → stored with `status = pending`
2. Pending photos are hidden from all customer-facing views
3. Manager opens `/moderation` and either approves (sets `status = approved`) or deletes the photo entirely, removing both the file on disk and the database row
4. A separate Reported tab surfaces any photo with a nonzero report count
5. Only approved photos appear in the public gallery

The moderation page has a fullscreen lightbox for reviewing photos before making a call. It was one of the more satisfying features to build because it closes a real loop: customers can contribute to the app, but nothing goes public without a human in the middle.

## The Lens: Analytics Panel

The Lens is the part of this project I'm most proud of. It's a power-user analytics environment built for exploration: observe a number, drill into what drove it, compare it against another period, and let the system surface anomalies automatically.

The design was directly inspired by Bridgewater Associates' Secure Garden, Bridgewater's internal research platform built around the principle that understanding *why* a number moved matters more than the number itself. The Secure Garden is designed to let analysts move fluidly from aggregate observations to their component drivers, form hypotheses in real time, and surface signals across economic series without being forced down a pre-defined reporting path. The Lens mirrors that philosophy at a smaller scale. The drill-down flow replicates the same "observe → decompose → explain" loop: a high-level KPI card leads to a category breakdown, which leads to item-level attribution, which leads to time-of-day patterns, each step narrowing the hypothesis. The Compare mode maps directly to the kind of period-over-period analysis Bridgewater analysts run to isolate whether a change was driven by volume, rate, or mix. The Signals tab reflects Bridgewater's emphasis on systematized pattern recognition: anomaly detection should surface what humans might miss, not replace the judgment that follows. The methodology footnote, showing the z-score formula and thresholds inline, is a small nod to radical transparency: the math should always be visible so users can judge whether to trust a flag rather than treating it as a black box.

Built in three phases, all without pulling in any new libraries. Raw SQL via SQLAlchemy `text()`, Python's stdlib `statistics` module for anomaly detection, and an SVG bar chart built from scratch.

### Phase 1: Explore

The Overview tab has a time range selector (7 days, 30 days, custom), a meal period filter, and a bar chart rendered from raw SVG. Clicking a bar zooms to that specific day. Below the chart is a sortable drill table showing revenue, order count, and percentage of total by category.

Clicking a row drills deeper through category, items within that category, and day-of-week breakdowns, with a breadcrumb trail so you can always backtrack. The backend drives this through a shared filter layer that compiles UI state into SQL WHERE clauses, used by every analytics endpoint.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface the lens.png" alt="The Lens overview" />

### Phase 2: Compare and Explain

Compare mode swaps the drill table for a side-by-side A/B breakdown. You define two time windows, and the system runs the same dimensional query for both and merges the results, showing Period A, Period B, delta, and percentage change per row. Positive deltas highlight in one color, negative in another.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface the lens compare tool.png" alt="Compare mode A/B table" />

Drilling into a specific category from Compare mode keeps the same time windows in context, so you can trace exactly which items drove the delta. The Explain button opens a DecomposePanel that breaks revenue into its component drivers (order count and average order value), answering "why did this number change?" without requiring the user to know where to look first.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface the lens daily breakdown.png" alt="Drilled-down item breakdown" />

### Phase 3: Signals

Signals is the automated anomaly detection tab. It scans daily metrics over a rolling 14-day window and flags any day that deviated significantly from expected behavior.

The method is intentionally transparent with no black boxes. For each metric (total revenue, order count, avg order value), the system computes the window mean and standard deviation using Python's `statistics` module, then calculates a z-score: `z = (day_value − mean) / std`. Days where `|z| > 2` are flagged as medium severity; `|z| > 3` as high. If std is zero or there are fewer than 3 data points, the system returns nothing rather than producing garbage output.

Each signal card shows the metric, date, a plain-English message, the z-score, and actual vs. expected values. Clicking a card sets the date range to that specific day and drops you directly into the Overview drill view, putting exploration always one click away.

<img class="desktop" src="public/images/Sushi POS Demo/manager interface/managerinterface the lens signals.png" alt="Signals tab with anomaly cards" />

The tab has a live badge showing the current anomaly count, and a methodology footnote at the bottom keeps the math visible so anyone can judge whether to trust a given flag.

## What I Learned

- **Full-stack ownership:** designing a data model, writing the API, and then consuming it in a UI that real people use surfaces every assumption you made in the schema. I rewrote parts of the orders model twice because the frontend kept revealing edge cases the backend hadn't thought about.
- **SQL as a first-class tool:** The Lens pushed me to write real analytical SQL instead of leaning on an ORM for everything. The shared filter/condition layer was one of the cleaner architectural decisions: one place that translates UI state into SQL WHERE clauses, used by every analytics endpoint.
- **UX under constraint:** the customer ordering flow has to work fast, on mobile, and with no training. That forced a level of UX care I don't apply to most internal tools.
- **Anomaly detection without overengineering:** the Signals feature could have been a machine learning problem. Keeping it as a z-score over a rolling window means it's auditable, fast, and doesn't require training data. Sometimes the right answer is statistics, not a model.
