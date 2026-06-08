# WhatsOrderNG — WhatsApp Storefront Demo

A conversion-focused landing page demo for selling website services to small business owners in Nigeria. Customers browse products and order via WhatsApp in one tap.

## Tech stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com) (CDN)
- Vanilla JavaScript (`src/js/app.js`)
- Custom styles (`src/css/styles.css`)

## Run locally

No build step required.

1. Open the project folder.
2. Double-click **`src/index.html`**, or open it in your browser.

For live reload during edits (optional):

```bash
npm install
npx live-server src
```

## Customize WhatsApp number

Edit **`src/js/config.js`** (one place updates every button and link):

```js
window.WHATSAPP_CONFIG = {
  phone: '2348012345678',      // no + or spaces
  display: '+234 801 234 5678'  // shown on the page
};
```

Then redeploy to Vercel (`npx vercel deploy --prod` from `phone-email-demo`).

## Deploy on Netlify

1. Go to [netlify.com](https://www.netlify.com) and sign in (or create a free account).
2. Drag and drop the **`src`** folder onto the Netlify deploy area.
   - Netlify will serve `index.html` as the site entry.
3. Copy your live URL (e.g. `https://your-site-name.netlify.app`).

**Tip:** Set the publish directory to `src` if you connect a Git repository instead of drag-and-drop.

## Deploy on Vercel (recommended)

From the `phone-email-demo` folder (linked to project **whats-order-ng**):

```bash
npx vercel deploy --prod
```

Production URL: **https://whats-order-ng.vercel.app**

## Project structure

```
phone-email-demo/
├── README.md
├── src/
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   ├── logo.svg
│   ├── favicon.svg
│   └── assets/images/   # Product SVG placeholders
```

## Demo products

Eight sample products with Naira prices and WhatsApp order links:

| Product | Price |
|---------|-------|
| Chicken Shawarma | ₦2,500 |
| Sneakers | ₦18,000 |
| Hoodie | ₦15,000 |
| Wristwatch | ₦7,500 |
| Phone Case | ₦3,000 |
| Bag | ₦12,000 |
| Perfume | ₦10,000 |
| Cap | ₦5,000 |

## License

MIT — use freely for client demos and portfolios.
