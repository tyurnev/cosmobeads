import { homepageData } from "./data/homepageData.js";
import { BrandWorldSection } from "./components/BrandWorldSection.js";
import { DropSection } from "./components/DropSection.js";
import { FinalCTA } from "./components/FinalCTA.js";
import { HeroPortal } from "./components/HeroPortal.js";
import { SiteHeader } from "./components/SiteHeader.js";
import { SoldOutArchivePreview } from "./components/SoldOutArchivePreview.js";
import { TrustSection } from "./components/TrustSection.js";

export function HomePage() {
  return `
    ${SiteHeader(homepageData.header)}

    <main>
      ${HeroPortal({ hero: homepageData.hero })}
      ${DropSection({ products: homepageData.products })}
      ${BrandWorldSection({ brandWorld: homepageData.brandWorld })}
      ${SoldOutArchivePreview({ archive: homepageData.archive })}
      ${TrustSection({ items: homepageData.trust })}
      ${FinalCTA({ finalCta: homepageData.finalCta })}
    </main>

    <a class="mobile-sticky-cta" href="#drop">Смотреть дроп</a>
  `;
}
