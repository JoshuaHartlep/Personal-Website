---
title: "Bridgewater AI Innovation Hackathon: Building Mr. Krabs and Winning $10K"
date: "2026-04-25"
category: "writeups"
tags: ["bridgewater", "hackathon", "ai", "agents", "quant", "finance", "research-replication", "claude", "team-projects"]
thumbnail: "BridgewaterHackathonLandscape.png"
---

<img src="/images/BridgewaterHackathonLandscape.png" alt="Bridgewater AI Innovation Hackathon 2026" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin-bottom: 1.5rem;" />

From April 23-25, after two rounds of interviews, Bridgewater Associates flew me out to their Westport headquarters as one of 24 students selected for their AI Innovation Hackathon.

Three days. One problem statement. A team of four. And a real-world quant finance challenge waiting in the brief.

We won.

---

## Inside Bridgewater

The hackathon was as much about exposure as it was about the build.

We met a ton of people across the firm, from the engineers who maintain their internal research platforms to the investment associates who actually pull these tools off the shelf to make real decisions. We got time with **Blake Cecil, their CIO**, and a window into the way Bridgewater thinks.

A few things stood out:

- **They are systematic about everything.** Investment ideas, internal decisions, even how they evaluate each other. The "Principles" framework isn't a marketing artifact, it's actively encoded into how the firm operates.
- **They invest enormously in tooling.** We got a peek at some of the internal systems they use to test hypotheses, generate alpha, and stay ahead of competitors. The bar for "is this signal real or are we fooling ourselves?" is unbelievably high.
- **Humility is a feature, not a sentiment.** Over and over, the people we met emphasized that markets are noisy, that causality is hard to prove, and that the most dangerous thing you can do is mistake a model's output for the truth. Their job is partly to build great models, and partly to stay deeply suspicious of them.

That last one stuck with me the most.

It's a principle I'm now actively bringing into my own work, including [DukeDine's agentic architecture](/projects/duke-dine), where the Coach, Synthesis, and Analyst agents are all explicitly told to *cite or admit the gap*. Calling that pattern "Bridgewater Principles in the system prompt" wasn't an accident, even before this trip. After spending three days inside the building, I'm even more convinced it's the right default.

---

## The Problem: Replicate Research, Find the Cracks

The brief was sharp:

> Build a system that takes a quantitative finance research paper as a PDF and the relevant dataset, and attempts to replicate the paper's key results end-to-end.

Sounds simple. It is not.

Replicating published research is one of the most time-consuming steps in the actual investment process. Before Bridgewater can act on a paper's claim, someone has to reverse-engineer the methodology, wrangle the data, write the code, and debug every discrepancy. This routinely takes days.

But the deeper problem isn't speed. It's that **every paper has gaps between what the authors did and what they wrote down.**

Did "monthly rebalancing" mean end-of-month or first-of-month? Did the paper skip the formation month? Did they value-weight or equal-weight? Did the result survive the post-publication decade? Does the alpha survive transaction costs and capacity constraints, or is it only theoretically tradeable?

The challenge wasn't just *"did it replicate."* It was *"where did it diverge, why, and is the original finding actually robust, or is it the result of unstated assumptions plus noise?"*

That framing was the entire point. And it was Bridgewater-coded.

---

## Mr. Krabs

<img src="/images/MrKrabs.png" alt="Mr. Krabs paper replication system" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin: 1.5rem 0;" />

We named our system **Mr. Krabs**, because it sniffs out the value (or lack of it) in a research paper.

It's a multi-agent pipeline that takes a PDF in one end and produces an implementability verdict on the other. End-to-end, here's the flow:

### Extract
A **methodology extractor agent** reads the paper and fills out a structured `ReplicationSpec`: which stocks, which signal, which weighting, which sample window. Every field is required to come with a verbatim supporting quote, which a deterministic fuzzy-matcher then verifies against the original PDF text. No quote, no claim.

### Adversarially Review
A second agent is forced to produce **exactly three criticisms** of the extraction. Not "any issues you see," because that produces "looks good to me." Forcing a fixed count forces the model to actually search for problems. High-severity criticisms get promoted into the spec's ambiguity list.

### Map and Backtest
A data-mapper figures out the best available substitute for what the paper requested ("CRSP monthly returns, 1965-1989" → "Yahoo monthly closes, 1995-2024, with explicit survivorship-bias flag"), then a fully deterministic backtest engine actually runs the strategy. We validated the engine against Ken French's published momentum factor and hit a **+0.80 correlation across 288 overlapping months**.

### Diagnose Divergence
This was the cleverest piece. When the replication's number doesn't match the paper's, our **divergence diagnostician** doesn't speculate. It *experiments*. For each ambiguity in the spec, it mutates one parameter, reruns the engine, and reads the result. *"What if we restrict to the pre-publication sample? What if we flip the skip-month? What if we value-weight instead?"*

The LLM never invents numbers. The engine produces them. The agent just picks which experiment to run and interprets the pattern.

### Stress Test
A robustness battery runs six families of stress tests, all deterministic: lag sensitivity, transaction-cost sweep, subperiod stability, liquidity filters, capacity analysis, and point-in-time contamination checks. Then a final **robustness adversary agent** reads the whole report and writes an implementability verdict.

The headline output isn't "yes it replicated." It's something like:

> Paper claims 0.95%/month. Replicated at 0.48% over post-1994 sample. Under realistic T+2 execution with 25 bps costs and a liquid-names-only constraint, implementable alpha is 0.14%/month. Signal is information-based with a 7-day half-life. Capacity caps at ~$500M before implementation shortfall dominates. 4 of 9 stress tests passed meaningfully.

That's the difference between *theoretical alpha* and *implementable alpha*. And it's the question Bridgewater told us, in the problem statement and in person, that they care about most.

---

## What I'm Most Proud Of

Three things, honestly.

**1. Every claim is sourced.** Click any number in our final report and the UI walks you back through which `BacktestResult` produced it, which spec was the input, which supporting quotes from the PDF backed each spec field, and which D2 experiment isolated each diagnosis. Nothing in the system is unsourced. That auditability was a deliberate echo of the "show your work" culture we kept hearing about.

**2. The agents are intellectually humble by design.** The methodology extractor is required to flag commonly-unstated choices as ambiguities even if it feels overly cautious. The divergence diagnostician validates every hypothesis with a real engine rerun, not a vibe. The verdict agent classifies signals into categories (structural / information-based / microstructure / stale) and reports a kill count out of nine stress tests. We can't prove a paper is wrong. We can show, with receipts, where the gaps are and how sensitive the result is to filling them.

**3. We shipped a polished MVP.** Web UI, FastAPI backend, demo mode, full agent pipeline, robustness battery, divergence diagnosis, the works. In three days.

---

## We Won

Of the 24 students and 6 teams, **our team took one of the two top prizes: $10,000**.

I'm still a little stunned writing that.

---

## Thank You

This whole thing felt unreasonably generous from start to finish.

Thank you to **Bridgewater** for flying us out, opening the doors of the Westport campus, walking us through the systems they've built, and spending real time with us when they didn't have to. The exposure to how the firm actually thinks, what they invest in, and what they look for in early-career hires was worth more than the prize money.

Thank you to **our mentors** for sitting with us through the rough edges of the build, pushing back on our shortcuts, and helping us see what "Bridgewater-quality" really means.

Thank you to **the recruiters** who set every piece of this up, from the interview rounds to the travel logistics to the dinners. The level of polish was a clinic in itself.

And thank you to **my teammates**. None of this happens without you.

I came home with a project I'm genuinely proud of, a clearer model of what great quant research looks like, and a principle I'll carry into every system I build from here on:

*The model is not the truth. Stay humble. Show your work.*
