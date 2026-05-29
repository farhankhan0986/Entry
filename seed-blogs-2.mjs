/**
 * seed-blogs-2.mjs  —  run with: node seed-blogs-2.mjs
 * Inserts 10 additional rich blog posts across high-traffic categories.
 */

import mongoose from "mongoose";
import { config } from "dotenv";

// Load env from .env.local then .env
try { config({ path: ".env.local" }); } catch {}
try { config({ path: ".env" }); } catch {}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in environment.");
  process.exit(1);
}

// ── Blog Schema (mirrors /models/Blog.js) ────────────────────────────────────
const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true },
    content:     { type: String, required: true },
    category:    { type: String, default: "General" },
    authorName:  { type: String, default: "Entry Editorial" },
    authorId:    { type: String, default: null },
    authorEmail: { type: String, default: null },
    authorImage: { type: String, default: null },
    bannerImage: { type: String, default: "" },
    status:      { type: String, enum: ["published", "draft"], default: "published" },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

function slugify(title) {
  return title.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
}

// ── Seed Data (Batch 2) ─────────────────────────────────────────────────────
const blogs = [
  {
    title: "What AI Actually Cannot Do: The Limits Nobody Talks About",
    category: "Technology",
    bannerImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    content: `## The Hype Machine Is Running Hot

Every week brings a new headline: AI can write code, compose music, diagnose diseases, generate photorealistic images. And it's true — these systems are staggeringly capable in narrow domains.

But the breathless coverage obscures something important. There are fundamental things that current AI architectures *cannot* do, and understanding these limits is more valuable than understanding the capabilities.

Because the limits tell you where the humans still matter.

## The Frame Problem

In 1969, philosophers John McCarthy and Patrick Hayes identified something called the **frame problem** — the difficulty of specifying everything that *doesn't* change when an action is taken.

When you move a coffee cup from a table to a shelf, you effortlessly understand that the table still exists, the floor hasn't changed, gravity still works, and your relationship with your roommate remains the same. You don't compute these things. You just know.

AI systems don't. Every piece of contextual knowledge that seems obvious to a human must be explicitly encoded, trained on, or inferred. And the real world contains an essentially infinite number of such "obvious" facts.

> This is why self-driving cars can navigate highways flawlessly but struggle with a construction worker waving traffic through with an improvised hand signal.

## Understanding vs. Pattern Matching

Large Language Models (LLMs) like GPT-4 produce text that *reads* as if it understands. But the mechanism underneath is statistical pattern completion — predicting the most likely next token given a sequence of previous tokens.

This distinction matters practically:

- **An LLM can write a poem about grief.** It cannot grieve.
- **An LLM can summarize a legal contract.** It cannot understand what justice means to the parties involved.
- **An LLM can generate a business plan.** It cannot feel the weight of risking your savings on an idea.

The philosopher John Searle called this the **Chinese Room argument**: a system can manipulate symbols perfectly without understanding what they mean.

## What AI Cannot Do (Today)

**1. Common-sense reasoning at scale.** AI can answer trivia questions but struggles with: "If I put my shoes in the oven, would they be warm or ruined?"

**2. Transfer learning across domains.** A model trained to play chess cannot use that strategic thinking to negotiate a salary. Humans do this effortlessly — it's called *analogy*.

**3. Genuine creativity.** AI generates novel *combinations* of existing patterns. It doesn't experience the dissatisfaction with the status quo that drives a human to create something genuinely new.

**4. Moral reasoning.** AI can be trained on ethical frameworks, but it cannot *care* about the outcome. Ethics without stakes isn't ethics — it's compliance.

**5. Knowing what it doesn't know.** AI systems hallucinate — they generate confident, fluent, completely fabricated information. They have no internal mechanism for uncertainty about their own outputs.

## Why This Matters for You

The people who will thrive alongside AI are not the ones who learn to use it fastest. They're the ones who understand where the machine ends and the human begins.

That boundary is where judgment lives. Where empathy operates. Where meaning is made.

AI is a spectacular tool. But a tool is not a mind. And confusing the two will cost us more than any technological failure ever could.`,
  },
  {
    title: "The 5 AM Myth: Why Waking Up Early Won't Fix Your Life",
    category: "Lifestyle",
    bannerImage: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1200&q=80",
    content: `## The Gospel of Early Rising

Open any productivity blog, bestseller list, or CEO interview and you'll encounter the same claim: successful people wake up at 5 AM. They meditate, journal, exercise, plan their day, and read 30 pages — all before the rest of the world has stirred.

The implication is clear: if you're not doing this, you're falling behind.

But the science tells a very different story.

## Chronobiology Is Real

Every human being has a **chronotype** — a genetically determined preference for when they're most alert and when they naturally sleep. This isn't a habit. It's biology, encoded in your DNA and regulated by the suprachiasmatic nucleus in your hypothalamus.

Research by chronobiologist Till Roenneberg at Ludwig Maximilian University of Munich has shown that chronotypes follow a roughly normal distribution:

- **~25% of people** are genuine early types ("larks")
- **~25% of people** are genuine late types ("owls")
- **~50% of people** fall somewhere in between

If you're a natural owl forced into a lark's schedule, you're not building discipline. You're fighting your own biology — and losing.

> "Forcing a night owl to wake at 5 AM is like forcing a left-handed person to write with their right hand. You can do it. But the work will suffer, and so will you." — Dr. Michael Breus, *The Power of When*

## What the Research Actually Shows

A landmark 2009 study published in *Science* by Archer et al. identified the gene **PER3** as a key determinant of chronotype. People with the longer variant of this gene are morning types; those with the shorter variant are evening types.

This means your optimal wake time isn't a choice. It's an inheritance.

Further research has shown that night owls forced into early schedules show:

- **Higher cortisol levels** throughout the day
- **Reduced cognitive performance** during morning hours (despite being awake)
- **Increased rates of depression and anxiety**
- **Greater reliance on caffeine and stimulants**

The 5 AM crowd isn't more disciplined. They're more *aligned* with their biology.

## What Actually Matters

The productive hours aren't the early hours. They're the hours that match *your* peak alertness.

**If you're a morning person:** Your best deep work window is roughly 8–11 AM. Use it for your hardest, most creative tasks.

**If you're an evening person:** Your cognitive peak likely hits between 4–9 PM. That's when you should schedule demanding work.

**If you're neither:** You likely have two peaks — late morning and late afternoon — with a dip after lunch. Plan accordingly.

## The Real Productivity Secret

It was never about the hour on the clock. It was about three things:

1. **Protecting a daily block of uninterrupted time** — regardless of when it occurs
2. **Sleeping enough** — 7 to 9 hours, aligned with your natural rhythm
3. **Knowing your peak hours** and defending them from meetings, notifications, and other people's urgency

The most productive thing an owl can do at 5 AM is stay in bed.

Stop optimizing the alarm clock. Start optimizing the alignment between your biology and your schedule. That's where performance lives.`,
  },
  {
    title: "Why You Buy Things You Don't Need: The Psychology of Consumer Behavior",
    category: "Psychology",
    bannerImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    content: `## The $14 Trillion Question

Global consumer spending exceeds $14 trillion annually. A significant fraction of that — estimates range from 40% to 60% — goes to things people didn't plan to buy and, in many cases, don't actually need.

This isn't stupidity. It's neuroscience. And the companies selling to you understand your brain better than you do.

## The Dopamine Prediction Error

When you spot something you want — a new jacket, the latest phone, a kitchen gadget you'll use twice — your brain releases **dopamine**. But here's what most people get wrong: dopamine isn't the pleasure chemical. It's the *anticipation* chemical.

Neuroscientist Wolfram Schultz's Nobel Prize-winning research showed that dopamine spikes not when you receive a reward, but when you *predict* one. The moment of wanting is neurologically more intense than the moment of having.

This is why shopping feels better than owning. The bag in the store is electric with possibility. The bag in your closet is just a bag.

> Retailers don't sell products. They sell the space between wanting and having — and they've learned to make that space as wide and intoxicating as possible.

## Seven Cognitive Biases That Empty Your Wallet

**1. The Anchoring Effect:** A $200 shirt seems reasonable next to a $500 shirt. The expensive item exists to make the cheaper one feel like a deal. J.C. Penney famously removed artificial markups and "sales" in 2012. Revenue dropped 25% in one year. Customers didn't want fair prices. They wanted the *feeling* of a bargain.

**2. Loss Aversion:** "Only 2 left in stock!" triggers fear of missing out that is roughly twice as powerful as the pleasure of gaining something. Kahneman and Tversky demonstrated this in their foundational 1979 paper on Prospect Theory.

**3. The Endowment Effect:** Once you touch something, try it on, or put it in your cart, you subconsciously feel you already own it. Returning it now feels like a loss. This is why car dealerships insist on test drives.

**4. Social Proof:** "Best seller," "Trending now," "12 people are looking at this." These signals bypass rational evaluation entirely. If others want it, your brain assumes it must be valuable — a heuristic that served us well on the savanna but is ruthlessly exploited in e-commerce.

**5. The Decoy Effect:** Given three options — small, medium, large — the medium option is often designed to be slightly worse than the large one, making the expensive choice seem like the obvious winner. Movie theaters have used this with popcorn pricing for decades.

**6. Present Bias:** The brain discounts future costs relative to present pleasure. A $50 impulse buy today feels trivial. Fifty of them over a year — $2,500 — would feel alarming. Buy-now-pay-later services exploit this asymmetry deliberately.

**7. The Diderot Effect:** Named after the French philosopher who was given a beautiful scarlet robe that made everything else he owned look shabby. One purchase triggers a cascade of "matching" purchases. A new phone demands a new case, new earbuds, and a new charging pad.

## How to Interrupt the Cycle

**The 72-hour rule:** For any non-essential purchase over $50, wait three days. If you still want it — and can articulate *why* — buy it. Most impulses evaporate within 24 hours.

**Track the feeling, not the item:** When you feel the urge to buy, write down what you're feeling emotionally. Boredom, stress, loneliness, and insecurity drive more purchases than actual need.

**Calculate in hours, not dollars:** A $120 purchase on a $30/hour salary costs four hours of your life. Reframing price as time makes the real cost visceral.

**Unsubscribe aggressively:** Every marketing email is a professionally crafted trigger. Unsubscribing isn't missing out. It's reclaiming your attention.

The goal isn't to stop buying things. It's to start buying them *on purpose*.`,
  },
  {
    title: "Dark Matter: The Invisible Substance Holding the Universe Together",
    category: "Science",
    bannerImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
    content: `## The Universe Has a Missing Mass Problem

In 1933, Swiss astronomer Fritz Zwicky was studying a cluster of galaxies called the Coma Cluster when he noticed something deeply wrong. The galaxies were moving too fast.

Based on the visible matter — the stars, gas, and dust he could observe — there wasn't nearly enough gravitational pull to hold the cluster together. The galaxies should have flown apart billions of years ago.

Zwicky concluded that there must be enormous amounts of invisible matter providing the missing gravity. He called it *dunkle Materie* — dark matter.

He was ignored for forty years.

## The Evidence Became Undeniable

In the 1970s, astronomer Vera Rubin was studying the rotation of spiral galaxies when she found the same problem Zwicky had identified, but at a galactic scale.

Stars at the edges of galaxies were orbiting just as fast as stars near the center. This violated everything Newtonian mechanics predicted — outer stars should have been moving far more slowly, the same way Pluto orbits the Sun more slowly than Mercury.

Unless the galaxies were embedded in massive halos of invisible matter that extended far beyond the visible edges of the galaxy.

> Rubin's observations were so clean, so repeatable, and so universal that they effectively ended the debate. Dark matter was real. We just couldn't see it, touch it, or detect it directly.

## What We Know

Dark matter constitutes approximately **27% of the total mass-energy content** of the universe. Ordinary matter — every star, planet, human being, and grain of sand — makes up just 5%. The remaining 68% is dark energy, which is an even deeper mystery.

Here's what we know about dark matter:

- **It has mass.** It exerts gravitational influence on visible matter, bending light through a phenomenon called gravitational lensing.
- **It doesn't interact with light.** It doesn't emit, absorb, or reflect electromagnetic radiation at any wavelength. It's invisible in the most literal sense possible.
- **It doesn't interact with ordinary matter** (except through gravity). It passes through walls, planets, and people as if they weren't there.
- **It's everywhere.** Computer simulations show that dark matter forms a vast cosmic web — a scaffolding of filaments and nodes along which galaxies cluster like dew on a spider's web.

## The Hunt

Physicists have been searching for dark matter particles for decades using three strategies:

**1. Direct detection:** Deep underground laboratories (like the XENON experiment in Italy and LUX-ZEPLIN in South Dakota) contain tanks of ultra-pure liquid xenon, waiting for a dark matter particle to collide with a xenon nucleus. After years of running, no confirmed detection.

**2. Collider production:** The Large Hadron Collider at CERN smashes protons together at nearly the speed of light, hoping to create dark matter particles. If produced, they would escape the detector, leaving a telltale gap in the energy balance. No confirmed signal yet.

**3. Indirect detection:** Space telescopes and gamma-ray observatories search for the products of dark matter particles annihilating each other in regions of high density. Tantalizing signals have appeared and then been explained by conventional physics.

## Why It Matters

We are made of the minority substance in the universe. The thing that makes up most of reality is something we cannot see, cannot touch, and — after ninety years of searching — cannot identify.

Dark matter is the largest unsolved problem in physics. Solving it will likely require new particles, new forces, or possibly an entirely new understanding of gravity itself.

Somewhere in the universe, the answer is hiding in plain darkness. And someone — perhaps reading this right now — will be the one to find it.`,
  },
  {
    title: "How to Learn Anything Faster: The Science of Accelerated Skill Acquisition",
    category: "Psychology",
    bannerImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80",
    content: `## The 10,000-Hour Rule Is Misleading

Malcolm Gladwell popularized the idea that mastery requires 10,000 hours of practice. The original research by K. Anders Ericsson said something more nuanced: it takes 10,000 hours of *deliberate* practice to reach *elite performance* in *highly competitive fields*.

For most skills — conversational Spanish, playing guitar, coding in Python, cooking Thai food — you don't need elite performance. You need functional competence. And that arrives much, much faster than you think.

Researcher Josh Kaufman found that the steepest part of the learning curve — going from "knowing nothing" to "reasonably good" — typically takes about **20 hours** of focused, intelligent practice.

Twenty hours. That's less than one hour a day for a month.

## Why We Overestimate the Time Required

The real barrier to learning isn't time. It's *emotional*.

The first few hours of any new skill feel terrible. You're clumsy, confused, and painfully aware of the gap between where you are and where you want to be. Psychologists call this the **competence gap** — the uncomfortable space between unconscious incompetence and conscious incompetence.

Most people quit here. Not because the skill is too hard, but because feeling incompetent is painful.

> The fastest learners aren't the most talented. They're the ones most willing to feel stupid for a little while.

## Seven Evidence-Based Techniques

**1. Deconstruction:** Break the skill into sub-skills. "Learn guitar" is overwhelming. "Learn four chords that appear in 80% of pop songs" is achievable in an afternoon. The Pareto principle applies ferociously to skill acquisition — a small subset of techniques generates the majority of results.

**2. Spaced repetition:** Reviewing material at increasing intervals (1 day, 3 days, 7 days, 14 days) produces dramatically better retention than cramming. Apps like Anki automate this. The science behind it — the **spacing effect** — was first documented by Hermann Ebbinghaus in 1885 and has been replicated hundreds of times.

**3. Interleaving:** Instead of practicing one thing repeatedly (blocked practice), mix different but related skills in a single session. A basketball player who alternates free throws, three-pointers, and layups learns more slowly in the short term but retains and transfers skills far more effectively.

**4. Active recall:** Close the textbook and try to reproduce what you just read from memory. This feels harder than re-reading — and that's exactly why it works. The effort of retrieval strengthens neural pathways. A 2011 study in *Science* by Karpicke and Blunt found that retrieval practice produced 50% better retention than elaborate concept mapping.

**5. Teach what you learn:** The **protégé effect** shows that people learn material more thoroughly when they expect to teach it. Even explaining a concept to an imaginary student forces you to organize your understanding and identify gaps.

**6. Sleep on it:** Memory consolidation — the process of converting short-term memories into long-term ones — happens primarily during sleep. Practicing a skill and then sleeping produces measurably better performance the next day than practicing and staying awake for the same duration.

**7. Embrace desirable difficulties:** Conditions that make learning harder in the moment (like testing yourself, varying practice conditions, or spacing sessions apart) produce stronger, more durable learning. Robert Bjork at UCLA calls these "desirable difficulties" — they slow the appearance of learning while accelerating the reality of it.

## The Meta-Skill

Learning how to learn is the most valuable skill in the modern economy. Technologies change. Industries shift. Specific expertise becomes obsolete.

But the person who can go from zero to competent in any new domain — quickly, systematically, and without panic — has a permanent advantage.

The world doesn't belong to the people who know the most. It belongs to the people who can learn the fastest.`,
  },
  {
    title: "The Fermi Paradox: Where Is Everybody?",
    category: "Science",
    bannerImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80",
    content: `## A Lunchtime Question That Changed Everything

In the summer of 1950, physicist Enrico Fermi was having lunch with colleagues at Los Alamos National Laboratory. The conversation turned to UFO reports — then, as now, a popular topic — and Fermi, with characteristic bluntness, asked a question that has haunted science ever since:

*"Where is everybody?"*

The question sounds simple. The implications are staggering.

## The Numbers

The Milky Way galaxy contains between 100 and 400 billion stars. Current estimates suggest that roughly 20% of Sun-like stars have at least one Earth-sized planet in the habitable zone — the region where liquid water could exist.

That means there are potentially **billions** of Earth-like planets in our galaxy alone.

The universe is 13.8 billion years old. Earth is 4.5 billion years old, and technological civilization has existed for roughly 100 years. Even if intelligent life is extraordinarily rare — a one-in-a-million chance per habitable planet — the galaxy should be teeming with civilizations millions of years more advanced than ours.

A civilization with even a modest rate of interstellar expansion would colonize the entire galaxy in about 1–10 million years. That's a blink in cosmic time.

So: where is everybody?

> "The apparent size and age of the universe suggest that many technologically advanced extraterrestrial civilizations ought to exist. However, this hypothesis seems inconsistent with the lack of observational evidence to support it." — The Fermi Paradox, formal statement

## The Leading Hypotheses

**The Great Filter:** Something in the development path from simple chemistry to spacefaring civilization is extraordinarily unlikely — a "filter" that almost no species passes through. The terrifying question is whether that filter is *behind* us (making us extraordinarily lucky survivors) or *ahead* of us (meaning our extinction is probable).

**The Zoo Hypothesis:** Advanced civilizations are aware of us but deliberately avoid contact, observing us the way wildlife researchers observe animals in a nature preserve — without interference. This presupposes a galactic consensus on non-interference, which raises its own questions.

**The Dark Forest Theory:** Popularized by Chinese author Liu Cixin in *The Three-Body Problem* trilogy, this hypothesis proposes that the universe is full of civilizations that remain deliberately silent because broadcasting your existence to unknown neighbors in a universe with finite resources is suicidally dangerous. Every civilization hides. Every civilization that doesn't is eventually destroyed.

**The Rare Earth Hypothesis:** Perhaps the conditions that produced complex life on Earth — a large stabilizing moon, plate tectonics, Jupiter acting as a cosmic shield against asteroids, our position in the galaxy — are so unlikely that Earth may be genuinely unique or nearly so.

**They're Already Here (In a Form We Don't Recognize):** A sufficiently advanced technology would be indistinguishable from natural phenomena. Perhaps we're swimming in evidence of alien intelligence and simply lack the framework to recognize it.

## The SETI Silence

Since 1960, the Search for Extraterrestrial Intelligence (SETI) has been scanning the sky for artificial signals. Radio telescopes, optical surveys, and — more recently — searches for megastructures and technosignatures have been running for over six decades.

The result: silence. Not a single confirmed artificial signal from beyond Earth.

This silence is data. What that data means is the greatest open question in human history.

## What the Paradox Really Asks

The Fermi Paradox isn't really about aliens. It's about us. It forces us to confront the possibility that intelligence, consciousness, and civilization might be fragile, rare, or self-terminating.

If we are alone — or effectively alone — then everything we build and know exists in a single, vulnerable spot in an incomprehensibly vast universe.

That makes what we do here matter more, not less.`,
  },
  {
    title: "Digital Minimalism: How to Declutter Your Digital Life in 30 Days",
    category: "Technology",
    bannerImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
    content: `## Your Phone Contains 80 Apps You Don't Need

The average smartphone has 80 installed apps. The average user regularly uses 9.

The remaining 71 apps sit there consuming storage, sending notifications, collecting data, and creating a persistent low-grade sense of obligation. Every red badge, every push notification, every "we miss you" email is a tiny claim on your attention — and attention, unlike money, cannot be earned back.

Digital minimalism isn't about becoming a Luddite. It's about being intentional with the most limited resource you have.

## The Philosophy Behind the Practice

Cal Newport, in his book *Digital Minimalism*, defines the approach as: "A philosophy of technology use in which you focus your online time on a small number of carefully selected and optimized activities that strongly support things you value, and then happily miss out on everything else."

The key phrase is *happily miss out*. Digital minimalism isn't deprivation. It's clarity.

> Most people treat technology like a buffet — taking a little of everything. Digital minimalists treat it like a curated menu — choosing deliberately, enjoying fully.

## The 30-Day Digital Declutter Protocol

### Week 1: Audit and Remove

**Day 1-2: The App Audit.** Open your phone. For each app, ask one question: "Would I reinstall this if my phone were wiped today?" If the answer is no, delete it. Don't archive it. Delete it.

**Day 3-4: Notification Purge.** Go to Settings → Notifications. Turn off *all* notifications except calls, texts from real humans, and calendar reminders. Everything else can wait until you choose to check it.

**Day 5-7: Unsubscribe Week.** Every time a marketing email arrives, unsubscribe before reading it. By the end of the week, your inbox will feel like a different place. Tools like Unroll.me can accelerate this, but doing it manually builds awareness of just how many companies are claiming your attention.

### Week 2: Restructure

**Day 8-10: Single-purpose devices.** Can you check email only on your laptop? Social media only on a tablet? Separating activities by device creates friction that prevents mindless scrolling. The goal isn't to make things impossible — just slightly harder.

**Day 11-14: Time-box digital consumption.** Set specific windows for checking email (twice daily), social media (30 minutes, once daily), and news (once daily, from a single trusted source). Outside these windows, those apps don't exist.

### Week 3: Replace

**Day 15-18: Fill the voids.** Digital clutter often fills voids — boredom, loneliness, anxiety. As you remove digital noise, those voids will surface. Prepare analog replacements: physical books, walks, conversations, hobbies that use your hands.

**Day 19-21: Rediscover deep leisure.** Leisure that requires skill and produces tangible results — woodworking, cooking, drawing, playing an instrument — provides satisfaction that passive consumption cannot. Schedule at least one hour of this daily.

### Week 4: Solidify

**Day 22-25: Design your digital environment.** Rearrange your phone's home screen to show only tools (maps, camera, calendar). Move social and entertainment apps to a second screen or folder. Out of sight doesn't mean out of mind — but it helps.

**Day 26-28: Establish rituals.** Create phone-free zones (bedroom, dining table) and phone-free times (first hour of the day, last hour before bed). These rituals compound over time into a fundamentally different relationship with your devices.

**Day 29-30: Reflect and adjust.** What did you miss? What didn't you miss? The answers will surprise you. Most people discover they miss far less than they feared.

## The Compound Effect of Digital Clarity

People who complete a digital declutter consistently report: better sleep, reduced anxiety, improved concentration, deeper relationships, and — perhaps most importantly — a feeling of *spaciousness* in their days that they'd forgotten was possible.

You don't need to throw away your phone. You need to make it serve you instead of the other way around.`,
  },
  {
    title: "The History of Money: From Cowrie Shells to Cryptocurrency",
    category: "Finance",
    bannerImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
    content: `## Before Money, There Was a Problem

Imagine you're a wheat farmer in ancient Mesopotamia. You need a new axe. The axe maker needs wool. The wool herder needs pottery. The potter needs wheat — but not from you, because she already has enough.

This is the **double coincidence of wants** — the requirement that, in a barter economy, each party must have exactly what the other wants at exactly the right time. It's an absurdly inefficient system, and for most of human history, it was the only system available.

Money solved this problem by creating a shared medium of exchange — something everyone would accept, regardless of what they actually needed.

But what counts as money has changed dramatically, and each transformation tells us something about what humans truly value.

## The First Currencies (9000 BCE – 600 BCE)

The earliest forms of money weren't coins or paper. They were objects that communities collectively agreed had value:

- **Cowrie shells** served as currency across Africa, South Asia, and East Asia for over 4,000 years. They were durable, portable, difficult to counterfeit (each shell is unique), and beautiful.
- **Cattle** were money in ancient Ireland, Rome, and parts of Africa. The Latin word *pecunia* (money) derives from *pecus* (cattle). A person's wealth was literally counted in heads.
- **Salt** was so valuable in the ancient world that Roman soldiers were partially paid in it — the origin of the word "salary" (from *salarium*).
- **Grain** functioned as currency in ancient Egypt. Farmers deposited grain in state warehouses and received receipts that could be traded — arguably the first banking system.

> The pattern is consistent: anything that is scarce, durable, divisible, portable, and universally desired can function as money.

## The Coin Revolution (600 BCE)

The first standardized coins were minted in Lydia (modern Turkey) around 600 BCE, stamped from **electrum** — a natural alloy of gold and silver. King Alyattes' coins bore a lion's head, certifying their weight and purity.

This was revolutionary. For the first time, you didn't need to weigh or test the metal. The king's stamp was a guarantee — an early form of institutional trust.

Coins spread rapidly across the ancient world. Athens, Rome, Persia, China, and India all developed sophisticated coinage systems. Money was becoming abstract — it was no longer about the inherent utility of the object, but about the trust placed in its issuer.

## Paper Money and the Power of Promise (7th Century CE)

China invented paper money during the Tang Dynasty (618–907 CE), though it became widespread during the Song Dynasty. Called *jiaozi*, these were promissory notes — certificates that could be redeemed for coin.

Paper money had obvious advantages: it was lighter, easier to produce in large quantities, and could represent any value. But it introduced a fundamental vulnerability: **inflation**. If the government could print money, what stopped it from printing too much?

The Mongol Yuan Dynasty found out the hard way. Kublai Khan's aggressive printing of paper currency without sufficient coin reserves led to rampant inflation and contributed to the dynasty's collapse.

This tension — between the convenience of printed money and the temptation to create too much of it — would echo through every century that followed.

## The Gold Standard and Its Collapse (1717 – 1971)

In 1717, Sir Isaac Newton (then Master of the Royal Mint) inadvertently established the gold standard by setting a fixed price for gold in British pounds. By the 19th century, most major economies had followed, tying their currencies to gold reserves.

The system provided stability but was inflexible. During crises — wars, depressions — governments needed to spend more than their gold reserves permitted.

On August 15, 1971, President Richard Nixon severed the US dollar's link to gold entirely. Money was now **fiat** — valuable because the government declared it so and because people trusted that declaration.

## The Digital Transformation (1990s – Present)

Today, over **92% of the world's money exists only as digital entries** in bank databases. Physical currency — coins and paper bills — represents a small and shrinking fraction.

Credit cards, wire transfers, mobile payments, and online banking have made money increasingly invisible. You can spend, earn, save, and invest without ever touching a physical object.

And then came cryptocurrency.

In 2008, an anonymous figure called Satoshi Nakamoto published a paper proposing **Bitcoin** — a decentralized digital currency secured by cryptography and maintained by a distributed network instead of a central bank.

Bitcoin's innovation wasn't digital money (that already existed). It was the elimination of trusted intermediaries. For the first time, two strangers could transfer value without a bank, government, or payment processor between them.

## What Money Actually Is

After 10,000 years, money is still the same thing it's always been: **a shared story about value**.

Cowrie shells worked because communities agreed they were valuable. Dollars work because nations agree they are. Bitcoin works because its network agrees it is.

The medium changes. The underlying mechanism — collective trust — never does.`,
  },
  {
    title: "The Art of Saying No: Setting Boundaries Without Guilt",
    category: "Lifestyle",
    bannerImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    content: `## The Most Expensive Word You Never Say

Every time you say yes to something you don't genuinely want to do, you're saying no to something you do. This isn't motivational poster wisdom. It's arithmetic.

Time is finite. Energy is finite. Attention is finite. Every commitment occupies space that could have been used for something else. The hidden cost of an unnecessary yes is always an involuntary no — to rest, to deep work, to the people and projects that actually matter to you.

And yet, for most people, saying no is one of the hardest things they do.

## Why Saying No Feels Impossible

The difficulty isn't intellectual. Everyone *knows* they should say no more often. The difficulty is emotional, and it runs deep.

**Evolutionary wiring:** For hundreds of thousands of years, human survival depended on group membership. Being excluded from the tribe was a death sentence. Your brain still treats social rejection as an existential threat — even when the "tribe" is a work colleague asking you to join a committee you don't care about.

**The approval instinct:** Psychologist Harriet Braiker coined the term "disease to please" — the chronic need to be perceived as helpful, agreeable, and accommodating. This pattern often develops in childhood, where approval was conditional on compliance.

**The reciprocity trap:** Social psychologist Robert Cialdini identified reciprocity as one of the most powerful forces in human behavior. When someone does something for you — or even just asks you nicely — the urge to reciprocate is almost irresistible. Saying no feels like breaking a social contract.

> "When you say yes to something you don't want to do, here is the result: you hate what you are doing, you resent the person who asked you, and you hurt yourself." — James Altucher

## The Hidden Cost of Chronic Yes-Saying

**Burnout:** The World Health Organization classified burnout as an occupational phenomenon in 2019. One of its primary drivers is the inability to set workload boundaries.

**Resentment:** Saying yes when you mean no breeds quiet hostility. You show up to the event, but you're checked out. You take on the project, but you do it with simmering frustration. People can feel this — and it damages relationships more than a clean no would have.

**Identity erosion:** Over time, chronic accommodation erodes your sense of self. When you consistently prioritize others' needs over your own, you lose contact with what you actually want. Many people in their 40s and 50s report a terrifying realization: they've built a life that looks right from the outside but feels hollow from the inside.

## A Framework for Better Boundaries

### 1. The "Hell Yes or No" Rule

Entrepreneur Derek Sivers proposed a simple filter: if a request doesn't make you think "hell yes!" — if you don't feel genuine excitement or commitment — the answer is no. This sounds extreme, but it works precisely because it counters the default bias toward yes.

### 2. Separate the Request from the Relationship

"No" is an answer to a *request*, not a rejection of a *person*. You can deeply value someone and still decline their invitation. The conflation of these two things is the source of most boundary guilt.

### 3. The Positive No

William Ury (co-author of *Getting to Yes*) developed the concept of the "positive no" — a no that's sandwiched between two yeses:

- **Yes** to your own priority: "I'm committed to finishing my thesis this month."
- **No** to the request: "So I can't take on the volunteer coordination."
- **Yes** to the relationship: "But I'd love to help with a smaller role in the spring."

This structure communicates respect while maintaining your boundary.

### 4. Practice the Pause

Never say yes immediately. Develop a default response: "Let me check my calendar and get back to you." This pause creates space between the request and your response — space where you can evaluate honestly instead of reacting reflexively.

### 5. Accept Discomfort Without Changing Course

The first few nos will feel awful. The person might be disappointed. You might feel guilty for days. This is normal. Discomfort is not evidence that you've done something wrong. It's evidence that you're changing a deeply ingrained pattern.

## The Paradox of Boundaries

Here's what no one tells you: people respect you *more* when you have boundaries, not less. A yes from someone who never says no is worth nothing — everyone knows it's reflexive, not meaningful.

A yes from someone who says no when they mean it? That yes carries weight. It means they're choosing to be here. It means they actually want to help.

Boundaries don't push people away. They tell people exactly where you stand — and that clarity is the foundation of every healthy relationship.`,
  },
  {
    title: "Neuroplasticity: Your Brain Can Rewire Itself at Any Age",
    category: "Science",
    bannerImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80",
    content: `## The Old Dogma Was Wrong

For most of the 20th century, neuroscience operated under a grim assumption: the adult brain was fixed. You were born with a certain number of neurons, they wired themselves during childhood, and after adolescence, the structure was essentially set. Learning might slow. Recovery from injury would be limited. Decline was inevitable.

This belief was called the **static brain doctrine**, and it dominated neuroscience for nearly a century.

It was wrong.

## The Discovery That Changed Everything

In the 1960s, neuroscientist Michael Merzenich began a series of experiments on owl monkeys that would overturn decades of dogma. He severed a nerve in a monkey's hand and then mapped the brain's somatosensory cortex — the region that processes touch.

What he found was astonishing. The brain region that had previously responded to the severed nerve didn't simply go dark. Within weeks, neighboring brain regions had *expanded* to take over the unused territory. The brain had reorganized itself.

Merzenich coined the term **neuroplasticity** — the brain's ability to physically restructure itself in response to experience, learning, and injury — throughout the entire lifespan.

> "The brain is not a computer that simply runs pre-installed programs. It is a living organ that physically reshapes itself based on what you do, what you think, and what you pay attention to." — Norman Doidge, *The Brain That Changes Itself*

## How Neuroplasticity Works

### Synaptic Plasticity

Every thought, movement, and sensation you experience activates specific neural pathways — chains of neurons connected by synapses. When a pathway is activated repeatedly, the synapses along it become stronger and more efficient. Neuroscientists summarize this as **Hebb's Rule**: "Neurons that fire together wire together."

Conversely, pathways that aren't used weaken and eventually get pruned — a process called **synaptic pruning**. Your brain is constantly reinforcing the circuits you use and dismantling the ones you don't.

### Neurogenesis

Perhaps even more remarkable: the adult brain grows new neurons. The hippocampus — critical for memory and learning — generates new neurons throughout life, a process called **adult neurogenesis**.

Research by Fred Gage at the Salk Institute demonstrated that aerobic exercise, learning new skills, and environmental enrichment all increase the rate of neurogenesis. Conversely, chronic stress, sleep deprivation, and social isolation suppress it.

## What This Means Practically

**1. Learning has no expiration date.** The 60-year-old who starts learning piano is building new neural pathways just as a child does — perhaps more slowly, but no less genuinely. The brain doesn't stop growing; it just needs the right stimulation.

**2. Habits are physical structures.** Every habit you have — checking your phone, biting your nails, going for a morning run — corresponds to a reinforced neural pathway. Changing a habit isn't just a matter of willpower; it's a matter of building a new pathway and allowing the old one to weaken through disuse.

**3. Attention shapes your brain.** The brain disproportionately reinforces circuits that receive focused attention. This is why mindfulness meditation physically thickens the prefrontal cortex (associated with decision-making and self-regulation) and reduces volume in the amygdala (associated with fear and stress responses). What you attend to, you become.

**4. Recovery from brain injury is possible.** Stroke patients who were told they'd never walk again have regained function through intensive, targeted rehabilitation that exploits neuroplasticity. Constraint-induced movement therapy — forcing the use of an impaired limb — has produced remarkable recoveries by compelling the brain to rewire around damaged areas.

**5. Trauma can be healed.** PTSD, anxiety disorders, and phobias all involve overactive neural circuits. Therapies like EMDR (Eye Movement Desensitization and Reprocessing) and exposure therapy work by gradually weakening these circuits and building new, healthier ones. The traumatic memory doesn't disappear, but the brain's response to it fundamentally changes.

## The Responsibility of Plasticity

Neuroplasticity is neutral. It strengthens whatever you repeatedly do — whether that's practicing an instrument or doom-scrolling social media. The brain doesn't distinguish between helpful and harmful repetition. It just builds what you give it.

This means your daily choices aren't just lifestyle preferences. They're architectural decisions about the physical structure of your brain.

Choose your inputs carefully. Your brain is listening — and building — whether you realize it or not.`,
  },
];

// ── Insert ────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("🔌  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("✅  Connected.\n");

  let inserted = 0;
  let skipped = 0;

  for (const blog of blogs) {
    const slug = slugify(blog.title);
    const exists = await Blog.findOne({ slug });
    if (exists) {
      console.log(`⏭   Skipped (already exists): ${blog.title}`);
      skipped++;
      continue;
    }

    await Blog.create({
      title:       blog.title,
      slug,
      content:     blog.content.trim(),
      category:    blog.category,
      bannerImage: blog.bannerImage,
      authorName:  "Entry Editorial",
      authorId:    null,
      authorEmail: null,
      authorImage: null,
      status:      "published",
    });

    console.log(`✅  Inserted [${blog.category}]: ${blog.title}`);
    inserted++;
  }

  console.log(`\n🎉  Done — ${inserted} inserted, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
