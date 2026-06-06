import { homepageData } from "./data/homepageData.js";
import { contactLinks, getProductBadge, getProductStock } from "./data/productDisplay.js";
import { getProductBySlug, PRODUCT_STATUSES } from "./data/products.js";
import {
  createOrderRequest,
  getSelectedCheckoutProductSlug,
  saveOrderRequest,
  sendTelegramNotification,
} from "./data/orderRequests.js";
import { SiteHeader } from "./components/SiteHeader.js";
import { StickerBadge } from "./components/StickerBadge.js";
import { Y2KWindowCard } from "./components/Y2KWindowCard.js";
import { classNames } from "./components/html.js";

const homeSectionLink = (item) => ({
  ...item,
  href: item.href.startsWith("#") ? `/${item.href}` : item.href,
});

const checkoutHeaderData = {
  ...homepageData.header,
  homeHref: "/",
  leftNav: homepageData.header.leftNav.map(homeSectionLink),
  rightNav: homepageData.header.rightNav.map(homeSectionLink),
  mobileNav: homepageData.header.mobileNav.map(homeSectionLink),
};

function getCheckoutProduct(slug) {
  return getProductBySlug(slug || getSelectedCheckoutProductSlug());
}

function CheckoutEmptyState() {
  return `
    ${SiteHeader(checkoutHeaderData)}
    <main class="checkout-main">
      <section class="checkout-empty-state" aria-labelledby="checkout-empty-title">
        ${Y2KWindowCard({
          title: "empty-cart.exe",
          tag: "article",
          className: "checkout-window",
          children: `
            <div class="checkout-window-body">
              <p class="eyebrow">checkout folder</p>
              <h1 id="checkout-empty-title">Товар не выбран</h1>
              <p class="checkout-lead">Вернись в дроп и нажми “Купить” на украшении, которое хочется забронировать.</p>
              <a class="button primary checkout-submit" href="/#drop">Смотреть дроп</a>
            </div>
          `,
        })}
      </section>
    </main>
  `;
}

function CheckoutSummary({ product }) {
  const badge = getProductBadge(product);
  const stock = getProductStock(product);
  const isSoldOut = product.status === PRODUCT_STATUSES.SOLD_OUT;

  return Y2KWindowCard({
    title: "selected-piece.jpg",
    tag: "aside",
    className: "checkout-summary-window",
    children: `
      <div class="checkout-summary">
        <div class="checkout-product-image">
          <img src="${product.media.image}" alt="${product.media.imageAlt}" />
        </div>
        <div class="checkout-product-copy">
          <div class="product-detail-meta-row checkout-meta-row">
            ${StickerBadge(badge)}
            <span class="${classNames("stock", stock.tone)}">${isSoldOut ? "Sold out" : stock.label}</span>
          </div>
          <h2>${product.name}</h2>
          <p class="checkout-price">${product.price.display}</p>
          <p>${product.description}</p>
        </div>
        <div class="checkout-contact-note">
          <span>no online payment yet</span>
          <p>После заявки мы подтвердим наличие, доставку и оплату вручную в Telegram или Instagram.</p>
        </div>
      </div>
    `,
  });
}

function CheckoutSoldOut({ product }) {
  return `
    ${SiteHeader(checkoutHeaderData)}
    <main class="checkout-main">
      <div class="portal-strip checkout-portal-strip" aria-hidden="true">
        <span>request portal</span>
        <span>${product.display.windowTitle}</span>
        <span>sold out</span>
      </div>

      <section class="checkout-layout" aria-labelledby="checkout-sold-title">
        ${Y2KWindowCard({
          title: "sold-out-request.exe",
          tag: "article",
          className: "checkout-window",
          children: `
            <div class="checkout-window-body">
              <p class="eyebrow">archive piece</p>
              <h1 id="checkout-sold-title">Это изделие уже sold out</h1>
              <p class="checkout-lead">Покупку оформить нельзя, но можно написать нам и попросить похожую версию в новом мини-дропе.</p>
              <a class="button primary checkout-submit" href="${contactLinks.telegram}">Сообщить о похожем</a>
            </div>
          `,
        })}
        ${CheckoutSummary({ product })}
      </section>
    </main>
  `;
}

function CheckoutForm({ product }) {
  return Y2KWindowCard({
    title: "order-request.exe",
    tag: "section",
    className: "checkout-window",
    children: `
      <div class="checkout-window-body">
        <p class="eyebrow">order request</p>
        <h1 id="checkout-title">Оставить заявку</h1>
        <p class="checkout-lead">Без регистрации и онлайн-оплаты. Заполни контакты, а мы подтвердим заказ вручную.</p>

        <form class="checkout-form" data-checkout-form data-product-slug="${product.slug}">
          <label>
            <span>Имя</span>
            <input name="name" type="text" autocomplete="name" required />
          </label>

          <label>
            <span>Телефон</span>
            <input name="phone" type="tel" autocomplete="tel" required />
          </label>

          <label>
            <span>Telegram или Instagram</span>
            <input name="social" type="text" autocomplete="off" placeholder="@username" required />
          </label>

          <label>
            <span>Город</span>
            <input name="city" type="text" autocomplete="address-level2" required />
          </label>

          <label class="checkout-wide-field">
            <span>Способ доставки или адрес</span>
            <textarea name="delivery" rows="3" placeholder="СДЭК до пункта, Почта России или адрес курьера" required></textarea>
          </label>

          <label class="checkout-wide-field">
            <span>Комментарий</span>
            <textarea name="comment" rows="3" placeholder="Размер, срочность, вопрос по упаковке"></textarea>
          </label>

          <button class="button primary checkout-submit" type="submit">Оставить заявку</button>
          <p class="checkout-fine-print">Заявка сохранится локально/mock. Telegram-уведомление уже подготовлено в коде, но пока не отправляется.</p>
        </form>

        <div class="checkout-result" data-checkout-result aria-live="polite"></div>
      </div>
    `,
  });
}

export function CheckoutPage({ slug = "" } = {}) {
  const product = getCheckoutProduct(slug);

  if (!product) {
    return CheckoutEmptyState();
  }

  if (product.status === PRODUCT_STATUSES.SOLD_OUT) {
    return CheckoutSoldOut({ product });
  }

  return `
    ${SiteHeader(checkoutHeaderData)}

    <main class="checkout-main">
      <div class="portal-strip checkout-portal-strip" aria-hidden="true">
        <span>checkout folder</span>
        <span>${product.display.windowTitle}</span>
        <span>request only</span>
      </div>

      <section class="checkout-layout" aria-labelledby="checkout-title">
        ${CheckoutForm({ product })}
        ${CheckoutSummary({ product })}
      </section>
    </main>
  `;
}

function getFormFields(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    social: String(formData.get("social") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    delivery: String(formData.get("delivery") ?? "").trim(),
    comment: String(formData.get("comment") ?? "").trim(),
  };
}

export function bindCheckoutForm(root = document) {
  const form = root.querySelector("[data-checkout-form]");
  const result = root.querySelector("[data-checkout-result]");

  if (!form || !result) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const product = getProductBySlug(form.dataset.productSlug);
    const submitButton = form.querySelector("button[type='submit']");

    if (!product || product.status === PRODUCT_STATUSES.SOLD_OUT) {
      result.innerHTML = `<div class="checkout-result-card error">Не получилось найти доступное изделие для заявки.</div>`;
      return;
    }

    const orderRequest = createOrderRequest({
      product,
      fields: getFormFields(form),
    });
    const isSaved = saveOrderRequest(orderRequest);

    await sendTelegramNotification(orderRequest);

    form.classList.add("is-submitted");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Заявка сохранена";
    }

    result.innerHTML = `
      <div class="checkout-result-card">
        <p class="eyebrow">saved locally</p>
        <h2>Заявка принята</h2>
        <p>Номер заявки: <strong>${orderRequest.id}</strong></p>
        <p>${isSaved ? "Мы сохранили ее локально/mock." : "Локальное сохранение недоступно в этом окружении."} Следующий шаг в коде уже подготовлен: подключить отправку этого текста в Telegram.</p>
      </div>
    `;
  });
}
