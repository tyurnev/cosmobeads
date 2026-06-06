# Cosmo Beads

Cosmo Beads is a private MVP storefront for handmade Y2K bead pieces. The site includes the approved homepage, product pages, checkout, and a server-side order request endpoint that sends real requests to Telegram.

No online payments, database, or admin panel are included yet.

## Run Locally

Create an environment file:

```bash
cp .env.example .env
```

Fill in Telegram credentials:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
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
5. Keep `.env` private. Commit only `.env.example`.

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

Product content lives in:

```text
src/data/products.js
```

Each product record is content-first and ready to replace with real pieces:

- `name`
- `slug`
- `price`
- `status`: `available`, `sold_out`, or `hidden`
- `badges`: `1 of 1`, `new drop`, `last piece`, `sold out`
- `media.image`
- `media.gallery`
- `description`
- `details.materials`
- `details.size`
- `details.care`
- `details.delivery`

When adding a product to the current drop, also add its `id` to the current drop `productIds` list in the same file.

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

The server serves static files and `/api/order-request` from the same origin.

## Pre-Launch Checklist

- Final Instagram URL is set in `src/data/siteConfig.js`.
- Final Telegram URL is set in `src/data/siteConfig.js`.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set in deployment env.
- A real order request reaches Telegram.
- Sold out products cannot be ordered.
- Product images load on homepage, product pages, and checkout.
- Mobile checkout is readable and the CTA is easy to tap.
- No online payment wording promises payment on the site.
