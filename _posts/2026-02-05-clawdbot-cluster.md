---
layout: post
title: "Playing Around with OpenClaw/Clawdbot/<wbr>Moltbot"
date: 2026-02-05 12:00:00 -0000
---

*TL;DR Through vibecoding, I can now text a Telegram bot with experiment ideas and have it run them for me. In the process, I ended up with bespoke software for self-managing a small personal cluster. Also, it now comes up with its own experiments if I don't have enough jobs running.*

<figure class="my-8">
  <img src="{% link /img/clawdbot_telegram.png %}" alt="Telegram screenshot" class="rounded-lg shadow-md mx-auto lg:w-3/4" />
  <figcaption class="caption text-center">I am a neglectful advisor.</figcaption>
</figure>

* Table of Contents
{:toc}



Well, after my Twitter feed was nothing but [OpenClaw](https://github.com/openclaw) (f.k.a. Moltbot (f.k.a. Clawdbot)) for the past few weeks, I finally cracked and took it for a spin on a Raspberry Pi I had sitting around. Optional: [skip to the fun part](#the-fun-stuff-automated-experiments) 

# Warming Up

I'm frequently walking around, on public transit, or otherwise out and about and find myself messily dictating research ideas or to-do items into various apps on my phone. My intention is to return to them later when I can deal with them properly, but this process never goes so well in practice. The prospect of instead directing that stream into a Telegram bot connected to an LLM harness with a local filesystem seemed appealing. With all of the Claude Code/Codex/LLM Coding Agent hype out there, this seemed like a weekend project that I could try with minimal effort. 

I started to test the waters of my Clawdbot[^1] by asking it to go through my Twitter feed every day at 5:00 PM and send me only the highlights. The prompt I texted was essentially to filter to only good papers from people I follow while stripping out the dumb AI influencer reposts and stuff the algorithm throws in. It set up a daily cron job, and sent me an example digest. I sent a second text suggesting adjustments to the filtering logic to match more of what I wanted, and that was that. If I follow you on Twitter, please don't prompt inject me after reading this :) 

<figure class="my-8">
  <img src="{% link /img/clawdbot_twitter_digest.jpeg %}" alt="Twitter digest screenshot" class="rounded-lg shadow-md mx-auto lg:w-1/2" />
  <figcaption class="caption text-center">It's over. This MIT/DeepMind/Stanford/OpenAI/Apple/Berkeley paper changes everything 🔥 </figcaption>
</figure>
      
## Moving Fast and Breaking Things

With the Twitter digest working, I tried out the original reason I even started messing with this in the first place: organizing thoughts I dictate throughout the day. I asked Clawdbot to set up a to-do list manager that would accept dictated items through Telegram messages, categorize them (research ideas, to-dos with varying priorities, etc.). Its default setup was of course to write everything to local files, which would be great if I were running it on a machine I use, but this was on my Raspberry Pi, and it's not as useful to have mobile idea ingestion if I can't also read them from my phone! I could text it to give me the priority stuff, but it was just as easy to send a prompt asking it to spin up a web interface to view them in a more organized fashion (almost like the todo list apps I already have on my phone that work perfectly...). I was already using the Pi as a Tailscale node, so this setup was a very natural way for me to access the files Clawdbot was writing on all my devices without exposing anything publicly. Amazing!

Then I sent it a new todo item, and the previous list I had sent got wiped out. Also amazing!

I then felt vindicated for having been skeptical of letting these setups run wild (hence why I set this thing up on an idle Raspberry Pi). Thankfully my caution had previously led me to set up version control for the bot's "brain" state earlier (git repo with periodic commits when files stabilize). My first instinct was "Ugh, now I have to go back and find where things got lost and then restore." Thankfully, before I got around to doing that, my laziness instincts kicked in and I just texted it what happened. It searched through the git history, found what it did wrong, restored the lost items, and then updated its own instructions to avoid making that mistake again.[^2] Amazing?

# The Fun Stuff: Automated Experiments

For some reason, this ridiculous failure mode emboldened me to try something much more involved. Since I was already dictating research ideas, the next step was obvious: have it also implement those ideas and run the experiments for me. <small>this is a normal thing to bring up when people ask what I did over the weekend</small>

The main hurdle here was logistical constraints: I didn't want to spend money on this, and I also was not going to taint any of my actual research setup with this (so no access to the real compute cluster I use, obviously). Even for toy experiments to validate the setup, I would need some other hardware. In the scrappy spirit of this hacking endeavor, I chose to use a handful of older machines I had with various aging accelerators. The first version of this workflow looked like a launcher script that would `ssh` into a machine, `rsync` the code repository (to avoid needing credentials for private repos on all of the "compute nodes" and limit network bandwidth), and run an experiment command in a `tmux` session. This was good enough for playing around, but I wanted much better tooling.

The obvious issues with this hodge-podge setup are:
* Setting up environments on these different machines would be a pain
* No simple way to "launch" or queue up jobs to run on the resulting "cluster" 
Perhaps this experience has changed how I think about blockers like this, because in hindsight, I basically just forced the model to write custom solutions to take care of both of these issues. 

The first thing I did was vibecoding was essentially a lightweight scheduler, which for a single user ended up looking like a submission queue. Everything is just files: the queue is just a JSON file, which the launch command writes to. I can edit the file by hand to reorder, delete, or add experiments (or one of my LLM agents can). A separate utility checks which machines are busy (by inspecting `tmux` sessions) and dispatches jobs from the front of the queue to idle nodes. Then there were a few other generic management utilities to check the cluster status/availability, clean up prior jobs, cancel jobs already running, and run commands across multiple machines[^3]. 
For what it's worth, I did all of this infra stuff on my laptop with Gemini CLI. I guess even with the express goal of playing around texting Clawdbot, I wanted to have some amount of supervision over the code being written.

## Settling the Mac Mini/$5 VPS/Raspberry Pi debate

I threw together a baseline repository (based on some public repos) from which it could build out some simple research ideas. I started out with some basic RL setups using some fast `jit`-ed JAX environments. The problem was that my Raspberry Pi (model 4B, 2GB RAM, 16GB microSD card) is so underpowered that even the coding agents doing any sort of feature implementation can't run there. Even creating the virtual enironment would require more space than what I have available. Again, rather than legitimatize this mess by devoting better hardware to this setup, I forged ahead with more scrappiness. This time, it was aggressive prompting of Clawdbot to delegate all implementation tasks to cloud coding agents ([Jules](https://jules.google/docs/cli/reference) in my case). In addition to the obvious benefit of offloading the work from the Pi, this also had the effect of spreading my token usage across several providers and accounts. 

<div class="highlight-block">
<strong>The Workflow:</strong> I text Clawdbot an experiment idea -> it delegates code implementation to Jules -> Jules opens a PR once it's done -> Clawdbot merges in the changes, observing what was added -> Clawdbot writes the command and config needed to run the experiments -> experiment is queued and launched on the mini-cluster
</div>

```
┌───────────────┐              ┌───────────────┐              ┌───────────────┐
│               │──(1) Idea───►│               │──(2) Spec───►│               │
│ Telegram (me) │              │   Clawdbot    │              │ Jules (cloud) │
│               │              │               │◄──(3) PR─────┤               │
└───────────────┘              └───────┬─▲─────┘              └───────────────┘
                                       │ │
                            (4) Launch │ │ (5) Results
                                       │ │
                                       │ │
                               ┌───────▼─┴─────┐
                               │               │
                               │ Compute Nodes │
                               │               │
                               └───────────────┘
```

For those who managed to avoid reading about this discourse, there has been a hilarious [trend](https://x.com/steipete/status/2015252888528859603) of people buying Mac minis to run Clawdbot. I think my position on the subject is pretty clear (though I'm hardly the first person to use a Raspberry Pi). More capable hardware definitely would have made things easier and required fewer workarounds, but the system resulting from these constraints might even be better as a result?


## Letting it Rip

Not to be satisfied too easily with the nice tooling I had now, I then texted Clawdbot to add cluster stuff to its dashboard service web app it was already running with my todo list. Now I could see the cluster status, queued jobs, past (completed) experiments. 

<figure class="my-8">
  <img src="{% link /img/clawdbot_cluster_status.png %}" alt="Cluster dashboard screenshot" class="rounded-lg shadow-md mx-auto" />
  <figcaption class="caption text-center">Fresh, untamed wilderness</figcaption>
</figure>


At this point, I basically had exactly what I set out for: a bot that I can text with ideas that would implement and run experiments for me while I'm on the go. For some reason, I asked Clawdbot to also add utilization metrics to the dashboard, which is basically when the wheels came off thanks to the following thought: 

<div class="callout callout-important">
<div class="callout-content"><em class="text-xl">There's no reason that these machines should ever be idle.</em>
</div>
</div>


The first step on the way to 100% utilization was to set up a cron job that checks the current cluster status. If the cluster reaches a certain idle threshold, it sends me a message on Telegram asking me to come up with another experiment idea. Of course, this was never going to be enough to keep the machines busy 24/7, so I texted Clawdbot to update the cron service such that if I didn't respond in 15 minutes, then it should come up with its own research idea, implement it, launch it, and then text me what it came up with. 

In order for this not to be a recipe for total slop, there needed to be a bit more tooling to manage the research process. My solution for this was to force the agent to do some bookkeeping whenever it launches an experiment. I (through prompting) modified the experiment launching process to automatically create an entry in an experiment notebook with fields for the intent of the experiment and reproducibility information, inspired by [Eugene Vinitsky's research notebook desiderata](https://www.eugenevinitsky.com/posts/personal-rules-of-productive-research/). 

<figure class="my-8">
  <img src="{% link /img/clawdbot_experiment_notebook.png %}" alt="Experiment notebook screenshot" class="rounded-lg shadow-md mx-auto" />
  <figcaption class="caption text-center">What a diligent student </figcaption>
</figure>


This ended up being implemented as a SQLite database, which also has the nice benefit of tracking where experiments were run (on which machine and the path to the results directory based on an experiment ID). This allowed developing another utility command to fetch the logs or experimental results from any compute node, inspired by [xm-slurm](https://github.com/JesseFarebro/xm-slurm/). 

Fetching the results was key for populating the most important field of the experiment notebook: *the implied next experiment*. With access to this notebook, the agent could plausibly synthesize logical next steps based on the results of prior experiments, and make prioritization choices based on the entire notebook. In my opinion, this was now finally beginning to scratch the surface of approaching the outer fringes of starting to look like something resembling a primitive research agent.


# Reflections

There's plenty of chatter nowadays about automating scientific research and AI research assistant startups, some of which aren't training their own models. I was curious to see what baseline you could achieve just by orchestrating existing models. And by orchestrating, I mean hacking together.

I was thinking about releasing some code for this, but I think the whole point is that the code for this doesn't really matter. The only "effort" was in the system design, and a lot of these choices were very specific to my personal setup (in the same vein of "personal software" inspired by [Tim Dettmers' recent blog post](https://timdettmers.com/2026/01/13/use-agents-or-be-left-behind/)).

## *Is this actually useful?*


I don't know yet. There's a good chance this was just a funny exercise that was mostly me procrastinating more important things, and that supervising a setup like this would only waste my future time. On the other hand, the whole point of this setup was to delegate experiment ideas that I wouldn't have spent my own time implementing anyway. The cost of running these experiments for me is basically zero, so even a vanishingly small chance of producing an interesting result is worth it. These kinds of throwaway hypotheses are a great use case for these agents that are likely going to make implementation errors. I'm OK with the prospect of the models producing a lot of bugged implementations that result in uninspiring experimental results (≈ false negatives); I can just ignore them and wait until I see an interesting result and then go investigate it myself. If I end up seeing a lot of seemingly interesting results that end up being artifacts of poor implementation (≈ false positives, which would waste my time), then I'll re-evaluate this setup.

---

P.S. Thank you to my grandfather for giving me the original Raspberry Pi for my birthday back when it came out! 

[^1]: You can tell how late I am blogging this based on the timing of the [name](https://x.com/openclaw/status/2016058924403753024?s=20) [changes](https://x.com/openclaw/status/2017103710959075434?s=20). 
[^2]: Minor detail: I actually had instructed the Clawdbot agent to use Gemini CLI for coding, which is what was used here.
[^3]: Cool trick I had previously used for something like this: naming the ssh targets with numbers and then using `xpanes --ssh cnode-{0..42}` from [tmux-xpanes](https://github.com/greymd/tmux-xpanes).