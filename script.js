import { HomePage } from "./src/App.js";
import { CheckoutPage, bindCheckoutForm } from "./src/CheckoutPage.js";
import { bindSiteHeaderMenu } from "./src/components/SiteHeader.js";
import { ProductDetailPage, bindProductGallery } from "./src/ProductDetailPage.js";
import { getProductBySlug, loadProductBySlug, loadProductCatalog } from "./src/data/products.js";
import { selectProductForCheckout } from "./src/data/orderRequests.js";
import { loadSiteConfig, siteConfig } from "./src/data/siteConfig.js";

const appRoot = document.querySelector("#app");

function getProductRoute() {
  const [, routeName, slug] = window.location.pathname.split("/");

  if (routeName !== "product") {
    return null;
  }

  return { slug: slug ?? "" };
}

function getCheckoutRoute() {
  const [, routeName] = window.location.pathname.split("/");

  if (routeName !== "checkout") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  return { slug: params.get("product") ?? "" };
}

function bindBuyProductLinks(root = document) {
  root.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const buyLink = target?.closest("[data-buy-product]");

    if (!buyLink) {
      return;
    }

    const product = getProductBySlug(buyLink.dataset.buyProduct);

    if (product) {
      selectProductForCheckout(product);
    }
  });
}

function setDocumentMeta({ title = siteConfig.meta.defaultTitle, description = siteConfig.meta.defaultDescription } = {}) {
  document.title = title;

  const metaDescription = document.querySelector('meta[name="description"]');

  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }
}

async function renderApp() {
  await loadSiteConfig().catch((error) => {
    console.warn(error);
  });
  await loadProductCatalog();

  const productRoute = getProductRoute();
  const checkoutRoute = getCheckoutRoute();

  if (productRoute?.slug) {
    await loadProductBySlug(productRoute.slug).catch(() => {});
  }

  if (checkoutRoute?.slug) {
    await loadProductBySlug(checkoutRoute.slug).catch(() => {});
  }

  if (checkoutRoute) {
    const product = getProductBySlug(checkoutRoute.slug);

    setDocumentMeta({
      title: product ? `Заявка на ${product.name} - ${siteConfig.brandName}` : `Checkout - ${siteConfig.brandName}`,
    });
    appRoot.innerHTML = CheckoutPage({ slug: checkoutRoute.slug });
    bindCheckoutForm(appRoot);
  } else if (productRoute) {
    const product = getProductBySlug(productRoute.slug);

    setDocumentMeta({
      title: product ? `${product.name} - ${siteConfig.brandName}` : `Product not found - ${siteConfig.brandName}`,
      description: product?.description ?? siteConfig.meta.defaultDescription,
    });
    appRoot.innerHTML = ProductDetailPage({ slug: productRoute.slug });
    bindProductGallery(appRoot);
  } else {
    setDocumentMeta();
    appRoot.innerHTML = HomePage();
  }

  bindSiteHeaderMenu(appRoot);
  bindBuyProductLinks(appRoot);
}

if (appRoot) {
  renderApp().catch((error) => {
    console.error(error);
    setDocumentMeta();
    appRoot.innerHTML = `
      <main class="checkout-main">
        <section class="checkout-empty-state">
          <div class="window-card checkout-window">
            <div class="checkout-window-body">
              <p class="eyebrow">catalog error</p>
              <h1>Не получилось загрузить товары</h1>
              <p class="checkout-lead">Обнови страницу. Если ошибка повторится, напиши нам напрямую через контакты.</p>
            </div>
          </div>
        </section>
      </main>
    `;
  });
}
