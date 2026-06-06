# Cosmo Beads MVP Launch Checklist

## Homepage Mobile Check

- Open the homepage on a narrow mobile viewport.
- Confirm the approved Y2K portal design still matches the reference.
- Confirm product cards render without overlap.
- Confirm header menu opens and closes.
- Confirm current drop buttons are visible and tappable.

## Product Page Check

- Open each `/product/<slug>/` page.
- Confirm product image/gallery loads.
- Confirm name, price, stock status, badge, description, materials, size, care, and delivery are visible.
- Confirm `Купить` appears only for available products.
- Confirm a newly added CMS product opens at `/product/<slug>/` after refresh.

## Django Admin Check

- Open `/cosmo-admin/`.
- Confirm Django login/password is required.
- Confirm `Products`, `Drops`, `Order requests`, and `Site settings` are visible.
- Confirm product images upload to `/media/`.
- Confirm a product saved in Django appears through `/api/products/`.
- Confirm setting one drop to `current` makes it appear on the homepage.
- Confirm missing optional fields use fallback text instead of breaking the page.

## Checkout Check

- Click `Купить` from homepage and product page.
- Confirm checkout opens with the selected product.
- Fill all required fields.
- Confirm the loading state appears after submit.
- Confirm duplicate taps do not create duplicate visible submissions.
- Confirm success copy explains what happens next.
- Confirm API error copy is clear and retry is possible.

## Telegram Notification Check

- Confirm `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set.
- Submit a real test order request.
- Confirm Telegram receives order id, created date/time, product name, product price, product slug, customer name, phone, Telegram/Instagram, city, delivery/address, and comment.
- Confirm the same order appears in Django admin.

## Sold Out Product Check

- Open a sold out product page.
- Confirm buy buttons are disabled or replaced by waitlist/contact CTA.
- Try `/checkout/?product=<sold-out-slug>`.
- Confirm checkout does not allow an order request for sold out products.

## Broken Image Check

- Open homepage, product pages, checkout, and archive.
- Confirm no broken image icons appear.
- Confirm direct product route refresh still loads images.

## Real Contact Links Check

- Confirm Instagram and Telegram URLs in `src/data/siteConfig.js` are final.
- Click header/social/contact links.
- Confirm they open the intended Telegram or Instagram destination.

## Mobile Sticky CTA Check

- Open an available product page on mobile.
- Confirm sticky mobile buy CTA is visible and tappable.
- Confirm it opens checkout for the correct product.
- Open a sold out product page on mobile.
- Confirm sticky state does not allow purchase.
