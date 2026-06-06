# Cosmo Beads

Cosmo Beads is a private MVP storefront for handmade Y2K bead pieces. The approved frontend visual world stays in the existing HTML/CSS/JS app, while Django now provides the login/password admin, product catalog API, media uploads, and order request pipeline.

No online payments are included yet. The previous Node server remains in the repository as a fallback while the Django pipeline is verified, but Django is the new backend source of truth.

## Local Setup

Install Python dependencies:

```bash
python3 -m pip install -r requirements.txt
```

Create local env:

```bash
cp .env.example .env
```

Fill Telegram credentials when testing real order delivery:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=5384335200,1948372223
DJANGO_SECRET_KEY=change_me
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost,cosmobeads.onrender.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://cosmobeads.onrender.com
```

Run migrations:

```bash
python3 backend/manage.py migrate
```

Import the existing sample products and current drop:

```bash
python3 backend/manage.py import_static_products
```

Run Django locally:

```bash
python3 backend/manage.py runserver 127.0.0.1:8000
```

Open the site:

```text
http://127.0.0.1:8000/
```

## Django Admin

Create a staff/superuser account:

```bash
python3 backend/manage.py createsuperuser
```

Open:

```text
http://127.0.0.1:8000/cosmo-admin/
```

Only Django staff users can access `/cosmo-admin/`. The old Decap `/admin/` interface is no longer required.

## Products

Products are edited in Django admin:

```text
/cosmo-admin/catalog/product/
```

To add a product:

1. Open `Products` in Django admin.
2. Fill `Basic`: id, slug, drop, name, description, status, badges.
3. Fill `Price and stock`: amount, currency, display price, quantity, stock label, unit.
4. Upload `main_image` and add alt text.
5. Fill `Product details`: emotional description, materials, size, care, delivery.
6. Fill `Display`: window title, CTA labels, sort order.
7. Add extra gallery images in the inline `ProductImage` rows.

Product statuses:

- `available`: can be ordered.
- `sold_out`: visible but blocked from checkout.
- `hidden`: hidden from frontend API and cannot be ordered.

Badges are stored as a JSON list, for example:

```json
["1 of 1", "new drop"]
```

Materials and care are also JSON lists.

## Drops

Drops are edited in:

```text
/cosmo-admin/catalog/drop/
```

To create a current drop:

1. Create or open a drop.
2. Set `status` to `current`.
3. Set `release_label`.
4. Add products through the `Products` selector or set each product's `drop` field.
5. Use product `sort_order` to control homepage order.

Keep only one drop marked `current` for predictable homepage behavior.

## Site Settings

Brand name, social links, meta copy, delivery text, and order success copy are editable in:

```text
/cosmo-admin/site_settings/sitesettings/
```

The frontend loads them from:

```text
GET /api/site-config/
```

## API

Django JSON endpoints:

```text
GET  /api/site-config/
GET  /api/drops/current/
GET  /api/products/
GET  /api/products/<slug>/
POST /api/order-request/
```

The product API returns the same frontend-friendly shape used by the existing UI components: `price`, `stock`, `media`, `details`, `display`, `badges`, and `sortOrder`.

## Order Requests

Checkout still has no registration and no online payment.

`POST /api/order-request/` validates:

- product slug
- name
- phone
- Telegram or Instagram
- city
- delivery/address
- honeypot anti-spam field
- minimum form submission time

If the product is missing, hidden, or sold out, Django returns a clear error and does not create a valid purchasable order.

If the product is available, Django creates an `OrderRequest`, sends Telegram notification with `TELEGRAM_BOT_TOKEN` and comma-separated `TELEGRAM_CHAT_ID`, then stores `telegram_sent_at` or `telegram_error`.

Orders are visible in:

```text
/cosmo-admin/orders/orderrequest/
```

## Test A Full Order Request

1. Set real `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env`.
2. Make sure the bot has received `/start` from each owner or is added to the target chat.
3. Run:

```bash
python3 backend/manage.py runserver 127.0.0.1:8000
```

4. Open an available product page:

```text
http://127.0.0.1:8000/product/star-soda-necklace/
```

5. Click `Купить`.
6. Fill the checkout form.
7. Wait at least a few seconds before submitting.
8. Click `Оставить заявку`.
9. Confirm checkout success state appears.
10. Confirm Telegram receives the order message.
11. Confirm the order appears in Django admin.

## Deployment

Deploy as a Python/Django service.

Recommended build command:

```bash
python3 -m pip install -r requirements.txt && python3 backend/manage.py collectstatic --noinput
```

Recommended start command:

```bash
cd backend && python manage.py migrate --noinput && gunicorn cosmobeads_backend.wsgi:application
```

Required environment variables:

```bash
DJANGO_SECRET_KEY
DJANGO_ALLOWED_HOSTS=cosmobeads.onrender.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://cosmobeads.onrender.com
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

For first deployment, run once:

```bash
python3 backend/manage.py createsuperuser
python3 backend/manage.py import_static_products
```

SQLite is used for local MVP development. For production on Render, attach persistent storage for `backend/db.sqlite3` and `backend/media/`, or migrate to a managed database later.

## Legacy Node Server

The Node server is still present:

```bash
npm run dev
```

It can serve the old static fallback and compatible API routes while Django is being tested. The Django admin and database-backed catalog require running Django.

## Pre-Launch Checklist

- `/cosmo-admin/` opens and requires Django login.
- A superuser/staff account exists.
- Products and drops are imported or created in Django.
- Exactly one drop is marked `current`.
- Homepage loads products from Django.
- Product pages load by slug from Django.
- Product images load from `/media/`.
- Checkout opens for available products.
- Sold out products cannot be ordered.
- A real order request reaches Telegram.
- The order appears in Django admin.
- `.env` is not committed.
