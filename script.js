import { HomePage } from "./src/App.js";
import { bindSiteHeaderMenu } from "./src/components/SiteHeader.js";

const appRoot = document.querySelector("#app");

if (appRoot) {
  appRoot.innerHTML = HomePage();
  bindSiteHeaderMenu(appRoot);
}
