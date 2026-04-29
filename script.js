// ============================================================
//  ORIGINAL FUNCTIONS (unchanged logic)
// ============================================================
const rawCatalogCards = [
  "From a Buick 8 | King, Stephen | 2002 | Shelf K7",
  "The Shining | King, Stephen | 1977 | Shelf K1",
  "The Stand | King, Stephen | 1978 | Shelf K2",
  "It | King, Stephen | 1986 | Shelf K3",
  "Misery | King, Stephen | 1987 | Shelf K4",
  "Do Androids Dream of Electric Sheep? | Dick, Philip K. | 1968 | Shelf D5",
  "I, Robot | Asimov, Isaac | 1950 | Shelf A8",
  "Foundation | Asimov, Isaac | 1951 | Shelf A9",
  "Dune | Herbert, Frank | 1965 | Shelf H3",
  "Neuromancer | Gibson, William | 1984 | Shelf G8",
  "Snow Crash | Stephenson, Neal | 1992 | Shelf S6",
  "The Martian | Weir, Andy | 2011 | Shelf W5",
  "Ender's Game | Card, Orson Scott | 1985 | Shelf C2",
  "The Hitchhiker's Guide to the Galaxy | Adams, Douglas | 1979 | Shelf A1",
  "Ready Player One | Cline, Ernest | 2011 | Shelf C7",
  "The Dark Tower: The Gunslinger | King, Stephen | 1982 | Shelf K5",
  "Unknown Title |  | 1975 | Shelf X1",
  "Mysterious Manuscript | Unknown Author |  | Shelf Z9",
  "Ancient Scroll | Anonymous | 850 | ",
];

function parseCard(rawString) {
  const parts = rawString.split("|");
  const trimmedParts = [];
  for (let i = 0; i < parts.length; i++) {
    trimmedParts.push(parts[i].trim());
  }
  return {
    title: trimmedParts[0] || "Unknown",
    author: trimmedParts[1] || "Unknown",
    year: trimmedParts[2] ? parseInt(trimmedParts[2]) : "Unknown",
    location: trimmedParts[3] || "Unknown",
  };
}

function parseCatalog(rawCards) {
  const catalog = [];
  for (let i = 0; i < rawCards.length; i++) {
    catalog.push(parseCard(rawCards[i]));
  }
  return catalog;
}

const catalog = parseCatalog(rawCatalogCards);

function findByAuthor(catalog, author) {
  const searchTerm = author.toLowerCase();
  const results = [];
  for (let i = 0; i < catalog.length; i++) {
    if (catalog[i].author.toLowerCase().includes(searchTerm)) {
      results.push(catalog[i]);
    }
  }
  return results;
}

function groupByDecade(catalog) {
  const grouped = {};
  for (let i = 0; i < catalog.length; i++) {
    const book = catalog[i];
    if (book.year === "Unknown") {
      if (!grouped["Unknown"]) {
        grouped["Unknown"] = [];
      }
      grouped["Unknown"].push(book);
      continue;
    }
    const decade = Math.floor(book.year / 10) * 10;
    const decadeKey = `${decade}s`;
    if (!grouped[decadeKey]) {
      grouped[decadeKey] = [];
    }
    grouped[decadeKey].push(book);
  }
  return grouped;
}

const byDecade = groupByDecade(catalog);

function validateEntry(entry) {
  let isValid = true;
  if (!("title" in entry) || !entry.title || entry.title === "Unknown")
    isValid = false;
  if (!("author" in entry) || !entry.author || entry.author === "Unknown")
    isValid = false;
  if (!("year" in entry) || !entry.year || entry.year === "Unknown")
    isValid = false;
  if (!("location" in entry) || !entry.location || entry.location === "Unknown")
    isValid = false;
  return isValid;
}

function exportToJSON(catalog) {
  return JSON.stringify(catalog, null, 2);
}

function exportToCSV(catalog) {
  const header = "Title,Author,Year,Location";
  const rows = [];
  for (let i = 0; i < catalog.length; i++) {
    const e = catalog[i];
    rows.push(`"${e.title}","${e.author}",${e.year},"${e.location}"`);
  }
  let csv = header;
  for (let i = 0; i < rows.length; i++) {
    csv = csv + "\n" + rows[i];
  }
  return csv;
}

// ============================================================
//  COMPUTED VALUES
// ============================================================
let oldestYear = Infinity,
  newestYear = 0;
for (let i = 0; i < catalog.length; i++) {
  const e = catalog[i];
  if (e.year !== "Unknown") {
    if (e.year < oldestYear) oldestYear = e.year;
    if (e.year > newestYear) newestYear = e.year;
  }
}
const validCount = catalog.filter((e) => validateEntry(e)).length;
const invalidCount = catalog.length - validCount;

// ============================================================
//  HELPERS
// ============================================================
function getDecadeKey(year) {
  return year === "Unknown" ? "Unknown" : `${Math.floor(year / 10) * 10}s`;
}

function missingFields(entry) {
  const f = [];
  if (!entry.title || entry.title === "Unknown") f.push("title");
  if (!entry.author || entry.author === "Unknown") f.push("author");
  if (!entry.year || entry.year === "Unknown") f.push("year");
  if (!entry.location || entry.location === "Unknown") f.push("location");
  return f;
}

function bookCardHTML(entry, delay) {
  const valid = validateEntry(entry);
  const dk = getDecadeKey(entry.year);
  const miss = missingFields(entry);
  return `<div class="book-card${valid ? "" : " invalid"}" style="animation-delay:${delay}ms">
    <div class="book-shelf">${entry.location}</div>
    <div class="book-title">${entry.title}</div>
    <div class="book-author">${entry.author}</div>
    <div class="book-meta">
      <span class="meta-tag tag-year">${entry.year}</span>
      ${dk !== "Unknown" ? `<span class="meta-tag tag-decade">${dk}</span>` : ""}
      ${!valid ? `<span class="meta-tag tag-invalid">missing: ${miss.join(", ")}</span>` : ""}
    </div>
  </div>`;
}

// ============================================================
//  TAB SWITCHING
// ============================================================
function switchTab(name, btn) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-tab")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById("panel-" + name).classList.add("active");
  btn.classList.add("active");
}

// ============================================================
//  CATALOG PANEL
// ============================================================
function filterCatalog() {
  const q = document.getElementById("catalog-search").value.toLowerCase();
  const f = document.getElementById("catalog-filter").value;
  let books = catalog;
  if (f === "valid") books = books.filter((b) => validateEntry(b));
  if (f === "invalid") books = books.filter((b) => !validateEntry(b));
  if (q)
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q),
    );
  document.getElementById("catalog-label").textContent =
    `${books.length} of ${catalog.length} entries`;
  document.getElementById("catalog-count").textContent =
    `${books.length} result${books.length !== 1 ? "s" : ""}`;
  const grid = document.getElementById("book-grid");
  grid.innerHTML =
    books.length === 0
      ? `<div class="no-results"><strong>No results found.</strong>Try a different search term.</div>`
      : books.map((b, i) => bookCardHTML(b, i * 30)).join("");
}

// ============================================================
//  DECADES PANEL
// ============================================================
function renderDecades() {
  const keys = Object.keys(byDecade).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return parseInt(a) - parseInt(b);
  });
  document.getElementById("decades-container").innerHTML = keys
    .map(
      (dk) => `
    <div class="decade-section">
      <div class="decade-header">
        <span class="decade-title">${dk}</span>
        <span class="decade-count">${byDecade[dk].length} book${byDecade[dk].length !== 1 ? "s" : ""}</span>
      </div>
      <div class="decade-books">
        ${byDecade[dk]
          .map(
            (b, i) => `
          <div class="decade-row" style="animation-delay:${i * 25}ms">
            <div class="decade-row-title">${b.title}</div>
            <div class="decade-row-author">${b.author}</div>
            <div class="decade-row-year">${b.year}</div>
            <div class="decade-row-shelf">${b.location}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>`,
    )
    .join("");
}

// ============================================================
//  SEARCH PANEL
// ============================================================
function searchAuthor() {
  const q = document.getElementById("author-input").value.trim();
  const grid = document.getElementById("author-results");
  const countEl = document.getElementById("author-result-count");
  if (!q) {
    grid.innerHTML = "";
    countEl.classList.remove("show");
    return;
  }
  const results = findByAuthor(catalog, q);
  countEl.textContent = `findByAuthor(catalog, "${q}") → ${results.length} result${results.length !== 1 ? "s" : ""}`;
  countEl.classList.add("show");
  grid.innerHTML =
    results.length === 0
      ? `<div class="no-results"><strong>No author found.</strong>Try "King", "Asimov" or "Dick".</div>`
      : results.map((b, i) => bookCardHTML(b, i * 40)).join("");
}

// ============================================================
//  VALIDATE PANEL
// ============================================================
function renderValidate() {
  const valid = catalog.filter((e) => validateEntry(e));
  const invalid = catalog.filter((e) => !validateEntry(e));
  document.getElementById("validate-grid").innerHTML = `
    <div class="validate-card">
      <div class="validate-head valid-head">Valid entries (${valid.length})</div>
      <div class="validate-list">
        ${valid
          .map(
            (b) => `<div class="val-item">
          <span class="val-item-title">${b.title}</span>
          <span style="font-size:.78rem;color:var(--muted);font-style:italic">${b.author} · ${b.year}</span>
        </div>`,
          )
          .join("")}
      </div>
    </div>
    <div class="validate-card">
      <div class="validate-head invalid-head">Incomplete entries (${invalid.length})</div>
      <div class="validate-list">
        ${invalid
          .map(
            (b) => `<div class="val-item">
          <span class="val-item-title">${b.title}</span>
          <span class="val-item-reason">missing: ${missingFields(b).join(", ")}</span>
        </div>`,
          )
          .join("")}
      </div>
    </div>`;
}

// ============================================================
//  EXPORT PANEL
// ============================================================
let currentExport = "json";
function switchExport(fmt, btn) {
  currentExport = fmt;
  document
    .querySelectorAll(".ex-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("export-fmt").textContent =
    fmt === "json" ? "application/json" : "text/csv";
  document.getElementById("export-code").textContent =
    fmt === "json" ? exportToJSON(catalog) : exportToCSV(catalog);
  const cb = document.getElementById("copy-btn");
  cb.textContent = "Copy";
  cb.classList.remove("copied");
}

function copyExport() {
  navigator.clipboard
    .writeText(document.getElementById("export-code").textContent)
    .then(() => {
      const cb = document.getElementById("copy-btn");
      cb.textContent = "Copied ✓";
      cb.classList.add("copied");
      setTimeout(() => {
        cb.textContent = "Copy";
        cb.classList.remove("copied");
      }, 2000);
    });
}

// ============================================================
//  STATS PANEL
// ============================================================
function renderStats() {
  const authors = new Set(
    catalog.map((b) => b.author).filter((a) => a !== "Unknown"),
  );
  const decades = Object.keys(byDecade).filter((k) => k !== "Unknown").length;
  document.getElementById("stats-grid").innerHTML = [
    [catalog.length, "Total Entries"],
    [validCount, "Valid Records"],
    [invalidCount, "Incomplete"],
    [authors.size, "Unique Authors"],
    [decades, "Decades Spanned"],
    [oldestYear, "Oldest Year"],
    [newestYear, "Newest Year"],
    [Object.keys(byDecade).length, "Decade Groups"],
  ]
    .map(
      ([n, d]) =>
        `<div class="stat-card"><div class="stat-num">${n}</div><div class="stat-desc">${d}</div></div>`,
    )
    .join("");

  const maxCount = Math.max(...Object.values(byDecade).map((v) => v.length));
  const keys = Object.keys(byDecade).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return parseInt(a) - parseInt(b);
  });
  document.getElementById("timeline").innerHTML = keys
    .map((dk, i) => {
      const cnt = byDecade[dk].length;
      const pct = Math.round((cnt / maxCount) * 100);
      return `<div class="tl-entry" style="animation-delay:${i * 60}ms">
      <div class="tl-decade">${dk}</div>
      <div class="tl-bar" style="width:${Math.max(pct, 5)}%"></div>
      <div class="tl-count">${cnt} book${cnt !== 1 ? "s" : ""}</div>
    </div>`;
    })
    .join("");
}

// ============================================================
//  HEADER
// ============================================================
function renderHeader() {
  document.getElementById("header-stats").innerHTML = [
    `${catalog.length} entries parsed`,
    `${validCount} valid · ${invalidCount} incomplete`,
    `${oldestYear} – ${newestYear}`,
  ]
    .map((t) => `<div class="stat-pill">${t}</div>`)
    .join("");
}

// INIT
renderHeader();
filterCatalog();
renderDecades();
renderValidate();
switchExport("json", document.querySelector(".ex-tab.active"));
renderStats();
