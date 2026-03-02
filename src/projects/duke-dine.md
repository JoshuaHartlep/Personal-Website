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