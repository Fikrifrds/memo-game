# Product Requirements Document (PRD) – Memo Dami Online

## 1. Product Overview
**Memo Dami Online** is a web-based digital version of the classic memory-matching game, designed for both solo and multiplayer play. Built with **Next.js, Tailwind CSS, and JavaScript**, the app will include analytics powered by **PostgreSQL** to track user activity, game sessions, and engagement metrics.

---

## 2. Goals & Objectives

### Primary Goals
- Build a fun and responsive digital memory-matching game.
- Provide both **single-player** and **multiplayer** modes.
- Track user behavior and game performance through analytics stored in **PostgreSQL**.
- Deliver a seamless experience on mobile and desktop.

### Secondary Goals
- Develop user accounts.
- Provide multiple card themes.
- Add leaderboards and achievements.

---

## 3. Target Users
- Children (4–10 years old)
- Parents/family users
- Casual players
- Educational institutions

---

## 4. Key Features

### 4.1 Game Modes

#### A. Single Player
- Timer and move counter.
- Difficulty selection.
- Restart button.

#### B. Multiplayer (Online)
- Realtime sync using WebSockets.
- 2–4 players per room.
- Public/private rooms.
- Scoreboards and turn indicators.

---

### 4.2 Difficulty Levels

| Mode   | Card Count           |
|--------|-----------------------|
| Easy   | 12 cards (6 pairs)    |
| Medium | 24 cards (12 pairs)   |
| Hard   | 48 cards (24 pairs)   |

---

### 4.3 Gameplay Mechanics
- Flip two cards per turn.
- Matched cards stay visible.
- Unmatched cards flip back after 1 second.
- Game ends when all pairs are matched.

---

### 4.4 UI/UX Requirements
- Next.js + Tailwind CSS.
- Fast, simple, colorful interface.
- Smooth card animations.
- Responsive mobile-first design.
- Optional sound effects.

---

### 4.5 Multiplayer Requirements
- WebSocket or Socket.IO real-time sync.
- Room creation, joining, and code-sharing.
- Game state synchronized for all players.
- Turn handling and score updates.

---

### 4.6 User Accounts (Phase 2)
- Email/password or Google login.
- Profile overview:
  - Total games
  - Wins/losses
  - Fastest times
  - Achievements

---

### 4.7 Themes / Card Packs
- Default theme
- Animals
- Fruits
- Illustration packs (Tony Wolf style)
- Future: Marketplace for premium themes

---

## 5. Technical Requirements

## 5.1 Tech Stack
- **Frontend:** Next.js, Tailwind CSS, React
- **Backend:** Next.js API Routes or standalone Node.js
- **Database:** PostgreSQL (Supabase / Neon / RDS)
- **Realtime:** WebSockets (Socket.IO or built-in)
- **Deployment:** Vercel + Supabase/Neon/PostgreSQL server

---

## 5.2 Game Engine Logic
- Card object structure:

```js
[
  { id: 1, image: '/cards/pic1.png', matched: false },
  { id: 2, image: '/cards/pic1.png', matched: false },
  ...
]
