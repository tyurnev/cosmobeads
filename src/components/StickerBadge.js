import { classNames } from "./html.js";

export function StickerBadge({ label, tone = "", className = "badge" }) {
  return `<span class="${classNames(className, tone)}">${label}</span>`;
}
