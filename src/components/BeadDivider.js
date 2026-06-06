import { classNames } from "./html.js";

export function BeadDivider({ variant = "", className = "bead-string" } = {}) {
  return `<div class="${classNames(className, variant)}" aria-hidden="true"></div>`;
}
