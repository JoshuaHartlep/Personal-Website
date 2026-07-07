---
title: "Halfway Through My First Software Engineering Internship at Asana"
date: "2026-07-01"
category: "professional"
tags: ["asana", "software-engineering", "internship", "ai", "retrieval", "nyc", "professional-development"]
thumbnail: "AsanaWTCView.jpg"
---

<img src="/images/AsanaWTCView.jpg" alt="Working on a laptop on the office terrace with One World Trade Center in the background" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin-bottom: 1.5rem;" />

Finding housing in New York City was probably the first real project of this internship.

I had never had to do anything like that before. Sublets, neighborhoods, commute times, prices that make absolutely no sense, and trying to figure out whether a listing was real or sketchy from a few photos. It was a whole thing. But once I finally got settled, walked into the World Trade Center, and looked out at Jersey on one side and Brooklyn on the other, it hit me pretty quickly how unreal this opportunity was.

<img src="/images/AsanaHudsonView.jpg" alt="View west across the Hudson River toward Jersey City from the office, with a military ship passing by" style="width: 100%; max-width: 800px; height: auto; border-radius: 8px; margin: 1.5rem 0;" />

I'm now about halfway through my first software engineering internship at Asana, and honestly, I feel like I'm learning a new layer of software engineering that school and personal projects just don't really expose you to.

## From Group Chats to Real Engineering Workflows

Most of the projects I've built before this were either personal projects or things with friends. And in those cases, the workflow was basically a group chat.

"Just pushed."

"Can you pull?"

"Wait I broke something."

"Try it now."

That works when the stakes are low and the team is small. But enterprise software is a completely different world.

During onboarding, one of the most interesting things for me was seeing how much structure exists around writing, reviewing, testing, and shipping code at a company like Asana. I had obviously heard about pull requests before, and I've opened PRs on my own projects, but this is the first time I've really been part of a real PR flow with real reviewers, real tests, internal aliases, ownership boundaries, dashboards, observability, deployment processes, and actual consequences if something breaks.

The real lesson is that shipping code is the easy part. Making sure the next person can understand it, trust it, and maintain it after you've moved on to the next thing is the actual job.

## Learning to Think Past the Happy Path

One of the biggest shifts so far has been learning to think beyond the happy case.

In class, and honestly in a lot of personal projects, it's easy to write code that works for the example you have in front of you. You test the main flow, see the right output, and move on. But real production code doesn't get to assume that everything goes perfectly.

What if a chunk gets omitted? What if something retries? What if a job partially succeeds? What if data is missing, duplicated, delayed, or too large? What if the same operation runs twice and needs to end in the exact same state?

One thing that's been drilled into me is that you always assume something is going to fail, and the job is making sure that failure gets handled gracefully instead of surfacing straight to the UI. My first real fix was exactly that kind of edge case: making sure counts were only accumulated when a summary was actually appended, and that omitted work stayed tracked correctly instead of just disappearing. It wasn't some big rewrite, just one condition in the wrong place, but if it shipped as-is, a user would've seen a wrong number with zero explanation. That's the actual failure mode you're trying to catch. I added a regression test for it and moved on, but it reframed how I think about edge cases. They're not extra credit. They're the actual work.

I've also been learning vocabulary that sounds abstract until you need it. Idempotency. Non-atomic writes. Sentinel values. These are the kinds of terms that come up in real systems because real systems fail in messy ways.

And yes, the infra still randomly fails sometimes and Bazel can be annoying. So at least some things are universal.

## My First Project: Observability

My first main project was an observability project, and I think it was a really good starting point.

I followed the format of some of my mentor's previous PRs and used that as a guide for how to structure my own work. That was helpful because it taught me not just what the code should do, but what "good" looks like inside the existing codebase.

This project also exposed me to tools you just don't really touch in the classroom. Datadog, Scalyr, Otto, internal dashboards, logs, metrics, traces, and the general question of how you know what your system is doing after it ships.

Before this internship, I thought of observability as something that happens after the "real" engineering work. Now I'm realizing it's part of the engineering work. If you can't see what your system is doing, you can't confidently improve it. And if you're working on AI systems, where outputs can be probabilistic and workflows can get complicated fast, that visibility matters even more.

## Working on AI Retrieval

I'm on the AI Retrieval team, which has been especially exciting because it feels like we're working right in the middle of where software is going.

The team works on helping Asana's AI systems find and use the right work graph data so they can produce useful high-level outputs. That sounds simple until you think about the scale of the problem. Real organizations have massive amounts of data, and agentic workflows need to retrieve the right context without being too slow, too expensive, or too noisy.

My second project has been working with another engineer on the team to develop a new retrieval tool for AI agents. This has been super fun because it's not just "go implement this small function." A lot of the work is thinking through how the tool should fit into the backend, how it should interact with other tools, what tradeoffs we're making, and how we can reduce cost while improving performance.

That's the kind of engineering I'm realizing I really enjoy: technical, but not just syntax-technical. It's architecture, product intuition, systems thinking, and communication, all at once.

## Coding With AI Agents Is Changing What I Learn

Another interesting part of this internship is that I'm learning how to use AI agents for coding in a real professional environment.

The more I use these tools, the less the job feels like memorizing exact syntax, and the more it feels like making good architectural decisions. That doesn't mean syntax and implementation details don't matter. They obviously do. But the bottleneck is shifting.

It's becoming more important to know what to build, how to break it down, what risks to watch for, how to review the output critically, and how to communicate with your manager and teammates about the plan.

There's also a very real sense that the software industry is changing fast. We have a Slack channel where people keep up with agentic and LLM developments, and the pace is insane. It feels like every week there's a new model, tool, benchmark, workflow, or company announcement that changes what "good" looks like.

Asana is clearly taking that seriously. There's a huge emphasis on shipping quickly and staying at the forefront of SaaS products, especially as the company positions itself as **the OS for human-agent teams**. Being on AI Retrieval makes that feel especially relevant, because retrieval is one of the core pieces that determines whether an AI agent is actually useful or just confidently wrong.

## The People Part

One thing I didn't fully appreciate before this internship is how much professional software engineering is about people.

My mentor, Soleil, has been amazing. She's overwhelmingly available whenever I have questions, whether that's during standup, over Slack, or when I just need help understanding why something is structured the way it is. Some of my favorite conversations with her haven't even been about work; we talk sports and culture as much as we talk code, and she's genuinely one of the smartest people I know. The rest of the team has been the same way. People are busy, but somehow still extremely willing to explain things, review my work, point me in the right direction, or give context I would never have figured out on my own.

We also actually eat lunch together. Every day, my team sets aside time to get up from our desks and eat as a group instead of just working through it, and it's become one of my favorite parts of the day. It's a small thing, but it says a lot about the team. Even on the days when working from home is an option, I still come in, partly to see everyone and partly because the vibe in the office is just that good.

During my midpoint meeting, one piece of feedback from my mentor stuck with me: I should keep asking more questions and take even more advantage of the smart resources around me.

That's something I'm trying to internalize.

At Duke, I'm used to being surrounded by smart people. But this is different. This is the most software engineering experience I've ever been around in my life, concentrated into one team, one office, and one company. If I leave questions unasked because I'm trying to look like I already know everything, that would be a complete waste.

## What I'm Taking Away So Far

Halfway through, the biggest lesson is that real software engineering is way broader than I understood. It's writing code, sure, but it's just as much about opening clean PRs, thinking through edge cases, reading other people's code, asking good questions, using AI tools without blindly trusting them, and learning how to ship quickly without being reckless.

The office view is still unreal, the World Trade Center still doesn't feel like a real place I get to work, and the actual engineering has been challenging in exactly the way I hoped it would be.

If the back half goes anywhere near as fast as the first, I'll blink and be back in Appleton.
