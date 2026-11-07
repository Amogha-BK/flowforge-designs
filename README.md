# FlowForge.designs

Wedding template gallery with ten designs priced at ₹699, personalized invitations, WhatsApp RSVP, saved favourites, browser drafts, shareable links and standalone HTML export.

## Run locally

Requires Node.js. No dependency installation is needed.

```powershell
cd D:\Wedding-invites_FlowForge\flowforge-designs
npm start
```

Open http://localhost:3000. Press Ctrl+C to stop.

## Sharing

Use **Make it yours**, enter the wedding and host details, and select **Save & create my invitation**. Copy the generated invitation link or share it on WhatsApp. On a deployed public website, guests can open that link without signing in. A localhost link only works on the machine running the server; use the public deployment for guests.

The URL fragment includes the invitation details. Anyone with the link can read them, including the host WhatsApp number. Editing creates a new link; older links retain their original details. Drafts and favourites stay in this browser. RSVP messages are prepared for guests to send in WhatsApp; no central guest database is used. Payment collection is not integrated. The ₹699 price is displayed design pricing, not a checkout or a completed transaction.

## Files

- `dist/index.html`, `styles.css`, `app.js`: gallery and editor
- `dist/invitation.html`: self-contained invitation and portable export
- `dist/assets/wedding.jpg`: locally bundled wedding photograph from Unsplash
- `serve.mjs`: local HTTP server

The original workspace `index.html` is preserved. The live site uses `dist/`.

## Verification

`npm run check` checks JavaScript syntax. For the browser smoke test, run `npm install`, start the local server, then run `npm test`. The test uses Google Chrome at its standard Windows installation path; update `verify.mjs` if your browser is installed elsewhere.

## Royal Envelope RSVP

The Royal Envelope template recreates the supplied video?s burgundy floral envelope, animated gold wax seal, ivory rose stationery and gold invitation typography. Choose it in the gallery to personalize names, date, venue and the host WhatsApp number. Direct sample: `/invitation.html?template=royal-envelope`. Export embeds the artwork for offline use.

Run `node verify-reference.mjs` with the local server running to check the new design, RSVP acceptance and decline, mobile widths, and offline export.
