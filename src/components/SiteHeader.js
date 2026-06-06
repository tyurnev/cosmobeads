const renderNavLinks = (items) =>
  items.map((item) => `<a href="${item.href}">${item.label}</a>`).join("");

export function SiteHeader({ leftNav, rightNav, mobileNav, social, homeHref = "#" }) {
  return `
    <header class="site-header" aria-label="Cosmo Beads navigation">
      <button class="icon-button menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="desktop-nav nav-left" aria-label="Основная навигация">
        ${renderNavLinks(leftNav)}
      </nav>

      <a class="brand-logo" href="${homeHref}" aria-label="Cosmo Beads home">
        <img src="/assets/logo_big.png" alt="Cosmo Beads" />
      </a>

      <nav class="desktop-nav nav-right" aria-label="Дополнительная навигация">
        ${renderNavLinks(rightNav)}
      </nav>

      <div class="header-actions">
        <a class="social-link" href="${social.href}" aria-label="Instagram или Telegram">${social.label}</a>
        <button class="icon-button cart-button" type="button" aria-label="Корзина">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M7.5 8.2h9l-.7 10.3a2 2 0 0 1-2 1.8H10a2 2 0 0 1-2-1.8L7.5 8.2Z" />
            <path d="M9.3 8.2a3.2 3.2 0 0 1 6.4 0" />
          </svg>
          <span>0</span>
        </button>
      </div>

      <nav class="mobile-nav" aria-label="Мобильная навигация">
        ${renderNavLinks(mobileNav)}
      </nav>
    </header>
  `;
}

export function bindSiteHeaderMenu(root = document) {
  const header = root.querySelector(".site-header");
  const menuToggle = root.querySelector(".menu-toggle");

  if (!header || !menuToggle) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  header.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}
