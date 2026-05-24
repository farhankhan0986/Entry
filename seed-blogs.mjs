/**
 * seed-blogs.mjs  —  run with: node seed-blogs.mjs
 * Inserts 10 rich blog posts across 10 different categories.
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { readFileSync } from "fs";

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

// ── Seed Data ────────────────────────────────────────────────────────────────
const blogs = [
  {
    title: "Why Your Brain Loves Uncertainty More Than You Think",
    category: "Psychology",
    bannerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    content: `## The Paradox of Predictability

Here's something counterintuitive: your brain isn't actually wired to seek comfort. It's wired to seek *meaning* — and meaning almost always lives at the edge of the unknown.

Neuroscientists have spent decades studying what happens in the brain when we encounter something uncertain. The dopamine system — that ancient reward circuit that evolved to motivate us — doesn't fire hardest when we receive a guaranteed reward. It fires hardest when the reward is *possible but uncertain*.

## The Slot Machine Effect

This is why slot machines are so devastatingly effective. It's not the jackpots that hook people. It's the near-misses, the "this time might be it" — the exquisite torture of almost knowing.

But this same mechanism drives some of humanity's greatest achievements. Every scientist running an experiment, every artist staring at a blank canvas, every entrepreneur betting everything on an idea — they're all riding the same neurological wave.

> "The opposite of a correct statement is a false statement. But the opposite of a profound truth may well be another profound truth." — Niels Bohr

## Embracing the Unknown as a Practice

The ancient Stoics had a practice called *premeditatio malorum* — the premeditation of evils. They would deliberately imagine worst-case scenarios, not to catastrophize, but to drain uncertainty of its power.

Modern psychology calls a version of this "anxiety exposure." The more you sit with uncertainty, the less threatening it becomes. Your nervous system learns that ambiguity is survivable — even beautiful.

## What This Means for How You Live

The next time you feel paralyzed by not-knowing, consider that your discomfort isn't a signal to retreat. It's a signal that you're exactly where growth happens.

The brain that tolerates uncertainty is the brain that creates, connects, and discovers. Build yours deliberately.`,
  },
  {
    title: "The Lost City of Heracleion: Sunken for 1,200 Years",
    category: "Mysteries",
    bannerImage: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1200&q=80",
    content: `## A City That Slipped Into the Sea

In the year 800 CE, a magnificent Egyptian city called Heracleion — known to the ancient Greeks as Thonis — vanished beneath the Mediterranean. For over a millennium, it existed only in scattered references in ancient texts and on worn papyrus scrolls. Many historians assumed it was myth.

Then, in the year 2000, French marine archaeologist Franck Goddio changed everything.

## The Discovery

Goddio's team was scanning the seafloor of Aboukir Bay, four miles off the coast of Alexandria, when their equipment registered something extraordinary. Beneath 45 feet of water and a thick layer of silt lay an entire city — statues, temples, gold coins, sphinxes, and the remnants of over 64 ancient ships.

The city's famous temple of Amun, once described by Herodotus himself, emerged from the deep. Colossal statues of pharaohs, some weighing 5 tons, still stood in their original positions as if waiting to be found.

> Over 700 anchors and the ruins of merchant vessels suggest Heracleion was one of the ancient world's greatest trading ports.

## Why Did It Sink?

The working theory is sobering: the city was built on unstable delta sediment saturated with water. Over centuries, the weight of the buildings and a series of catastrophic earthquakes liquefied the ground beneath it — a geological process called soil liquefaction. The entire city slid into the sea within hours.

## What Heracleion Tells Us

The treasures recovered from Heracleion — now being painstakingly preserved — reveal a cosmopolitan hub where Greek and Egyptian cultures blended centuries before Alexander the Great arrived. Trade goods from across the Mediterranean. Temples where Greek sailors worshipped Egyptian gods.

It tells us that civilizations have always been more interconnected than we imagine — and that the sea keeps its secrets with extraordinary patience.`,
  },
  {
    title: "How to Think Clearly in a World Designed to Distract You",
    category: "Technology",
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    content: `## The Attention Economy Has a Business Model

Your attention is a resource. And unlike oil or timber, it's renewable — it replenishes every morning when you wake up. This makes it the most valuable commodity on the planet.

Every app on your phone, every notification badge, every algorithmically-curated feed is part of a trillion-dollar industry built around one singular goal: capturing as many minutes of your day as possible and selling them to advertisers.

Understanding this isn't paranoia. It's the first step to thinking clearly.

## What Distraction Actually Does to Your Brain

Research from the University of California, Irvine found that after a single interruption, it takes an average of **23 minutes and 15 seconds** to fully return to a task. Most knowledge workers are interrupted every 3 minutes.

The math is grim: if you're interrupted 10 times before noon, you've potentially lost the entire morning to recovery.

But it's not just productivity. Constant context-switching degrades your ability to think *deeply* — to hold complex ideas in working memory long enough to synthesize them into insight.

> Cal Newport calls this "deep work." Attention is the medium. Depth is the product.

## Practical Protocols for Reclaiming Focus

**1. Device-free mornings.** Give your brain 60–90 minutes before consuming any external information. Let your own thoughts arrive first.

**2. Single-tab browsing.** The urge to open another tab is almost always anxiety in disguise — a desire to escape the discomfort of sitting with a hard problem.

**3. Scheduled input windows.** Check email and messages at fixed times (9am, 1pm, 5pm). Between those windows, you're unavailable. This is not rudeness. This is thinking.

**4. Write to think.** Typing or writing by hand forces your brain to sequence thoughts. It's the single most underrated thinking tool available.

The goal isn't to opt out of technology. It's to stop being its product.`,
  },
  {
    title: "The Philosophy of Enough: Seneca, Stoicism and the Art of Contentment",
    category: "Philosophy",
    bannerImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
    content: `## A Letter Written 2,000 Years Ago That Still Stings

Lucius Annaeus Seneca was one of the wealthiest men in the Roman Empire. He was also one of its most articulate critics of wealth.

In his *Letters to Lucilius*, written in the twilight of his life (before Nero ordered his death), Seneca wrote with an urgency that feels almost modern: *"It is not the man who has too little who is poor, but the man who hankers after more."*

He wrote this from a villa. The irony wasn't lost on him.

## The Problem with More

Stoicism — the philosophical school Seneca belonged to — wasn't anti-pleasure. It was anti-*attachment* to pleasure. The Stoics drew a crucial distinction between enjoying what you have and needing it to be okay.

This is the concept of *apatheia* — not apathy in the modern sense, but a kind of emotional equanimity. Things happen. Good things, bad things. The Stoic aim was to remain the same person through both.

> "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has."

## Enough as a Practice

In a world engineered for dissatisfaction — where every product promises a slightly better life just beyond your current reach — the concept of "enough" is almost radical.

Seneca suggested a practice: periodically live as if you had nothing. Eat simply. Dress plainly. Not as punishment, but as an experiment in discovering that you were fine all along.

The Stoics called this *voluntary discomfort* — and modern research on hedonic adaptation suggests they were onto something real. We return to roughly the same baseline of happiness regardless of external circumstances. The upgrade never sticks.

## What Contentment Actually Looks Like

Contentment isn't the absence of desire. It's the presence of perspective. It's knowing — genuinely knowing — that the life you have right now contains more than enough raw material for a meaningful existence.

Seneca wrote his most profound letters knowing he would die soon. There's something clarifying about that.`,
  },
  {
    title: "Inside the Science of Sleep: What Happens When You Close Your Eyes",
    category: "Health",
    bannerImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80",
    content: `## Sleep Is Not Passive

For most of human history, sleep was considered wasted time — a biological necessity we endured rather than valued. Now neuroscience has completely reversed that picture.

When you close your eyes each night, your brain launches into one of the most metabolically active and functionally critical processes in biology.

## The Architecture of a Night's Sleep

Sleep isn't a single state. It cycles through four distinct stages roughly every 90 minutes:

- **Stage 1 (NREM):** The drowsy transition. Your muscles relax, heartbeat slows.
- **Stage 2 (NREM):** Sleep spindles appear — bursts of neural activity now understood to be critical for memory consolidation.
- **Stage 3 (NREM):** Deep, slow-wave sleep. Growth hormone releases. Tissues repair. The immune system goes to work.
- **REM:** The dreaming stage. Your brain is nearly as active as when awake, but your body is temporarily paralyzed. This is where emotional memories are processed and creative connections are made.

> Matthew Walker, in *Why We Sleep*, calls this stage "emotional first aid" — a chance to replay difficult experiences without the stress hormones present during waking hours.

## The Glymphatic System: Your Brain's Night Crew

Perhaps the most stunning discovery of the past decade is the **glymphatic system** — a network of channels that flushes toxic waste from the brain during sleep.

Among the waste products cleared: **amyloid beta and tau proteins** — the same proteins that accumulate in Alzheimer's disease.

This is why chronic poor sleep is now understood as one of the most significant modifiable risk factors for neurodegenerative disease.

## What Good Sleep Actually Requires

- **Consistency:** Same bedtime and wake time, even on weekends. Circadian rhythm doesn't take days off.
- **Cool temperatures:** Your core body temperature needs to drop 1–2°C to initiate sleep. 65–68°F is ideal.
- **Darkness:** Blackout curtains aren't just comfort — they prevent melatonin suppression from ambient light.
- **No alcohol within 3 hours:** Alcohol fragments REM sleep, even if it helps you fall asleep faster.

Sleep isn't a lifestyle choice. It's the foundation everything else is built on.`,
  },
  {
    title: "The Day the Internet Changed Everything: A Brief History of the World Wide Web",
    category: "Technology",
    bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    content: `## A Proposal No One Thought Would Work

On March 12, 1989, a quiet British physicist at CERN named Tim Berners-Lee submitted a proposal to his supervisor. The title was "Information Management: A Proposal." His supervisor wrote one word in the margin: *"Vague but exciting."*

That vague proposal became the World Wide Web — and it changed the human species more profoundly than almost any invention in recorded history.

## From ARPANET to the Web

The internet and the web are often conflated, but they're distinct. The internet — a global network of computers — had existed since the 1960s, emerging from the US military's ARPANET project. It could move data between computers, but navigating it required technical expertise.

What Berners-Lee invented was a *layer on top* of the internet: a system of hyperlinks, URLs, and HTML that made information accessible to anyone with a browser.

The first website went live on August 6, 1991. It explained what the World Wide Web was. It is still online today.

## The Cambrian Explosion

What happened next was unprecedented. Within a decade, the web had spawned an entirely new economy, new forms of communication, new industries, and new modes of human relationship.

By 1995, Amazon was selling books. By 1998, Google was organizing the web's contents. By 2004, social networking was beginning to reshape how humans present themselves to one another.

> The web didn't just change what we do. It changed what we think is possible.

## What We're Still Figuring Out

Berners-Lee himself has become one of the web's most vocal critics. In 2018, on the web's 29th birthday, he wrote an open letter expressing concern about its concentration of power, misinformation, and loss of privacy.

He has spent recent years working on a project called Solid — an attempt to rebuild the web's architecture around individual data ownership.

The inventor trying to fix his invention. Some stories don't have clean endings.`,
  },
  {
    title: "The Quiet Life: How Japan's Hikikomori Are Redefining Solitude",
    category: "Society",
    bannerImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    content: `## A Million People Who Stepped Away

In Japan, there is a word — *hikikomori* — for people who withdraw from social life entirely, often for months or years at a time. The Japanese government estimates there are over one million hikikomori in the country today, though the true number is likely higher.

The phenomenon has been largely pathologized in Western media — framed as crisis, dysfunction, failure. But spending any time with the actual stories of people who have lived this way reveals something more complicated.

## The Origins of the Term

Psychiatrist Tamaki Saitō coined the term in 1998, defining it as a condition in which individuals withdraw from society and seek extreme degrees of isolation for at least six months.

But Saitō was careful to note that hikikomori wasn't a diagnosis — it was a *description* of a social phenomenon. The causes varied wildly: school bullying, family trauma, perfectionism, social anxiety, a single humiliating experience that never healed.

> "They are not lazy," Saitō wrote. "They are exhausted."

## What the West Is Getting Wrong

Here's what's uncomfortable to admit: hikikomori are most concentrated in the countries with the most intense social performance expectations. Japan. South Korea. Now increasingly, the United States.

As social media has transformed ordinary life into a constant performance — where every meal, relationship, and milestone is subject to public evaluation — the appeal of simply *opting out* has grown globally.

A 2023 survey in the UK found that 9% of adults reported feeling "severely lonely" — but a similar proportion said they *preferred* limited social contact. Those are two very different things.

## Solitude vs. Isolation

The distinction that matters isn't how much time someone spends alone. It's whether that solitude is *chosen*.

Philosophers from Thoreau to Montaigne to Simone Weil have written about solitude as a necessary condition for self-knowledge. The examined life requires quiet.

The hikikomori question isn't whether withdrawal is a problem. It's whether we've built a society where the choice to step back can only read as failure.`,
  },
  {
    title: "Compound Interest Isn't Just About Money: The Hidden Returns of Small Habits",
    category: "Finance",
    bannerImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80",
    content: `## Albert Einstein (Probably) Didn't Say This

The quote "compound interest is the eighth wonder of the world" is almost certainly misattributed to Einstein. But whoever said it first understood something profound about how growth actually works.

Most people think about compound interest as a financial mechanism — and it is. But its underlying logic applies to almost every domain of human development.

## The Mathematics of Small

Imagine you improve at anything by just 1% every day. Not a dramatic leap. Not a radical reinvention. One percent.

After one year, you're not 365% better. You're **37 times** better. That's the math of compounding: (1.01)^365 = 37.78.

Conversely, if you decline by 1% daily, after a year you're down to 3% of where you started.

Small inputs. Enormous outputs. The direction just has to be consistent.

## Where This Actually Shows Up

**In fitness:** Three 30-minute walks a week, maintained for a decade, produces cardiovascular health changes that no single dramatic intervention can match.

**In relationships:** Small gestures of care — a text checking in, remembering a detail someone mentioned months ago — compound into deep trust over years.

**In knowledge:** Reading for 20 minutes daily across a career means you'll have read roughly 1,000 books by retirement. That's a different mind than the one you started with.

**In finance (yes, actually):** $300 invested monthly from age 25 at an 8% average annual return becomes $1,000,000 by age 65. Without ever investing dramatically. Just consistently.

> The system rewards patience more than intensity.

## The Problem with Dramatic Change

We're drawn to transformation stories. The person who lost 60 pounds, learned a new language in six months, built a company from nothing. These stories are real, but they're not the template most lives are built on.

Most meaningful change is invisible for a long time. Then suddenly, it's unmistakable.

The question isn't how to find the one big break. It's whether you can fall in love with the process of small, consistent inputs — even when the outputs are nowhere yet in sight.`,
  },
  {
    title: "Mary Shelley at 18: How a Stormy Summer Produced the World's First Science Fiction Novel",
    category: "Biographies",
    bannerImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=80",
    content: `## The Summer That Never Was

The year 1816 is known in climate history as "The Year Without a Summer." The April 1815 eruption of Mount Tambora in Indonesia had blasted so much ash into the atmosphere that it blocked sunlight across much of the Northern Hemisphere. Crops failed. Famines followed. In Europe, the sky turned strange colors and it rained for months.

Near Lake Geneva, Switzerland, a group of young intellectuals were trapped indoors by the relentless storms.

One of them was 18 years old. Her name was Mary Wollstonecraft Godwin — soon to become Mary Shelley.

## The Ghost Story Contest

Among the group was Lord Byron, the most famous poet in England, and Mary's lover Percy Bysshe Shelley. To pass the time, Byron proposed a contest: each person would write a ghost story.

Most of them abandoned the project quickly. Mary couldn't think of anything worthy — until one sleepless night, a waking dream came to her.

> "I saw the pale student of unhallowed arts kneeling beside the thing he had put together. I saw the hideous phantasm of a man stretched out, and then, on the working of some powerful engine, show signs of life."

The thing she saw in her dream became *Frankenstein; or, The Modern Prometheus*.

## Why It Still Matters

Mary Shelley wrote the novel that would become *Frankenstein* — published anonymously in 1818 — at 18. She was processing personal grief (she had lost her infant daughter the previous year), philosophical questions about creation and responsibility, and the terrifying new possibilities of science at the dawn of the industrial age.

Victor Frankenstein's crime is not making the creature. It's *abandoning* it. The monster's tragedy is being created with needs — for love, acceptance, belonging — that his creator refuses to meet.

Two centuries later, as we debate the ethics of artificial intelligence, genetic engineering, and autonomous systems, the question Shelley asked in a rain-drenched Swiss villa has never been more urgent: *What responsibilities come with the power to create life?*

The 18-year-old in the storm knew more than she was given credit for.`,
  },
  {
    title: "The Loneliness Epidemic: Why the Most Connected Generation Feels Most Alone",
    category: "Lifestyle",
    bannerImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1200&q=80",
    content: `## A Paradox No One Saw Coming

When the internet arrived, the utopian promise was connection. Anyone could reach anyone. Distance would dissolve. The isolated would find their people.

In 2023, the US Surgeon General declared loneliness a public health epidemic. The UK had a Minister for Loneliness. Cigna's global surveys consistently showed that three in five Americans report feeling lonely — with the highest rates among adults aged 18–22.

The most connected generation in human history is the most lonely.

## What Changed

The answer isn't that we connect less. It's that we've substituted *performing* connection for *experiencing* it.

Social media doesn't give you friendship. It gives you an audience. And audiences are structurally different from friends — they evaluate, they compare, they drift. Real friendship requires sustained attention, mutual vulnerability, shared history, and the willingness to be boring together.

Scrolling through someone's curated highlights isn't the same as sitting with them through a difficult evening.

> British anthropologist Robin Dunbar has shown that the human brain can maintain approximately 150 meaningful social relationships — and only 5 truly intimate ones. Social media expands followers, not intimacy.

## The Biology of Loneliness

Chronic loneliness isn't just sad. It's physically dangerous.

Research by psychologist John Cacioppo found that lonely people show elevated levels of cortisol, impaired immune function, disrupted sleep, and a 26% increased risk of early death — comparable to smoking 15 cigarettes a day.

The body treats social isolation as a threat, activating the same inflammatory pathways that respond to physical danger. We are deeply social animals. Isolation is, biologically speaking, an emergency.

## What Actually Helps

The research is remarkably consistent: **frequency and quality of in-person interaction** is the most reliable predictor of reduced loneliness. Not quantity of contacts. Not social media activity. Physical presence.

This doesn't require grand gestures. A weekly coffee. A regular walk with someone you like. A phone call — voice, not text — to someone you've been meaning to reach.

The loneliness epidemic has a low-tech solution. We just have to choose it over the easier alternatives.`,
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
