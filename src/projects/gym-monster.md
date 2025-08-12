---
title: "Gym Monster - Fitness Tracker"
date: "2025-08-12"
description: "A web-based fitness tracking tool built with Streamlit that allows users to track weight, visualize trends, manage weekly goals, and analyze progress using automatically calculated insights and interactive charts."
thumbnail: "GymMonsterThumbnail.png"
technologies: ["Streamlit", "Python", "Plotly", "Pandas", "Data Visualization", "CSV Processing"]
githubUrl: "https://github.com/JoshuaHartlep/Gym-Monster---Fitness-Tracker"
demoUrl: null
demoMessage: null
projectUrl: "https://gym-monster.streamlit.app/"
---

# My Own Personalized Fitness Tracking Program!

Anyone who's tried to track their fitness progress knows the struggle: you start with good intentions, logging everything meticulously, but then life gets busy and you fall off the wagon. When you come back weeks later, you're left staring at scattered data points trying to make sense of your progress.

Either that, or you have one blip-on-the-radar day where you seemingly lost all your progress of the past weeks. You wish you could look at your overall trends instead of just day-by-day, but whatever app you're using (ahem...MyFitnessPal) doesn't support anything like that.

That's exactly the problem I set out to solve with Gym Monster—a web-based fitness tracking tool that makes data entry effortless and progress visualization immediate.

---

**Want to try it out?** Download this [example CSV file](/src/assets/example_weight_data.csv) with sample weight data that you can drop directly into the app to see how it works!

---

## The Challenge

Most fitness apps are either too complex (requiring detailed macro tracking and workout logging) or too simple (just basic weight entry with minimal analysis). I wanted something in the sweet spot: powerful enough to provide meaningful insights, but simple enough that I'd actually use it consistently.

The key was handling real-world data patterns—missing days, inconsistent logging, and the need to see both short-term fluctuations and long-term trends at a glance.

## Key Features

Gym Monster centers around smart data visualization and flexible analysis tools. The core functionality includes daily weight tracking with **7‑day weighted averages** to smooth natural fluctuations, weekly trend analysis to identify patterns over time, and flexible date range viewing (1 week to all-time).

CSV import makes it easy to bring in historical data from other apps or devices, and interactive Plotly charts let you toggle series on/off to focus on what matters. The app also calculates average trends and projects a **goal date** so you have a realistic timeline—no spreadsheets required.

## Technical Implementation

I built Gym Monster using **Streamlit** for the interface, **Pandas** for data manipulation, and **Plotly** for interactive charts. That let me focus on the analytics rather than framework plumbing.

Because **Streamlit Cloud storage is ephemeral**, the current version works with **session-based CSV uploads**. The processing pipeline normalizes daily entries, computes calendar‑based rolling averages, detects data gaps (with dotted connectors for context), and optimizes the visuals for desktop and mobile.

## Real-World Impact

I’ve been using Gym Monster for my own tracking and it’s solved the exact problems I set out to address. The smoothed trends keep me from overreacting to daily noise, and the range controls let me zoom into recent progress or zoom out for the big picture. Importing old data from my tracker took minutes instead of hours of manual entry.

## What I Learned

This project drove home the value of tight UX in data apps: clear defaults, sensible smoothing, and controls that don’t fight the user. I also leveled up on lightweight cloud deployments—keeping dependencies lean and designing around ephemeral storage.

## What’s Next

To make Gym Monster truly useful for others (and for me on the go), I’m moving toward a **real MVP with accounts and persistent storage**:

- **Account management & auth:** Email/Google sign‑in so users have their own private datasets.  
- **Cloud persistence:** Save uploads, edits, and computed insights to a hosted database (e.g., Supabase/Postgres) instead of session memory.  
- **Per-user analytics:** All charts, projections, and summaries run against the user’s stored history and sync across devices.  
- **Mobile-first experience:** Ship as a PWA so it’s installable on phones, with fast loads and a clean touch UI.  
- **Public demo site:** Keep a free, shareable web version so people can try it instantly, then create an account to save progress.

The goal is a **deployable, scalable** app that anyone can use—still simple, still fast, but with the reliability of real accounts and storage.
