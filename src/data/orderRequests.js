// @ts-check

export const CHECKOUT_SELECTION_STORAGE_KEY = "cosmobeads.checkoutSelection";
export const ORDER_REQUESTS_STORAGE_KEY = "cosmobeads.orderRequests";
export const ORDER_REQUEST_ENDPOINT = "/api/order-request";

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson(key, fallback) {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const rawValue = storage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  storage.setItem(key, JSON.stringify(value));
  return true;
}

export function selectProductForCheckout(product) {
  return writeJson(CHECKOUT_SELECTION_STORAGE_KEY, {
    productId: product.id,
    slug: product.slug,
    selectedAt: new Date().toISOString(),
  });
}

export function getSelectedCheckoutProductSlug() {
  const selectedProduct = readJson(CHECKOUT_SELECTION_STORAGE_KEY, null);
  return selectedProduct?.slug ?? "";
}

export function getOrderRequests() {
  const orderRequests = readJson(ORDER_REQUESTS_STORAGE_KEY, []);
  return Array.isArray(orderRequests) ? orderRequests : [];
}

function createOrderId() {
  return `cb-${Date.now().toString(36)}`;
}

export function createOrderRequest({ product, fields, id = createOrderId(), source = "local_debug", status = "debug" }) {
  const orderRequest = {
    id,
    status,
    source,
    createdAt: new Date().toISOString(),
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.media.image,
    },
    customer: {
      name: fields.name,
      phone: fields.phone,
      social: fields.social,
      city: fields.city,
      delivery: fields.delivery,
      comment: fields.comment,
    },
  };

  return {
    ...orderRequest,
    telegramNotification: prepareTelegramNotificationPayload(orderRequest),
  };
}

export async function submitOrderRequest({ productSlug, fields, antiSpam }) {
  const response = await fetch(ORDER_REQUEST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productSlug,
      name: fields.name,
      phone: fields.phone,
      social: fields.social,
      city: fields.city,
      delivery: fields.delivery,
      comment: fields.comment,
      website: antiSpam.website,
      formStartedAt: antiSpam.formStartedAt,
    }),
  });

  const payload = await response.json().catch(() => ({
    ok: false,
    error: "Server returned an unreadable response.",
  }));

  if (!response.ok || !payload.ok) {
    throw Object.assign(new Error(payload.error || "Order request could not be sent."), {
      statusCode: response.status,
      payload,
    });
  }

  return payload.orderRequest;
}

export function saveOrderRequest(orderRequest) {
  const orderRequests = getOrderRequests();
  orderRequests.unshift(orderRequest);

  return writeJson(ORDER_REQUESTS_STORAGE_KEY, orderRequests);
}

export function prepareTelegramNotificationPayload(orderRequest) {
  const lines = [
    "Новая заявка Cosmo Beads",
    `Номер: ${orderRequest.id}`,
    `Дата: ${orderRequest.createdAt}`,
    `Изделие: ${orderRequest.product.name}`,
    `Цена: ${orderRequest.product.price.display}`,
    `Slug: ${orderRequest.product.slug}`,
    "",
    "Покупатель",
    `Имя: ${orderRequest.customer.name}`,
    `Телефон: ${orderRequest.customer.phone}`,
    `Telegram/Instagram: ${orderRequest.customer.social}`,
    `Город: ${orderRequest.customer.city}`,
    `Доставка/адрес: ${orderRequest.customer.delivery}`,
  ];

  if (orderRequest.customer.comment) {
    lines.push(`Комментарий: ${orderRequest.customer.comment}`);
  }

  return {
    channel: "telegram",
    ready: false,
    text: lines.join("\n"),
  };
}
