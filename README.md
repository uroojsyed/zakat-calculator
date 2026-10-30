# Human Appeal Canada — Zakat Calculator

## Structure

- `index.html` — page content and markup
- `css/styles.css` — main styling and former static inline styles
- `css/responsive.css` — responsive layout and print rules
- `js/app.js` — calculator logic, rendering, event handlers, UI interactions
- `assets/human-appeal-logo.svg` — extracted embedded logo

## Running

Open `index.html` in a browser, or use a local static server (e.g. `python3 -m http.server 8000` from this folder). No build process is required. The Google Fonts URL and Human Appeal donation/navigation links remain external.

## Notes

The calculator's original rates, computations, text and behavior are preserved; no religious or financial calculation rules have been revised. Any dynamically generated inline styles in JavaScript remain part of the existing rendering logic. The page's built-in “Download HTML” feature was inherited from the original and saves the DOM; that downloaded single file does not bundle external CSS/JS assets, so use this complete project folder/ZIP to retain all styling and interactions.
