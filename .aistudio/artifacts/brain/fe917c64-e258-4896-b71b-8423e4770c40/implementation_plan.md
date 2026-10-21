# VELVET — Liquid Glass VOD Streaming Platform

An ultra-dark, luxury Video-on-Demand (VOD) and Live TV streaming web application featuring visionary Liquid Glass aesthetics, electric violet and midnight indigo ambient illumination, and a complete suite of nine interconnected cinematic views.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product design choices have been confirmed and are integrated into the architecture:

- **Brand Identity**: Confirmed as **VELVET** — an ultra-dark luxury cinema and live television experience inspired by visionOS translucency and masterwork theatrical framing.
- **Visual Aesthetic & Lighting**: Confirmed as **Electric Violet & Midnight Indigo glow** over deep obsidian/midnight canvas (`#08090D` and `#10131B`), with layered translucent glass panels (`backdrop-blur-xl`, subtle specular hairline borders, and refractive depth).
- **Playback Architecture**: Confirmed as **Full Custom Player** featuring robust native HTML5 video playback, real sample media trailers, resume progress tracking, interactive scrubbing, volume, fullscreen, speed selector, subtitle toggle, and episode transitions.

---

## 1. Overview & Core Concept

- **What It Does**: VELVET delivers an end-to-end, high-fidelity streaming platform that transitions seamlessly from personalized onboarding to rich content discovery, detailed media exploration, custom video playback, live TV channel hopping, and persistent user profile management.
- **Target Audience / Persona**: Film enthusiasts, binge watchers, and live broadcast viewers seeking a theater-grade digital experience with tactile glass surfaces, seamless navigation, and zero visual clutter.
- **Key Value**: Delivers the tactile spatial luxury of Apple visionOS and modern boutique cinemas directly in the browser—combining instant client-side performance, local continuity (resume watching and watchlists), and complete interface responsiveness across desktop, tablet, and mobile.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Welcome & Identity Onboarding (`/welcome`)**:
   - First-time visitors arrive at a full-bleed cinematic stage with animated ambient violet light orbs.
   - A refractive Liquid Glass card welcomes the user, requests their display name, validates input, and persists the profile to `localStorage`.
   - Returning users have their identity automatically restored with a smooth 1-click continuation shortcut.
2. **Cinematic Home Experience (`/home`)**:
   - Floating glass navigation bar with the clean VELVET wordmark, single-line navigation links, active search shortcut, and user avatar.
   - Immersive hero billboard showcasing featured blockbusters with audio preview hooks, genre pills replaced with clean typographic metadata (`·`), and high-intent "Play Now" and "More Info" triggers.
   - Layered horizontal carousels for "Trending Now", "Continue Watching" (with live progress meters), "Recommended for You", "Popular Series", and "Live TV Spotlight".
3. **Dedicated Content Discovery (`/movies` & `/series`)**:
   - Filterable catalog by genre, release era, and popularity.
   - Responsive multi-column poster grids with smooth hover magnification, quick-add watchlist bookmarking, and instant detail transitions.
4. **Interactive Search Matrix (`/search`)**:
   - Real-time search-as-you-type indexing across titles, genres, directors, cast, and storylines.
   - Multi-parameter faceted filter bar (Format, Genre, Era, Sort Order).
   - Local search history tags with quick re-querying and item deletion.
   - Dedicated zero-state exploration suggestions and graceful no-results states.
5. **Live Television Guide & Broadcast Hub (`/live`)**:
   - Channel spectrum across News, Sports, Cinema, Entertainment, and Documentaries.
   - Interactive electronic program guide (EPG) showing current broadcasts, upcoming programming, and live progress gauges.
   - Dedicated glass stage player for active channels with live status indicators and demo stream playback.
6. **Unified Media Details Hub (`/details/:id`)**:
   - Cinematic backdrop header with gradient light bleed and high-contrast scrim.
   - Rich metadata display: release year, age certification, runtime, audio/video specs (4K HDR, Dolby Atmos), and narrative synopsis.
   - Interactive season & episode selector for TV series with individual episode thumbnails and summaries.
   - Cast showcase and curated algorithmic "More Like This" recommendations.
7. **Theater-Grade Video Player (`/watch/:id`)**:
   - Edge-to-edge cinematic viewport with ambient glow matching the active title.
   - Custom Liquid Glass control dock that smoothly hides upon inactivity and reveals on pointer motion or touch.
   - Working timeline seeker, current/remaining timestamps, volume slider, mute toggle, playback speed menu (0.5x to 2x), subtitle switch, and fullscreen toggle.
   - Auto-saving playback position every 3 seconds to ensure seamless resumption from Home or Details.
   - Up Next drawer and Next Episode autoplay affordance for series.
8. **Profile & Viewing Sanctuary (`/profile`)**:
   - User customization: avatar switcher, display name editor, and viewing preferences (auto-play next episode, default audio stream).
   - Direct management of active Watchlist items, Continue Watching history, and watched titles.
   - Safe confirmation dialogs for resetting profile state or clearing watch history.

### Visual Identity & Theme
- **Color Discipline (60-30-10)**:
  - *60% Neutral Canvas*: `#08090D` (Void Obsidian) and `#10131B` (Deep Midnight Charcoal).
  - *30% Glass Structures*: Translucent surfaces `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)`, backed by high-blur filters (`backdrop-blur-2xl`), hair-thin specular borders (`rgba(255, 255, 255, 0.12)`), and deep ambient drop shadows (`0 20px 50px rgba(0, 0, 0, 0.6)`).
  - *10% Focal Violet Accent*: Electric Violet (`#8B5CF6` / `#A855F7`) and Midnight Indigo (`#4F46E5`) concentrated on active states, primary CTA buttons, playback progress bars, and subtle aura glows.
- **Typographic Hierarchy**:
  - *Display / Headings*: Plus Jakarta Sans & Outfit (geometric, tightly tracked, high legibility on dark glass).
  - *Body Prose*: DM Sans / Plus Jakarta Sans (15px, comfortable 1.6 line height).
  - *Data & Timestamps*: Monospace tabular numerals (`tabular-nums font-mono`) for runtimes, video clocks, and broadcast schedules.
  - *Zero-Pill Compliance*: Metadata rendered as unboxed text with subtle `·` separators, avoiding generic badge clutter.
- **Top Bar Contract**:
  - Strict 3-zone layout: `[VELVET Wordmark]` — `[Home · Movies · Series · Live TV · Search]` — `[Profile Avatar & Name]`.

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side Storage vs. Server Auth**:
  - *Chosen Approach*: Resilient `localStorage` persistence service with schema versioning.
  - *Why*: Allows instant, frictionless out-of-the-box operation with zero cloud configuration or third-party sign-in friction, while reliably persisting user name, watchlist, playback positions, and preferences across page reloads.
  - *Alternatives Considered*: Firebase / Cloud SQL — passed over because user explicitly specified local persistence without API keys or cloud dependencies.
- **Unified Media Model for Movies & Series**:
  - *Chosen Approach*: A polymorphic content schema supporting single-feature movies and multi-season/multi-episode series under one unified route `/details/:id` and `/watch/:id?ep=...`.
  - *Why*: Prevents duplicated page logic, centralizes watchlist and progress management, and simplifies deep linking.
- **Native HTML5 Video Player with Fallback Reel System**:
  - *Chosen Approach*: Custom-styled HTML5 player wrapping verified, high-quality open-source media streams (such as Blender Foundation open cinematic films and trailers) paired with realistic poster backdrops and procedural ambient canvas illumination.
  - *Why*: Guarantees immediate, error-free playback in all browser environments without broken external CDNs or licensing hurdles.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VELVET APPLICATION                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                        CLIENT ROUTER                           │   │
│   │  /welcome   /home   /movies   /series   /live   /search        │   │
│   │  /details/:id       /watch/:id          /profile               │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────▼────────────────────────────────┐   │
│   │                     STATE & STORAGE LAYER                      │   │
│   │  - ProfileStore (User Name, Avatar, Preferences)               │   │
│   │  - LibraryStore (Watchlist, ContinueWatching, History)         │   │
│   │  - NavigationStore (Current Route, Search Query, Active Modal) │   │
│   │  - LocalStorage Engine (Auto-sync & Recovery)                  │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────▼────────────────────────────────┐   │
│   │                      COMPONENT SYSTEM                          │   │
│   │  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐  │   │
│   │  │   GlassNavbar    │ │   HeroBillboard  │ │  MediaCarousel │  │   │
│   │  └──────────────────┘ └──────────────────┘ └────────────────┘  │   │
│   │  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐  │   │
│   │  │   ContentCard    │ │  EPGChannelGrid  │ │  PlayerEngine  │  │   │
│   │  └──────────────────┘ └──────────────────┘ └────────────────┘  │   │
│   │  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐  │   │
│   │  │   FilterMatrix   │ │   GlassModal     │ │ ToastNotifier  │  │   │
│   │  └──────────────────┘ └──────────────────┘ └────────────────┘  │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────▼────────────────────────────────┐   │
│   │                     MEDIA & CONTENT ENGINE                     │   │
│   │  - 25+ Curated Cinema & TV Series Titles                       │   │
│   │  - EPG Live Channel Schedules (News, Sports, Films, Docs)      │   │
│   │  - High-Fidelity Theatrical Backdrops & Posters                │   │
│   │  - Open-Source Sample Video Stream Manifests                   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Entities
- **MediaItem**: `id`, `title`, `tagline`, `type` (`movie` | `series`), `description`, `releaseYear`, `duration`, `genres`, `rating` (e.g. `8.9`), `contentRating` (`PG-13`, `TV-MA`), `poster`, `backdrop`, `trailerUrl`, `videoUrl`, `cast`, `director`, `trending`, `featured`, `seasons` (optional array of `Season` with `episodes`).
- **LiveChannel**: `id`, `name`, `callsign`, `category`, `logo`, `currentShow`, `nextShow`, `progressPercentage`, `streamUrl`, `badge`.
- **UserProgress**: `contentId`, `episodeId` (optional), `timestamp`, `duration`, `percentage`, `lastWatchedAt`.
- **UserProfile**: `name`, `avatar`, `joinedDate`, `preferredGenres`, `autoplayNext`, `audioLanguage`.

### Verification & Quality Assurance Strategy
1. **Compilation & Typing**: Full `npm run build` and `npx tsc --noEmit` pass with zero TypeScript errors.
2. **Design Integrity**: Complete compliance with Anti-Slop, Zero-Pill, and Top Bar guidelines.
3. **Responsive Testing**: Fluid adaptation across desktop ($1440\text{px}$), tablet ($768\text{px}$–$1024\text{px}$), and mobile ($375\text{px}$–$430\text{px}$).
