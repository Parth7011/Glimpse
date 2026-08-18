# PRD — Hackathon Prototype
## Event Photo Delivery Platform (Face-Recognition Based)

**Status:** Draft v1 — Hackathon Scope
**Constraint:** 100% free-tier tools only, every listed feature must work live in the demo
**Last updated:** August 18, 2026

---

## 1. Why this version is different from the full PRD

This is a **scoped-down, demo-reliable version** of the original product PRD. The rule for this document: if a feature can't be built and verified working with free-tier tools before the demo, it is either cut or marked as "described, not built" (mocked in the pitch deck, not claimed as live).

Guiding principle: **fewer working features beats more broken ones.** Judges remember what breaks on stage.

## 2. Demo Scope (What Must Actually Work)

| # | Feature | Must work live? |
|---|---|---|
| 1 | Photographer uploads a batch of event photos | ✅ Yes |
| 2 | Backend detects faces and generates embeddings | ✅ Yes |
| 3 | Photographer gets a shareable link/QR code for the event | ✅ Yes |
| 4 | Guest opens link, takes/uploads a selfie | ✅ Yes |
| 5 | Guest sees all matching photos (solo + group) | ✅ Yes |
| 6 | Guest downloads photos (single + bulk zip) | ✅ Yes |
| 7 | Basic consent checkbox before selfie is used | ✅ Yes (even if just a UI checkbox, not full legal flow) |
| 8 | WhatsApp/email auto-push delivery | ❌ Cut — mention as roadmap only |
| 9 | Paid downloads / monetization | ❌ Cut — mention as roadmap only |
| 10 | Custom branding per photographer | ❌ Cut — mention as roadmap only |
| 11 | Analytics dashboard | ⚠️ Nice-to-have if time remains — simple counts only (photos uploaded, guests matched) |

## 3. User Flow (Demo Script)

1. **Photographer** logs in → creates an event → uploads ~30–50 sample photos (pre-prepped folder for reliability).
2. Backend processes photos in the background; dashboard shows a status indicator (processing → ready).
3. Photographer clicks "Get Link" → QR code + URL generated.
4. **Judge/demo guest** scans QR on a phone → lands on guest portal.
5. Guest taps "Find My Photos" → camera opens → takes selfie.
6. Within a few seconds, matching photos appear in a grid.
7. Guest taps "Download All" → zip downloads.

This exact flow should be rehearsed end-to-end multiple times before presenting — not just unit-tested.

## 4. Free-Tier Tech Stack

Every tool below has a free tier sufficient for a hackathon-scale demo (dozens of photos, a handful of live guest searches). No credit card should need to be charged.

| Layer | Tool | Free tier details | Notes |
|---|---|---|---|
| Frontend hosting | **Vercel** | Free Hobby plan — unlimited personal projects | Deploy Next.js app directly from GitHub |
| Frontend framework | **Next.js + Tailwind CSS** | Open source, free | No cost, well-documented |
| Backend/API | **Next.js API routes** or a small **FastAPI** app on **Render free tier** | Render free web service (spins down when idle — wake-up delay on first request) | If using Render free tier, "warm up" the service a few minutes before the demo to avoid cold-start lag on stage |
| Database | **Supabase free tier** (Postgres) | 500MB DB, 2 free projects | Also gives you free Auth if needed |
| Vector/embedding storage | **pgvector extension on Supabase** | Included free with Supabase Postgres | No separate vector DB needed at this scale |
| File/image storage | **Supabase Storage** (free tier: 1GB) or **Cloudinary free tier** (25GB storage/bandwidth credits) | Cloudinary also gives free on-the-fly image resizing, useful for thumbnails | Pick one — don't split storage across two services for a demo |
| Face detection & embeddings | **face-api.js** (runs in-browser or Node, free, open source) or Python **`face_recognition`** library (built on dlib, free, open source) | No API cost, no rate limits, fully self-hosted | Recommended over AWS Rekognition/Azure Face for a hackathon — no account setup, no billing risk, works offline during rehearsal |
| Face matching logic | Cosine similarity computed manually in Node/Python, or `pgvector`'s built-in similarity search | Free | Simple threshold-based matching is enough for a demo |
| Background job handling | Simple `async`/queue-in-memory for MVP, or **Supabase Edge Functions** (free tier included) | Free | Skip Redis/BullMQ entirely for a hackathon — adds infra risk with little benefit at this scale |
| QR code generation | **`qrcode`** npm package | Free, open source | Generates QR client-side or server-side, no external API needed |
| Auth (photographer login) | **Supabase Auth** | Free tier included | Email/password or magic link, minimal setup |
| Camera/selfie capture | Browser native `getUserMedia` API | Free, built into browser | No third-party dependency |
| Zip generation for bulk download | **`archiver`** (Node) or **`zipfile`** (Python) | Free, open source | Generate zip on-demand, no external service |
| Version control / CI | **GitHub + GitHub Actions free tier** | Free for public repos, generous free minutes for private | Simple deploy-on-push pipeline |

### Explicitly avoided for this version
- AWS Rekognition / Azure Face / Google Vision — free tiers exist but require a credit card on file and have usage caps that create risk of an unexpected charge or a demo-day failure if a quota resets oddly.
- Any paid vector DB (Pinecone, Qdrant Cloud) — unnecessary at hackathon scale; pgvector is free and sufficient.
- WhatsApp Business API / Twilio — costs money past trial credits, and adds a live external dependency that can fail during a demo.
- Kubernetes or any container orchestration — unnecessary complexity for a single demo instance.

## 5. Architecture (Hackathon Version)

```
Next.js App (Vercel, free)
        │
        ├── Photographer Dashboard (upload, event mgmt, QR link)
        └── Guest Portal (selfie capture, results, download)
                │
        Next.js API routes / FastAPI (Render free tier)
                │
        ┌───────┼────────┐
        │       │        │
   Supabase   face-api.js /   Supabase
   Postgres   face_recognition  Storage
   (pgvector)  (self-hosted,     (photos +
               free, in-process)  thumbnails)
```

Single deployable app where possible — fewer moving pieces means fewer things that can fail live.

## 6. Build Priority Order (If Time Runs Short)

Build and verify in this order. Everything below the line you run out of time for gets cut from the live demo, not half-built and shown broken.

1. Photo upload + storage working
2. Face detection + embedding generation on upload
3. Guest selfie capture + matching against stored embeddings
4. Results grid showing matched photos
5. Single photo download
6. QR code / shareable link generation
7. Bulk zip download
8. Consent checkbox UI
9. Basic status indicators (processing/ready)
10. *(Only if time remains)* Simple analytics counts

## 7. Reliability Checklist Before Demo

- [ ] Pre-load the event with real photos in advance (don't upload live unless upload itself is the point being demoed)
- [ ] Test the full flow on the actual venue Wi-Fi if possible — hackathon Wi-Fi is often bad, consider a hotspot fallback
- [ ] If using Render free tier, ping the backend a few minutes before your slot to avoid cold-start delay
- [ ] Test selfie capture on the actual phone/browser you'll demo with (iOS Safari and Android Chrome behave differently with camera permissions)
- [ ] Have a pre-recorded backup video of the full flow in case live Wi-Fi or camera access fails on stage
- [ ] Seed at least one guaranteed-good match (good lighting, clear face) so the first live search always succeeds
- [ ] Keep the photo set small (30–50 photos) — large sets slow down matching and increase risk with self-hosted, unoptimized face libraries

## 8. What to Say About Cut Features

Frame cut features (WhatsApp delivery, paid downloads, branding) as **"designed, roadmapped, and technically straightforward to add post-hackathon"** rather than pretending they don't exist — judges often ask about roadmap and monetization, and having a clear answer (see the full product PRD) signals you thought beyond the prototype.

## 9. Success Criteria for the Hackathon

- Every feature listed in Section 2 as "Must work live" actually works, live, in front of judges, at least once in rehearsal and once in the real demo.
- The judge (or a volunteer) can complete the full guest flow themselves in under a minute.
- No step in the demo depends on a paid service, an account requiring a credit card, or unpredictable third-party rate limits.
