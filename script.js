import { HomePage } from "./src/App.js";
import { CheckoutPage, bindCheckoutForm } from "./src/CheckoutPage.js";
import { bindSiteHeaderMenu } from "./src/components/SiteHeader.js";
import { ProductDetailPage, bindProductGallery } from "./src/ProductDetailPage.js";
import { getProductBySlug } from "./src/data/products.js";
import { selectProductForCheckout } from "./src/data/orderRequests.js";

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

if (appRoot) {
  const productRoute = getProductRoute();
  const checkoutRoute = getCheckoutRoute();

  if (checkoutRoute) {
    const product = getProductBySlug(checkoutRoute.slug);

    document.title = product ? `Заявка на ${product.name} - Cosmo Beads` : "Checkout - Cosmo Beads";
    appRoot.innerHTML = CheckoutPage({ slug: checkoutRoute.slug });
    bindCheckoutForm(appRoot);
  } else if (productRoute) {
    const product = getProductBySlug(productRoute.slug);

    document.title = product ? `${product.name} - Cosmo Beads` : "Product not found - Cosmo Beads";
    appRoot.innerHTML = ProductDetailPage({ slug: productRoute.slug });
    bindProductGallery(appRoot);
  } else {
    document.title = "Cosmo Beads - handmade Y2K bead pieces";
    appRoot.innerHTML = HomePage();
  }

  bindSiteHeaderMenu(appRoot);
  bindBuyProductLinks(appRoot);
}
