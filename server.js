import { createReadStream, existsSync, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { products, PRODUCT_STATUSES } from "./src/data/products.js";
import { siteConfig } from "./src/data/siteConfig.js";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT ?? 5173);
const maxBodyBytes = 64 * 1024;
const minSubmitMs = 3000;
const maxSubmitMs = 1000 * 60 * 60 * 24;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

loadEnvFile();

function loadEnvFile() {
  const envPath = join(rootDir, ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function readJsonRequest(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (Buffer.byteLength(body) > maxBodyBytes) {
        reject(Object.assign(new Error("Request body is too large."), { statusCode: 413 }));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { statusCode: 400 }));
      }
    });

    request.on("error", reject);
  });
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function createOrderId() {
  return `cb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function findProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

function validateOrderRequest(payload) {
  const fields = {
    productSlug: normalizeText(payload.productSlug),
    name: normalizeText(payload.name),
    phone: normalizeText(payload.phone),
    social: normalizeText(payload.social),
    city: normalizeText(payload.city),
    delivery: normalizeText(payload.delivery),
    comment: normalizeText(payload.comment),
    honeypot: normalizeText(payload.website),
    formStartedAt: Number(payload.formStartedAt),
  };

  const missingFields = [
    ["productSlug", "изделие"],
    ["name", "имя"],
    ["phone", "телефон"],
    ["social", "Telegram or Instagram"],
    ["city", "город"],
    ["delivery", "доставка или адрес"],
  ].filter(([key]) => !fields[key]);

  if (missingFields.length) {
    return {
      ok: false,
      statusCode: 400,
      error: `Заполни обязательные поля: ${missingFields.map(([, label]) => label).join(", ")}.`,
    };
  }

  if (fields.honeypot) {
    return {
      ok: false,
      statusCode: 400,
      error: "Заявка не прошла антиспам-проверку.",
    };
  }

  if (!Number.isFinite(fields.formStartedAt)) {
    return {
      ok: false,
      statusCode: 400,
      error: "Не получилось проверить время заполнения формы. Обнови страницу и попробуй еще раз.",
    };
  }

  const submitAgeMs = Date.now() - fields.formStartedAt;

  if (submitAgeMs < minSubmitMs) {
    return {
      ok: false,
      statusCode: 400,
      error: "Проверь данные и отправь заявку через пару секунд.",
    };
  }

  if (submitAgeMs > maxSubmitMs) {
    return {
      ok: false,
      statusCode: 400,
      error: "Форма была открыта слишком давно. Обнови страницу и попробуй еще раз.",
    };
  }

  const product = findProductBySlug(fields.productSlug);

  if (!product) {
    return {
      ok: false,
      statusCode: 404,
      error: "Изделие не найдено.",
    };
  }

  if (product.status === PRODUCT_STATUSES.HIDDEN) {
    return {
      ok: false,
      statusCode: 404,
      error: "Это изделие сейчас недоступно для заявки.",
    };
  }

  if (product.status === PRODUCT_STATUSES.SOLD_OUT) {
    return {
      ok: false,
      statusCode: 409,
      error: "Это изделие уже sold out, покупку оформить нельзя.",
    };
  }

  if (product.status !== PRODUCT_STATUSES.AVAILABLE) {
    return {
      ok: false,
      statusCode: 409,
      error: "Это изделие сейчас недоступно для заявки.",
    };
  }

  return { ok: true, fields, product };
}

function createTelegramMessage({ orderId, createdAt, product, fields }) {
  const lines = [
    `Новая заявка ${siteConfig.brandName}`,
    `Номер: ${orderId}`,
    `Дата: ${createdAt}`,
    `Изделие: ${product.name}`,
    `Цена: ${product.price.display}`,
    `Slug: ${product.slug}`,
    "",
    "Покупатель",
    `Имя: ${fields.name}`,
    `Телефон: ${fields.phone}`,
    `Telegram/Instagram: ${fields.social}`,
    `Город: ${fields.city}`,
    `Доставка/адрес: ${fields.delivery}`,
    `Комментарий: ${fields.comment || "без комментария"}`,
  ];

  return lines.join("\n");
}

async function sendTelegramMessage(text) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw Object.assign(new Error("Telegram delivery is not configured."), { statusCode: 500 });
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const responseText = await telegramResponse.text();

  if (!telegramResponse.ok) {
    throw Object.assign(new Error("Telegram delivery failed."), {
      statusCode: 502,
      telegramStatus: telegramResponse.status,
      telegramResponse: responseText,
    });
  }
}

async function handleOrderRequest(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  try {
    const payload = await readJsonRequest(request);
    const validation = validateOrderRequest(payload);

    if (!validation.ok) {
      sendJson(response, validation.statusCode, { ok: false, error: validation.error });
      return;
    }

    const orderId = createOrderId();
    const createdAt = new Date().toISOString();
    const message = createTelegramMessage({
      orderId,
      createdAt,
      product: validation.product,
      fields: validation.fields,
    });

    await sendTelegramMessage(message);

    sendJson(response, 200, {
      ok: true,
      orderRequest: {
        id: orderId,
        createdAt,
        product: {
          slug: validation.product.slug,
          name: validation.product.name,
          price: validation.product.price.display,
        },
      },
    });
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    const publicError =
      statusCode === 500 || statusCode === 502
        ? `Не удалось отправить заявку. Попробуй еще раз или напиши нам напрямую: ${siteConfig.contacts.label}.`
        : error.message;

    if (statusCode >= 500) {
      console.error(error);
    }

    sendJson(response, statusCode, { ok: false, error: publicError });
  }
}

function getStaticFilePath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const safePath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = join(rootDir, safePath);

  if (!requestedPath.startsWith(rootDir)) {
    return join(rootDir, "index.html");
  }

  if (decodedPath.endsWith("/")) {
    return join(requestedPath, "index.html");
  }

  return requestedPath;
}

async function serveStaticFile(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let filePath = getStaticFilePath(url.pathname);

  try {
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    const extension = extname(filePath);

    response.writeHead(200, {
      "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
    });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === "/api/order-request") {
    await handleOrderRequest(request, response);
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    sendJson(response, 404, { ok: false, error: "API endpoint not found." });
    return;
  }

  await serveStaticFile(request, response);
});

server.listen(port, () => {
  console.log(`Cosmo Beads server running at http://127.0.0.1:${port}/`);
});
