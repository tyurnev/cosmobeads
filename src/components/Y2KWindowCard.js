import { ariaHiddenAttribute, classNames } from "./html.js";

export function Y2KWindowCard({
  title,
  children,
  tag = "article",
  className = "",
  barClassName = "window-bar",
  ariaHidden = false,
}) {
  const hidden = ariaHiddenAttribute(ariaHidden);

  return `
    <${tag} class="${classNames(className)}"${hidden}>
      <div class="${barClassName}">
        <span>${title}</span>
        <i aria-hidden="true"></i>
      </div>
      ${children}
    </${tag}>
  `;
}
