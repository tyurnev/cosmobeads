export function TrustCard({ number, title, text }) {
  return `
    <article>
      <span aria-hidden="true">${number}</span>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `;
}
