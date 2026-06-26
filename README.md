# KILLER — Darts

A mobile-first scoreboard for the classic British pub darts game **Killer**. Designed for 5 players, built for dim pub lighting, big fingers, and close games.

## How to Run

### Quickest way (no install)
Open `index.html` directly in any browser — it loads React and Tailwind from CDN. Works on phones if served over your local network (see below).

### With npm
```bash
npm install
npm start        # opens on http://localhost:3000
```
Then share `http://<your-ip>:3000` with anyone on the same Wi-Fi so they can open it on their phone.

## The Rules

- **Name entry** — All 5 players enter their names. Set lives (1–5, default 3).
- **Number assignment** — Each player throws with their *left* hand. Wherever the dart lands is their personal number for the whole game. Tap that number on the pad.
- **Becoming a Killer** — Throw right-handed, trying to hit *your own number* three times. Tap **＋ hits** each time you score. At 3 hits your tile turns red — you are now a **KILLER ☠**.
- **Killing others** — As a Killer, aim for *other players'* numbers. Each hit removes one of their lives — tap **− lives** on their tile. Run out of lives → OUT.
- **Knockback** — If a Killer accidentally hits *their own number*, tap **− hits** on their tile; they drop back below 3 and lose Killer status.
- **Last player standing wins.**

## Screenshot

*(Add a screenshot of the game board here)*

## Tech Stack

Single-file standalone HTML (CDN) + React 18 + Tailwind CSS. No backend, no database, no cookies.
