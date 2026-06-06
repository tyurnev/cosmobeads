export function classNames(...values) {
  return values
    .flat()
    .filter(Boolean)
    .join(" ");
}

export function ariaHiddenAttribute(isHidden) {
  return isHidden ? ' aria-hidden="true"' : "";
}
