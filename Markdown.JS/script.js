function convertMarkdown() {
  let text = document.querySelector("#markdown-input").value;

  // Blockquotes (FIRST)
  text = text.replace(/^>\s(.+)$/gm, "<blockquote>$1</blockquote>");

  // Headings
  text = text.replace(/^###\s(.+)$/gm, "<h3>$1</h3>");
  text = text.replace(/^##\s(.+)$/gm, "<h2>$1</h2>");
  text = text.replace(/^#\s(.+)$/gm, "<h1>$1</h1>");

  // Image
  text = text.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');

  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");

  return text;
}

// INPUT EVENT (IMPORTANT)
document.querySelector("#markdown-input").addEventListener("input", () => {
  const html = convertMarkdown();

  // Raw HTML
  document.querySelector("#html-output").textContent = html;

  // Rendered HTML (SET, not append)
  document.querySelector("#preview").innerHTML = html;
});

// Live typing event
document
  .querySelector("#markdown-input")
  .addEventListener("input", convertMarkdown);
