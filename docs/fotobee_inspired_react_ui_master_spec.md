# UI/UX MASTER SPECIFICATION — REACT + VITE

```text
Event Photo Delivery Platform
Fotobee-inspired product UX + immersive photography opening
NON-NEGOTIABLE: React + JavaScript only. No Next.js. No TypeScript.
```


## 1. Purpose
This document is the UI source of truth for the hackathon frontend. Build a polished event photo delivery product with a calm, premium, photography-first product experience inspired by Fotobee, while creating an original immersive opening inspired by interactive photography portfolios such as Gregor Collienne.
The product has three experiences: public landing page, photographer/admin application, and guest photo-finding portal.

## 2. Non-Negotiable Technology
- Frontend MUST be React + Vite + JavaScript + JSX.
- Use React Router for routing.
- Use Tailwind CSS.
- Use shadcn/ui or the existing reusable UI primitives where appropriate.
- Use TanStack Query where asynchronous state will later be needed.
- Use Motion/Framer Motion for animation where useful.
- DO NOT use Next.js anywhere in the frontend.
- DO NOT use TypeScript. No .ts or .tsx files.
- Do not use Next.js App Router, Server Components, Server Actions, Route Handlers, next/image, next/link, or Next middleware.
- Keep the backend separate.

## 3. Product Understanding
The photographer/admin uploads the actual event photographs. The customer/guest does NOT upload an event photograph. The customer takes one selfie so the future face-recognition backend can identify that person's face and find matching photographs among the photographer's uploaded event photos.

```text
PHOTOGRAPHER
Create event → Upload event photos → AI indexes faces → Share event link / QR

GUEST
Open event → Take one selfie → AI matches face → Personal gallery → Download photos
```


## 4. Visual Direction
Use Fotobee as the primary reference for product UX and visual tone: calm, premium, clean, event-focused, photography-led, clear workflow, strong whitespace, polished upload states, event workspaces, QR sharing, and personalized guest galleries. Do not copy its branding, exact layouts, text, or assets.
The current Fotobee workflow is organized around Shoot → Upload → Share → Deliver, with an event workspace, upload progress, QR/link sharing, and a guest selfie-to-gallery flow. Use these as interaction principles, not as a template to clone.
The public landing page should additionally have an immersive photography opening inspired by the feeling of Gregor Collienne. The goal is an original live/3D-feeling photo entrance, not a clone.

## 5. Theme — Critical
The website MUST NOT be a full-black theme. The default visual theme is LIGHT, warm, premium, and photography-first.

```text
Background: #F7F7F5
Surface: #FFFFFF
Soft surface: #F1F1EE
Primary text: #171717
Secondary text: #686864
Border: #E5E5E0
Accent: #6C63FF
Accent soft: #EEECFF
Success: #2E8B67
Warning: #D99A32
Danger: #D95C5C
```

- Use dark text on light backgrounds.
- Black may be used selectively for typography, image overlays, or a small cinematic hero area, but NOT as the application-wide background.
- No all-black dashboard.
- No black cards everywhere.
- No neon AI aesthetic.
- No excessive glassmorphism.
- No excessive gradients.
- No giant dark empty backgrounds.

## 6. Design Language
- Premium photography software, not generic AI SaaS.
- Large editorial typography with restrained weights.
- Generous whitespace.
- Soft neutral surfaces.
- Photography is the visual anchor.
- Use cards only when they improve hierarchy.
- Subtle 10–20px corner radii.
- Fine borders and soft shadows.
- Clear, tactile buttons.
- Every interaction has a visible state.

## 7. Public Landing Page

```text
NAV
Logo                         How it works   For Photographers   Login

HERO
Large layered event photographs

Every moment.
Find yours.

One selfie. Every moment you're in.

[ Create an Event ]  [ See How It Works ]

HOW IT WORKS
01 Create Event
02 Upload Photos
03 Share
04 Guests Find Photos

PHOTOGRAPHER EXPERIENCE
Create → Upload → Process → Share

GUEST EXPERIENCE
Open → Selfie → Match → Gallery

PRIVACY
Short, reassuring explanation

FINAL CTA
Create your first event
```


## 8. Immersive Hero
1. Load a large event photograph immediately; do not show a blank black screen.
1. Use 2–5 layered photographs with different sizes/depth positions.
1. Apply a subtle scale-in/settle animation.
1. Use slight perspective and translation to create depth.
1. On desktop, allow very subtle pointer-reactive movement.
1. As the user scrolls, images should reposition/reveal the product message.
1. Reveal brand and headline with restrained typography.
1. Show the CTA without blocking interaction.
1. Transition naturally into the workflow section.
The hero must remain usable during animation. Never make visitors wait several seconds before the page becomes interactive.

## 9. Motion Rules
- Use Motion/Framer Motion and CSS transforms.
- Prefer transform, opacity, scale, translate, and perspective.
- Use sticky sections for controlled scroll storytelling when useful.
- Use subtle parallax rather than extreme movement.
- Support prefers-reduced-motion.
- Do not introduce Three.js/WebGL for the first implementation.
- Do not use expensive layout-triggering animation.
- Do not animate every element.
- Motion should communicate depth, hierarchy, or state.

## 10. Photographer/Admin Application
The photographer side should feel like premium professional software: calm, structured, and efficient.

```text
┌────────────────────────────────────────────────────────────┐
│ Logo     Dashboard     Events     Settings        Profile │
├──────────────┬─────────────────────────────────────────────┤
│ Navigation   │ Good morning, [Name]                       │
│              │ Manage your events and photo delivery.     │
│              │ [ + Create Event ]                         │
│              │                                             │
│              │ Events     Photos     Guests                 │
│              │ 12        3,482       186                   │
│              │                                             │
│              │ Recent Events                               │
│              │ [cover] Aarav & Meera Wedding     Ready →   │
│              │ [cover] Annual Summit             Processing│
└──────────────┴─────────────────────────────────────────────┘
```


## 11. Dashboard
- Light background.
- White event cards with image thumbnails.
- Small status badges.
- Clear Create Event CTA.
- Photo counts and processing status.
- No unnecessary billing, CRM, or enterprise analytics.
- Use compact navigation; do not add unnecessary navigation.

## 12. Create Event

```text
Create your event

Event name
[ Aarav & Meera Wedding ]

Event date
[ 18 Dec 2026 ]

[ Create Event ]
```

On submit, the mock service must create an event and navigate to the event workspace. This must be functional before the backend exists.

## 13. Event Workspace

```text
← Events

Aarav & Meera Wedding
18 Dec 2026                         [ Share Event ]

1,248 photos      186 matched guests      Ready

[ Upload Photos ]

Overview     Photos     Guests

[photo] [photo] [photo] [photo]
[photo] [photo] [photo] [photo]
```

- Event cover photo.
- Event name/date.
- Processing status.
- Photo count.
- Guest/match count.
- Upload action.
- Share action.
- Photo gallery.

## 14. Upload Experience

```text
Upload photos

┌────────────────────────────────────────────┐
│                                            │
│          Drop photos here                  │
│          or [ Browse files ]               │
│                                            │
│          JPG · PNG · HEIC                  │
└────────────────────────────────────────────┘

Uploading 428 of 512 photos
██████████████████░░ 84%

[thumb] ✓   [thumb] ✓   [thumb] ◌   [thumb] ◌
```

Use mock upload progress now. Later this will connect to real storage.

## 15. Processing State

```text
Processing your event

✓ Photos uploaded
✓ Images optimized
◌ Finding faces
○ Building your event index

██████████████░░░░ 78%

932 / 1,248 photos processed
```


## 16. Share / QR

```text
Your event is ready to share

            ┌───────────┐
            │   QR CODE │
            └───────────┘

Scan to find your photos

https://example.com/e/aarav-meera

[ Copy Link ]    [ Download QR ]
```

Use a clean white QR card. Avoid putting the QR inside a giant dark panel.

## 17. Guest Experience
The guest portal is mobile-first and visually closer to a premium gallery than a dashboard.

```text
┌──────────────────────────┐
│       [EVENT PHOTO]      │
│                          │
│     Aarav & Meera        │
│        Wedding           │
│                          │
│   Find every photo       │
│       you're in.         │
│                          │
│   [ Find My Photos ]     │
│                          │
│ 🔒 One selfie is used    │
│    to find your photos.  │
└──────────────────────────┘
```


## 18. Consent

```text
Before we find your photos

Take one selfie and we'll use it to
find photos of you in this event.

☐ I agree to use my selfie for
  event photo matching.

[ Continue ]
```


## 19. Selfie Camera
The customer takes a selfie to identify their face. They are not uploading an event photograph.

```text
Find your photos

┌────────────────────┐
│       CAMERA       │
│        ◯           │
└────────────────────┘

Centre your face
Good lighting works best

[ Take Selfie ]

[ Upload a selfie instead ]
```

- Use browser camera access when implemented.
- Show a subtle face guide.
- Show permission/error states.
- Provide upload-selfie fallback.
- Do not permanently store the selfie in the frontend.

## 20. Matching State

```text
Finding your photos...

✓ Selfie captured
✓ Face detected
◌ Searching event photos
◌ Finding your moments
```


## 21. Match Success

```text
✨ We found 47 photos

Your moments

┌────────┬────────┐
│ PHOTO  │ PHOTO  │
├────────┼────────┤
│ PHOTO  │ PHOTO  │
├────────┼────────┤
│ PHOTO  │ PHOTO  │
└────────┴────────┘

[ Download All ]
```

The result reveal is the guest-side wow moment. Use a subtle staggered image reveal, not flashy confetti.

## 22. Gallery
- Mobile: two-column image grid.
- Desktop: three or four columns.
- Large photographs with consistent aspect-ratio handling.
- Lazy loading.
- Soft image placeholders.
- Minimal controls.
- Full-screen viewer/lightbox.
- Individual download.
- Download all.

## 23. Page-by-Page Requirements
- Landing: immersive, editorial, light/premium base theme.
- Login: simple, bright, minimal.
- Dashboard: light SaaS workspace, white cards, photography thumbnails.
- Create Event: short focused form.
- Event Workspace: photo-first with clear processing/share actions.
- Upload: large dropzone + realistic queue/progress.
- Share: clean QR/link card.
- Guest Event: event cover + one primary CTA.
- Selfie: camera is the dominant element.
- Results: gallery-first, minimal chrome.

## 24. Responsive
- Guest experience is mobile-first.
- Photographer dashboard is desktop-first.
- Landing page works on desktop and mobile.
- Reduce decorative motion on mobile when needed.
- Two-column guest galleries on mobile.
- Do not merely shrink desktop layouts.
- Respect mobile safe areas on camera screens.

## 25. React Project Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── landing/
│   │   ├── photographer/
│   │   └── guest/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```


## 26. Mock Service Rule

```text
Component
   ↓
Service
   ↓
Mock data

Later:

Component
   ↓
Service
   ↓
FastAPI / Supabase
```

Pages must not contain large hardcoded mock arrays.

## 27. Definition of Done
- Real polished landing page, not a black placeholder.
- All required routes render.
- Navigation works.
- Create Event works using mock data.
- Event workspace works.
- Upload interaction works.
- Processing states work.
- QR/share page works.
- Guest event works.
- Selfie UI works.
- Mock matching works.
- Results gallery works.
- Photo viewer works.
- Download UI works.
- No blank pages.
- No runtime console errors.
- No .ts/.tsx files.
- No Next.js dependencies or APIs.
- Production build succeeds.
- Desktop and mobile layouts are usable.

## 28. Do Not Do
- Do not mechanically preserve broken Next.js conversion output.
- Do not keep broken converted components merely because they compile.
- Do not use a full-black theme.
- Do not create a generic dashboard template.
- Do not make every section a dark card.
- Do not use generic AI illustrations.
- Do not overuse animations.
- Do not add backend code in this UI phase.
- Do not add Supabase yet.
- Do not add real face recognition yet.
- Do not add paid services.
- Do not use Next.js.
- Do not use TypeScript.

## 29. Final Implementation Instruction
Treat this document as the visual and interaction source of truth. Before changing the UI, inspect the current React/Vite implementation and rewrite broken components where necessary. Do not preserve broken output from the previous automated conversion.
The target is a polished, light, photography-first product experience with Fotobee-inspired workflow quality and an original immersive hero. The application must be fully React + Vite + JavaScript.
