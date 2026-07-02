This is a very large scope. Below is a phased plan I'll execute end-to-end after you approve. I'll flag two things I need decisions on before starting.

## Decisions I need from you

1. **Admin email you provided is `catphoenixnelsongmail.com`** — missing the `@`. I'll use `catphoenixnelson@gmail.com` (already the primary admin in the DB) with password `shamma3#`. Confirm or give the correct address.
2. **Admin contact phone `0509860`** is only 7 digits (Ugandan mobile numbers are 10). I'll display it as-is unless you give the full number. What email should appear alongside it in the "Admin Contact" block that replaces the ambulance staff section?
3. **"Change the pictures"** — which pictures? Hero image? Feature icons? Please point to specific spots (or say "regenerate the hero + add testimonial avatars + media gallery images" and I'll pick tastefully).

## Phase 1 — Credentials, contact, hero image (quick wins)
- Update `handle_new_user` trigger + reseed to make `catphoenixnelson@gmail.com` / `shamma3#` the working admin login (old seed kept as fallback).
- Replace "Ambulance Staff" block in `EmergencyContacts` with an **Admin Contact** card (phone + email you confirm).
- Regenerate hero image (`src/assets/hero-cityscape.jpg`) with a stronger Uganda civic-tech visual; refresh a couple of feature images.

## Phase 2 — Database migrations (one migration, many tables)
- `subscribers` (email, phone, channel, created_at) + RLS
- `forum_posts`, `forum_comments`, `forum_votes` + RLS + GRANTs
- Add `points int`, `level int` to `profiles`
- Add `latitude`, `longitude` to `incidents`
- `testimonials` (name, role, avatar_url, quote, published)

## Phase 3 — New pages & routes
| Route | Page |
|---|---|
| `/impact` | Public dashboard: stat cards + Recharts line/bar + district breakdown + jsPDF "Download Report" |
| `/emergency-map` | react-leaflet Uganda heatmap w/ color-coded markers, type filters, popups, safe-zone overlay |
| `/predict` | Risk-score-per-district + calendar heatmap, mock ML on incidents table, prototype disclaimer |
| `/research` | Problem, lit review, personas, stack rationale, methodology, references |
| `/media` | Photos/videos gallery, press coverage, awards |
| `/forum` + `/forum/:id` | Categories, posts, comments, upvote/downvote; admin moderation tab |
| `/leaderboard` | Top users by points, badges |

## Phase 4 — Homepage additions
- SDG 3 / 9 / 11 badges (link to un.org SDG pages)
- Testimonials carousel (embla, avatars from `testimonials` table)
- Newsletter + SMS signup form → `subscribers`

## Phase 5 — Cross-cutting
- **i18n** (i18next + react-i18next): en / lg / nyn; language switcher in Navbar. Translate nav, hero, CTAs, and new page headers — full translation of every string is out of scope for one pass; I'll seed the dictionaries and mark untranslated keys as fallbacks.
- **Offline**: `vite-plugin-pwa` with `generateSW`, `NetworkFirst` navigations, guarded registration wrapper (skips Lovable preview + iframe), offline banner, cached homepage + emergency contacts. Only works in the published app, not the editor preview.
- **Gamification**: points awarded on incident submit and forum post/comment via DB triggers.
- Navbar: add links (grouped in a dropdown to avoid overflow).

## Phase 6 — Admin dashboard additions
- Testimonials tab (CRUD)
- Forum moderation tab (delete posts/comments, ban)
- Subscribers tab (export CSV)

## Technical notes
- Charts: **Recharts** (already in project).
- Maps: **react-leaflet** (new dep) + OSM tiles; heatmap via colored `CircleMarker`s (avoids leaflet.heat dep issues).
- PDF: **jsPDF** + **jspdf-autotable**.
- i18n: **i18next + react-i18next + i18next-browser-languagedetector**.
- PWA: **vite-plugin-pwa** with the guarded registration wrapper from the PWA skill.
- All new tables get GRANTs + RLS per project rules.

## Scope reality check
This is ~12 features. I'll execute in the order above so each phase is usable if we stop early. Expect the full build to touch ~40+ files. I will NOT stop mid-way for confirmations unless a migration surfaces an approval prompt.

**Reply with:**
1. Correct admin email (confirm `catphoenixnelson@gmail.com`?)
2. Full admin phone + email for the contact block
3. Which pictures to change (or "you pick")

Then I'll ship it.