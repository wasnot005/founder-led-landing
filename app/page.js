'use client'
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Rocket, Video, PenSquare, Wand2, MessagesSquare, Send,
  GaugeCircle, Workflow, Infinity, Users, Clock, Sparkles, LineChart, Bot,
  Film, Globe2, Lock, ChevronLeft, ChevronRight, X
} from "lucide-react";

/**
 * Founder-Led Personal Brand — Private Landing Page
 * (Matches the latest canvas with animated gradients, BG orbs,
 *  hover-spring cards, improved 2×2 Results section + lightbox)
 */

const MEDIA = {
  // HERO / VSL
  heroVslEmbedUrl: "#TODO: paste YouTube/Vimeo URL (or leave blank)",

  // AVATAR SAMPLES (Drive links OK)
  standardRawVideo: "https://drive.google.com/file/d/1nHk5XzFNiopVEtZSasH5646FH5ZVKA7o/view?usp=drive_link",
  standardEditedVideo: "https://drive.google.com/file/d/1Fkzw60qELi5a3rAS36RurpF5HqPw6jei/view?usp=drive_link",
  premiumEditedVideo: "https://drive.google.com/file/d/1WNn5QX8rUXkC0A2QG9Ntc_cvs2f8yiBV/view?usp=sharing",

  // RESULTS (comma-separated image links → carousel)
  caseECL:
    "https://drive.google.com/file/d/1rYHvOVI4rzEmBmPTqdlu8F0gp3Rqf2Xx/view?usp=sharing,https://drive.google.com/file/d/1IaOfXtPAqZ7bMez8Wd-xLSoGD5PT806o/view?usp=sharing,https://drive.google.com/file/d/11ose4vqQxN6vd0wFHUiT1X3tw7xCYl9i/view?usp=sharing",
  caseJanhvi:
    "https://drive.google.com/file/d/1kGkABQB8voOCcE2Q8aZaSPkBRH7392pr/view?usp=sharing,https://drive.google.com/file/d/13O2tWOxBGixzMuYYObxohglmJLhvG-IH/view?usp=sharing",
  caseFulfillzy:
    "https://drive.google.com/file/d/1GetW1cY5pO1CUBCG7i1jQsclyGBhMZWP/view?usp=sharing",
  caseSmash:
    "https://drive.google.com/file/d/1ITN0W4gc8GAiSyEcsVLC-gxoILlrjlMw/view?usp=drive_link,https://drive.google.com/file/d/1j29b8LG1mI173GqJVaejnf8pNDk-AOm7/view?usp=sharing",

  // LOGO
  logoSrc: "https://drive.google.com/file/d/1KrIF5bOPgCJSlzvP7TQ8kQhY6kRnJ9GN/view?usp=drive_link",
};

const results = [
  { id: "ecl", title: "ECL (Events Portfolio)", metric: "350M+ reach", blurb: "Part of a portfolio delivering outsized tournament visibility.", media: MEDIA.caseECL, tag: "Events" },
  { id: "janhvi", title: "Janhvi Taneja (Personal Brand)", metric: "+125k in <30 days", blurb: "Focused sprint with avatar + storytelling system.", media: MEDIA.caseJanhvi, tag: "Creator" },
  { id: "fulfillzy", title: "Fulfillzy (B2B)", metric: "6k followers", blurb: "Low-organic niche, consistent value content and DM flows.", media: MEDIA.caseFulfillzy, tag: "B2B" },
  { id: "smash", title: "Smash (D2C)", metric: "0→1k in 16 posts", blurb: "Rapid validation using product-led hooks.", media: MEDIA.caseSmash, tag: "D2C" },
];

const faqs = [
  { q: "Do I have to be on camera?", a: "No. We can run fully through AI avatars or mix with guided real recordings using shotlists." },
  { q: "Who owns the content?", a: "You do. We deliver ready-to-post files and keep an archive for continuity." },
  { q: "How does the refund guarantee work?", a: "After the audit, we define a custom reach target. If we miss it within the agreed window, we process a full refund." },
  { q: "Which platforms do you cover?", a: "Instagram Reels, YouTube Shorts, LinkedIn, and X. Others on request." },
];

// Animations
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" },
};

// ----- Media helpers (Google Drive & Dropbox supported) -----
function extractDriveId(url) {
  if (!url) return null;
  const m1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  return null;
}
function drivePreviewUrl(id) { return `https://drive.google.com/file/d/${id}/preview`; }
function driveImageUrl(id) { return `https://drive.google.com/uc?export=view&id=${id}`; }
function normalizeImageUrl(url) {
  if (!url) return null;
  const id = extractDriveId(url);
  if (id) return driveImageUrl(id);
  if (url.includes("dropbox.com")) return url.replace("dl=0", "raw=1");
  return url;
}
function renderVideoMedia(url, { label = "MEDIA Video", hint = "Put a public mp4/webm or Drive link" } = {}) {
  if (!url || url.startsWith("#TODO")) return <PlaceholderMedia label={label} hint={hint} />;
  const id = extractDriveId(url);
  if (id) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-white/10 shadow">
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe src={drivePreviewUrl(id)} className="aspect-video w-full" allow="autoplay; encrypted-media" />
      </div>
    );
  }
  return <video src={url} controls className="aspect-video w-full rounded-xl border border-white/10" />;
}
// ------------------------------------------------------------

function Badge({ children }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">{children}</span>;
}
function GlassCard({ children, className = "" }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur ${className}`}>{children}</div>;
}
function PlaceholderMedia({ label = "MEDIA", hint = "Drop link in MEDIA.* above", icon: Icon = Film }) {
  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-indigo-400/40 via-cyan-300/20 to-transparent" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <Icon className="mb-3 h-8 w-8 opacity-80" />
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="text-xs text-white/60">{hint}</p>
      </div>
    </div>
  );
}
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      {eyebrow && (<div className="mb-2 flex items-center justify-center"><Badge>{eyebrow}</Badge></div>)}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
        <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent animate-gradient">{title}</span>
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/70">{subtitle}</p>}
    </div>
  );
}
function MetricChip({ children }) {
  return <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">{children}</span>;
}

function NavBar() {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0f1a]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          {MEDIA.logoSrc && !MEDIA.logoSrc.startsWith("#TODO") ? (
            <img
  src={normalizeImageUrl(MEDIA.logoSrc)}
  alt="Logo"
  className="h-8 w-8 rounded-lg object-cover"
  referrerPolicy="no-referrer"
  onError={(e) => {
    const id = extractDriveId(MEDIA.logoSrc);
    if (id) e.currentTarget.src = driveThumbnailUrl(id);
  }}
/>

          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-90" />
          )}
          <span className="text-sm font-semibold tracking-wide bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent animate-gradient">Founder-Led</span>
          <Badge><Lock className="h-3.5 w-3.5" /> Private Preview</Badge>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.35),rgba(16,24,40,0))]" />
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10">
        <motion.div {...fadeUp} className="text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Founder-Led Personal Brand, <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">Done For You</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            A private, end-to-end system to go from 0→1: 30 videos a month, avatar-powered or camera-ready, posted and managed for you—so you don’t have to lift a finger.
          </p>
        </motion.div>

        {/* Hidden unless a VSL URL is provided */}
        {MEDIA.heroVslEmbedUrl && !MEDIA.heroVslEmbedUrl.startsWith("#TODO") && MEDIA.heroVslEmbedUrl.trim() !== "" ? (
          <div className="mx-auto mt-10 max-w-3xl">{renderVideoMedia(MEDIA.heroVslEmbedUrl, { label: "Hero VSL" })}</div>
        ) : null}
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="border-y border-white/10 bg-white/5">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <motion.div {...fadeUp} className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-center">
          <ShieldCheck className="h-5 w-5 text-emerald-300" />
          <p className="text-sm text-white/80">
            After your audit, we set a custom reach target. If we miss it, you get <span className="font-semibold text-white">100% of your money back</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Deliverables() {
  const items = [
    { icon: Rocket, title: "Ideation", text: "Research-backed map aligned to your positioning." },
    { icon: PenSquare, title: "Scripting", text: "Founder voice, not agency filler." },
    { icon: Wand2, title: "Recording", text: "AI avatar or guided shotlists for real-self captures." },
    { icon: Film, title: "Editing", text: "Tight pacing, captions, brand kit, thumbnails." },
    { icon: Send, title: "Posting", text: "Calendarized rollout across chosen platforms." },
    { icon: MessagesSquare, title: "Community", text: "DM automation, stories, light engagement SOPs." },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow={<><Infinity className="mr-1 inline h-4 w-4" />Monthly System</>} title="What You Get — 30 Videos / Month" subtitle="End-to-end production and distribution. You approve, we publish." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, idx) => (
          <motion.div key={idx} {...fadeUp} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <GlassCard className="h-full">
              <div className="mb-4 flex items-center gap-3">
                <it.icon className="h-5 w-5 text-cyan-300" />
                <h3 className="text-lg font-semibold text-white">{it.title}</h3>
              </div>
              <p className="text-white/70">{it.text}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Avatars() {
  const [tab, setTab] = useState("standard");
  const [standardView, setStandardView] = useState("raw");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow={<><Bot className="mr-1 inline h-4 w-4" />AI Avatars</>} title="Standard vs Premium (Beta)" subtitle="Record without recording — or blend with real shoots. Premium is invite-only while we beta test." />

      <div className="mb-6 flex w-full overflow-hidden rounded-full border border-white/10 bg-white/5 p-1 text-sm">
        {[{ key: "standard", label: "Standard" }, { key: "premium", label: "Premium (Beta)" }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 rounded-full px-4 py-2 transition ${tab === t.key ? "bg-indigo-500/80 text-white" : "text-white/70 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "standard" ? (
        <GlassCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Standard Avatar</h3>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs">
              {[{ key: "raw", label: "Raw" }, { key: "edited", label: "Edited" }].map((o) => (
                <button key={o.key} onClick={() => setStandardView(o.key)} className={`rounded-full px-3 py-1 ${standardView === o.key ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {standardView === "raw"
            ? renderVideoMedia(MEDIA.standardRawVideo, { label: "Standard Avatar — RAW", hint: "Put mp4/webm or Drive link in MEDIA.standardRawVideo" })
            : renderVideoMedia(MEDIA.standardEditedVideo, { label: "Standard Avatar — EDITED", hint: "Put mp4/webm or Drive link in MEDIA.standardEditedVideo" })}
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Premium Avatar</h3>
            <Badge><Sparkles className="h-3.5 w-3.5" /> Limited • Beta</Badge>
          </div>
          {renderVideoMedia(MEDIA.premiumEditedVideo, { label: "Premium Avatar — EDITED", hint: "Put mp4/webm or Drive link in MEDIA.premiumEditedVideo" })}
          <p className="mt-4 text-sm text-white/70">
            Higher realism, multi-language options, studio-grade finishing. Currently available to a few clients who want to experiment. Ask on the call if you’d like access.
          </p>
        </GlassCard>
      )}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Workflow, title: "Week 1 Onboarding", text: "Deep-dive context: your market, voice, POV, and goals." },
    { icon: PenSquare, title: "Idea Board → You Rank", text: "We propose angles; you quickly score what fits best." },
    { icon: PenSquare, title: "Script Pack", text: "Scripts written in your voice for speed of approval." },
    { icon: Film, title: "Sample Cuts", text: "We share references and sample cuts so you can calibrate once." },
    { icon: Send, title: "Publish & Manage", text: "We post, automate DMs, update stories, and engage lightly." },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow={<><Workflow className="mr-1 inline h-4 w-4" />Process</>} title="How It Works" subtitle="From onboarding to autopilot in days, not months." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <motion.div key={i} {...fadeUp} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <GlassCard className="h-full">
              <s.icon className="mb-3 h-5 w-5 text-indigo-300" />
              <h4 className="text-base font-semibold text-white">{s.title}</h4>
              <p className="mt-1 text-sm text-white/70">{s.text}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------- Results helpers ----------
function normalizeToArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val).split(",").map((s) => s.trim()).filter(Boolean);
}
function MediaCarousel({ urls, label = "Proof" }) {
  const items = normalizeToArray(urls);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);

  if (items.length === 0) return <PlaceholderMedia label={label} hint="Add public image links" />;

  const id = extractDriveId(items[i]);
  const primary = normalizeImageUrl(items[i]);
  const thumb   = id ? driveThumbnailUrl(id) : null;

  const [src, setSrc] = useState(primary);
  const [triedThumb, setTriedThumb] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  // Reset fallbacks when the slide changes
  React.useEffect(() => {
    setSrc(primary);
    setTriedThumb(false);
    setUseIframe(false);
  }, [i, primary]);

  const onImgError = () => {
    if (!triedThumb && thumb) {
      setTriedThumb(true);
      setSrc(thumb);               // fallback to Drive thumbnail
    } else {
      setUseIframe(true);          // final fallback to Drive preview iframe
    }
  };

  const go = (d) => setI((prev) => (prev + d + items.length) % items.length);

  return (
    <div className="relative">
      {/* In-card preview: readable, no cropping */}
      <div className="mb-3 h-72 w-full overflow-hidden rounded-lg border border-white/10 bg-black/40 md:h-80">
        {useIframe && id ? (
          // Drive preview works for any file type, even if image hotlinking fails
          // eslint-disable-next-line jsx-a11y/iframe-has-title
          <iframe src={drivePreviewUrl(id)} className="h-full w-full" allow="autoplay; encrypted-media" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={label}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain"
            onClick={() => setOpen(true)}
            onError={onImgError}
          />
        )}
      </div>

      {/* Controls */}
      {items.length > 1 && (
        <>
          <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-black/60">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-black/60">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {items.map((_, idx) => (
              <span key={idx} onClick={() => setI(idx)} className={`h-1.5 w-4 cursor-pointer rounded-full ${idx === i ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </>
      )}

      {/* Lightbox modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 p-2 text-white hover:bg-black/60">
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full max-w-5xl">
            {useIframe && id ? (
              // eslint-disable-next-line jsx-a11y/iframe-has-title
              <iframe src={drivePreviewUrl(id)} className="h-[85vh] w-full rounded-lg" allow="autoplay; encrypted-media" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={label} className="max-h-[85vh] w-full rounded-lg object-contain" referrerPolicy="no-referrer" onError={onImgError} />
            )}
            {items.length > 1 && (
              <>
                <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 p-3 text-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/50 p-3 text-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------

function Results() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading eyebrow={<><LineChart className="mr-1 inline h-4 w-4" />Proof</>} title="Results Across Industries" subtitle="Event, Personal Brand, B2B, and D2C — 0→1 and 1→100 stories." />
      {/* 2×2 grid for maximum readability */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {results.map((r) => (
          <motion.div key={r.id} {...fadeUp} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <GlassCard className="h-full">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-white">{r.title}</h3>
                <MetricChip>{r.metric}</MetricChip>
              </div>
              <MediaCarousel urls={r.media} label={`${r.title} — Proof`} />
              <div className="mt-2 text-sm text-white/70">{r.blurb}</div>
              <div className="mt-3 text-xs text-white/50">Sector: {r.tag}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WhyFounderLed() {
  const points = [
    { icon: Users, title: "Authority travels farther", text: "Founders convert attention into trust faster than brand pages." },
    { icon: GaugeCircle, title: "Consistency compounds", text: "Steady output beats spikes. We keep cadence and quality." },
    { icon: Globe2, title: "Proof converts", text: "Social proof from real results builds momentum every week." },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading title="Why Founder-Led Wins" subtitle="It’s not just content — it’s compounding distribution and proof." />
      <div className="grid gap-6 md:grid-cols-3">
        {points.map((p, i) => (
          <motion.div key={i} {...fadeUp} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <GlassCard className="h-full">
              <p.icon className="mb-3 h-6 w-6 text-cyan-300" />
              <h4 className="text-base font-semibold text-white">{p.title}</h4>
              <p className="mt-1 text-sm text-white/70">{p.text}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading title="FAQs" />
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((f, i) => (
          <motion.div key={i} {...fadeUp} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
            <GlassCard>
              <h4 className="text-base font-semibold text-white">{f.q}</h4>
              <p className="mt-1 text-sm text-white/70">{f.a}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/5">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-white/60">
        <div className="mb-2">This page is a private preview shared post-call.</div>
        <div>© {new Date().getFullYear()} Founder-Led • Built for Social SEO brand family</div>
      </div>
    </footer>
  );
}

function SiteStyles(){
  return (
    <style>{`
      .animate-gradient{
        background-size:200% 200%;
        animation:gradientShift 6s ease-in-out infinite;
      }
      @keyframes gradientShift{
        0%{background-position:0% 50%;}
        50%{background-position:100% 50%;}
        100%{background-position:0% 50%;}
      }
    `}</style>
  );
}
function BGOrbs(){
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 blur-3xl" animate={{ x:[0,60,-40,0], y:[0,-30,10,0] }} transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }} />
      <motion.div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20 blur-3xl" animate={{ x:[0,-50,40,0], y:[0,20,-30,0] }} transition={{ duration: 22, repeat: Infinity, repeatType: "mirror" }} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <SiteStyles />
      <BGOrbs />
      <NavBar />
      <Hero />
      <Guarantee />
      <Deliverables />
      <Avatars />
      <HowItWorks />
      <Results />
      <WhyFounderLed />
      <FAQ />
      <Footer />
    </div>
  );
}
