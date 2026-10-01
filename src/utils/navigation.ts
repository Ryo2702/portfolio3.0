export function requestHorizontalSection(id: string) {
  window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: id }));
}
