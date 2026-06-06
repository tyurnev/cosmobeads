# Cosmo Beads

Cosmo Beads is a private MVP storefront for handmade Y2K bead pieces. The site includes the approved homepage, product pages, checkout, a Decap CMS product editor, and a server-side order request endpoint that sends real requests to Telegram.

No online payments, database, or custom admin panel are included yet. Product content is Git-based JSON managed through Decap CMS.

## Run Locally

Create an environment file:

```bash
cp .env.example .env
```

Fill in Telegram credentials:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=5384335200,1948372223
PORT=5173
```

Start the site and API:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

The admin UI is available at:

```text
http://127.0.0.1:5173/admin/
```

For local Decap editing, run the Decap proxy in a second terminal from the project root:

```bash
npx decap-server
```

Keep `npm run dev` running in the first terminal.

## Site Config

Launch contacts, brand name, default meta copy, delivery text, and order success copy live in:

```text
src/data/siteConfig.js
```

Update this file before launch with the final Instagram and Telegram URLs:

```js
contacts: {
  instagramUrl: "https://instagram.com/cosmobeads",
  telegramUrl: "https://t.me/cosmobeads",
  label: "IG/TG",
}
```

## Telegram Setup

1. Create a bot with BotFather.
2. Put the bot token in `TELEGRAM_BOT_TOKEN`.
3. Add the bot to the target chat or channel.
4. Put the target chat id in `TELEGRAM_CHAT_ID`.
5. To notify multiple owners, separate chat ids with commas: `TELEGRAM_CHAT_ID=5384335200,1948372223`.
6. Keep `.env` private. Commit only `.env.example`.

The browser never receives Telegram secrets. Requests go to `POST /api/order-request`, and the Node server sends the Telegram message.

## Test A Full Order Request

1. Start the server with valid Telegram env vars.
2. Open a product page, for example:

```text
http://127.0.0.1:5173/product/star-soda-necklace/
```

3. Click `Купить`.
4. Fill in:

- name
- phone
- Telegram or Instagram
- city
- delivery method or address
- optional comment

5. Wait at least a few seconds before submitting, because the checkout has a minimum-time anti-spam check.
6. Click `Оставить заявку`.
7. Confirm the checkout success state appears.
8. Confirm the Telegram chat receives a message with order id, date/time, product details, and customer details.

## Update Products

Product content lives in JSON files:

```text
content/products/*.json
content/drops/*.json
```

`src/data/products.js` is now the typed loader/normalizer. Do not edit products there by hand.

Each product file supports:

- `id`
- `name`
- `slug`
- `dropId`
- `price.amount`
- `price.currency`
- `price.display`
- `status`: `available`, `sold_out`, or `hidden`
- `badges`: `1 of 1`, `new drop`, `last piece`, `sold out`
- `media.image`
- `media.imageAlt`
- `media.gallery`
- `description`
- `stock.quantity`
- `stock.label`
- `stock.unit`
- `details.emotionalDescription`
- `details.materials`
- `details.size`
- `details.care`
- `details.delivery`
- `display.windowTitle`
- `display.availableCtaLabel`
- `display.soldOutCtaLabel`
- `sortOrder`
- `archiveCaption`

### Add A Product In Decap CMS

1. Open `/admin/`.
2. Go to `Products` and create a new product.
3. Fill the required identity fields: `ID`, `Slug`, `Drop`, `Name`, `Short Description`, `Status`.
4. Fill price and stock fields.
5. Upload the main image. Decap saves uploaded product images to:

```text
assets/products
```

6. Fill emotional description, materials, size, care, and display fields.
7. Set `Sort Order` to control card order in the drop.
8. Save/publish the entry.

After publish, Decap creates or updates a file in `content/products`.

### Mark A Product Sold Out

In `/admin/`, open the product and set:

- `Status`: `sold_out`
- `Badges`: include `sold out`
- `Stock Quantity`: `0`
- `Stock Label`: `архив` or another user-facing sold-out label

Sold out products stay visible but cannot be ordered.

### Add A Product To The Current Drop

Set the product `Drop` field to the current drop id, for example:

```text
cosmic-drop-06
```

You can also open `Drops` in `/admin/` and add the product id to `Product IDs` for explicit ordering. If the product has the current `dropId`, the site can still show it even if it is not manually listed in `Product IDs`.

### Required Product Fields

Required in the CMS: `id`, `slug`, `dropId`, `name`, `description`, `status`, `price`, `stock`, `media.image`, `details.emotionalDescription`, `details.materials`, `details.size`, `details.care`, `display`, and `sortOrder`.

Optional fields have safe fallbacks: `media.imageAlt`, `media.gallery`, `details.delivery`, and `archiveCaption`. Missing optional fields should not break the homepage, product page, or checkout.

## Deployment

Deploy as a Node app, not static-only hosting, because order requests require the server-side API.

Use:

```bash
npm start
```

Required environment variables:

```bash
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
PORT
```

`TELEGRAM_CHAT_ID` may contain one id or several comma-separated ids.

The server serves static files, `/api/content/catalog`, and `/api/order-request` from the same origin.

For deployed Decap access, `/admin/` uses the GitHub backend configured in `admin/config.yml`:

```yaml
backend:
  name: github
  repo: tyurnev/cosmobeads
  branch: main
```

Make sure the deployment has GitHub/Decap authentication configured for the people who should edit products.

## Pre-Launch Checklist

- Final Instagram URL is set in `src/data/siteConfig.js`.
- Final Telegram URL is set in `src/data/siteConfig.js`.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in deployment env.
- `/admin/` opens and lists Products and Drops.
- Product JSON files are present in `content/products`.
- A real order request reaches Telegram.
- Sold out products cannot be ordered.
- Product images load on homepage, product pages, and checkout.
- Mobile checkout is readable and the CTA is easy to tap.
- No online payment wording promises payment on the site.
