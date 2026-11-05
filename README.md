# Human Appeal Canada – Zakat Calculator (redesign)

A static, no-build version of the Human Appeal Canada Zakat Calculator. Plain HTML, CSS and vanilla JavaScript – no frameworks, no dependencies, no build step.

## Structure

```
.
├── index.html                          # Page markup (header, hero, calculator, FAQ, footer, modal)
├── css/
│   └── styles.css                      # All styling; brand colours and fonts are CSS variables in :root
├── js/
│   └── app.js                          # Calculator state, maths, live prices, rendering and UI behaviour
├── assets/
│   ├── images/
│   │   ├── logo.svg                    # Human Appeal logo (header)
│   │   └── favicon.svg                 # Browser tab icon
│   └── fonts/
│       ├── DINNextLTPro-Regular.woff2   # DIN Next LT Pro Regular (primary face)
│       └── DIN-Regular.woff2            # DIN Regular (second face)
├── downloads/
│   └── human-appeal-canada-zakat-calculator-website.zip   # Self-contained single-file copy, offered by the Download buttons
├── .nojekyll                           # Tells GitHub Pages to serve files as-is
├── .gitignore
└── README.md
```

## Run locally

Open `index.html` in a browser, or serve the folder (needed for live prices):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. The site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Editing guide

| To change… | Edit… |
| --- | --- |
| Brand colours, fonts | `:root` variables and `@font-face` rules at the top of `css/styles.css` |
| Hero height / width | `.hero`, `.hero-in` and `.hero h1` rules in `css/styles.css` (the hero background is full-width; `.hero-in` controls its content width and vertical padding) |
| Fallback gold, silver and exchange-rate values | The `M` object near the top of `js/app.js` |
| Nisab weights (87.48 g gold, 612.36 g silver) | `GOLD_G`, `SILVER_G` in `js/app.js` |
| Zakat rate (2.5%) | The `.025` multiplier in the `calc()` function in `js/app.js` |
| Copy, navigation, FAQs, footer | `index.html` |
| Logo | Replace `assets/images/logo.svg` |

## Live prices

On `http(s)` the calculator fetches live gold and silver prices from [gold-api.com](https://gold-api.com) and USD→CAD/GBP/EUR exchange rates from [Frankfurter](https://frankfurter.dev), refreshing every 15 minutes. If a request fails, or the page is opened from `file://`, it falls back to the reference values in the `M` object in `js/app.js` and shows a notice. Both services are free and need no API key.

## Updating the downloadable ZIP

`downloads/human-appeal-canada-zakat-calculator-website.zip` contains one self-contained HTML file (CSS, JS, logo and fonts inlined). It is a static file, so after you change the site, rebuild and replace it. One way: inline `css/styles.css`, `js/app.js`, the logo and the fonts (as base64 data URIs) into a copy of `index.html`, save it as `human-appeal-canada-zakat-calculator.html`, and zip it.

## Notes

- **Fonts:** the site uses DIN Next LT Pro Regular, with DIN Regular as the second font in the stack (`--sans` at the top of `css/styles.css`). The files in `assets/fonts/` are `.woff2` conversions of the supplied `.ttf` files. DIN has no € sign, so that one character falls back to the system font.
- **Bold:** only Regular weights are provided, so `font-synthesis: none` is set on `body` to stop browsers from faking bold (which makes text look blurry). Hierarchy comes from size, colour and letter-spacing. If you get real Medium/Bold files, add an `@font-face` for each weight and delete that `font-synthesis` declaration.
- **Font licensing:** DIN Next LT Pro and DIN are commercial typefaces. Confirm Human Appeal Canada's licence covers web use on this domain before making the repository public. If not, delete the `@font-face` rules and the font files; the CSS falls back to Avenir Next, Segoe UI, then Arial.
- This calculator is an educational planning estimate, not a religious ruling.

## Live estimate behaviour

- **Desktop (wider than 1100px):** the live-estimate column is sticky and scrolls independently of the page, so the full breakdown can be read without scrolling the form. Heights are set in the `aside` rules in `css/styles.css`.
- **Phones and tablets (1100px and narrower):** the estimate sits below the form. A translucent floating button follows the user down the page and shows the live Zakat amount. Tapping it opens the estimate in a bottom sheet; "Collapse" (or tapping outside) returns to the form. The button disappears once the real estimate box scrolls into view. A slim scroll indicator on the right edge shows position on the long page. The logic lives in `js/app.js` (search for "floating live-estimate button").
- **Info tooltips:** show on hover (or keyboard focus) with a mouse, and on tap on touch devices. They are positioned with fixed coordinates and clamped to the screen, so they are never clipped by a scrolling panel.
- **Calculation details** is an accordion, open by default.
