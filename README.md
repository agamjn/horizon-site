# Horizon — landing page

Marketing landing page for **Horizon**, a macOS menu-bar app that nudges you to
rest your eyes using the 20‑20‑20 rule (every 20 minutes, look into the distance
for 20 seconds). Served at **https://horizon.agamjn.com**.

Recreated pixel-for-pixel from a [Claude Design](https://claude.ai/design) handoff,
rebuilt as a dependency-free static site (the prototype used React + Babel in the
browser; production uses plain HTML/CSS/JS).

## Files

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `index.html`  | Page markup + inlined SVG glyphs and the menu-bar mock         |
| `horizon.css` | Design tokens, page layout, and the V2 "ring hero" component   |
| `app.js`      | Interactive preview: countdown, pause, steppers, switch        |
| `favicon.svg` | App-icon style favicon (sun on the horizon)                    |
| `CNAME`       | Custom domain for GitHub Pages (`horizon.agamjn.com`)          |
| `.nojekyll`   | Tells GitHub Pages to skip Jekyll and serve the files as-is    |

No build step. Open `index.html` in a browser, or:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy — at `horizon.agamjn.com` (GitHub Pages + subdomain)

Hosted on a **subdomain** rather than the path `agamjn.com/horizon`, because the
app's source repo is already named `Horizon` (`agamjn/Horizon`) and GitHub repo
names are case-insensitive. The repo name below doesn't affect the URL — the
`CNAME` file does.

1. **Repo:** `agamjn/horizon-site` (public).
2. **Push** this folder to it (`main` branch).
3. **Enable Pages:** Settings → Pages → Deploy from a branch → `main` / root. The
   `CNAME` file sets the custom domain automatically.
4. **GoDaddy DNS** (Domains → agamjn.com → DNS → Add): **Type** `CNAME` · **Name**
   `horizon` · **Value** `agamjn.github.io` · **TTL** default. (No conflicting
   `horizon` record should exist.)
5. After the DNS check passes in Settings → Pages, tick **Enforce HTTPS**.

Live at **https://horizon.agamjn.com**. Your apex `agamjn.com` and your `Horizon`
app repo are untouched.

## Notes

- The **"Download now"** button is a placeholder until a macOS build exists; clicking
  it reveals a subtle "coming soon" note. Swap it for a real download/App Store link
  (or a waitlist form) when ready in `index.html` + `app.js`.
- All motion respects `prefers-reduced-motion`.
