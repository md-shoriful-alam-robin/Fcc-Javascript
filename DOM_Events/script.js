// ============================================================
//  ORIGINAL DATA + FUNCTIONS
// ============================================================
const instrumentsArr = [
  { category: "woodwinds", instrument: "Flute", price: 500 },
  { category: "woodwinds", instrument: "Clarinet", price: 200 },
  { category: "woodwinds", instrument: "Oboe", price: 4000 },
  { category: "brass", instrument: "Trumpet", price: 200 },
  { category: "brass", instrument: "Trombone", price: 300 },
  { category: "brass", instrument: "French Horn", price: 4300 },
  { category: "percussion", instrument: "Drum Set", price: 500 },
  { category: "percussion", instrument: "Xylophone", price: 3000 },
  { category: "percussion", instrument: "Cymbals", price: 200 },
  { category: "percussion", instrument: "Marimba", price: 3000 },
];

const selectContainer = document.querySelector("select");
const productsContainer = document.querySelector(".products-container");

function instrumentCards(instrumentCategory) {
  const instruments =
    instrumentCategory === "all"
      ? instrumentsArr
      : instrumentsArr.filter(
          ({ category }) => category === instrumentCategory,
        );

  return instruments.map(({ instrument, price, category }) => {
    const icons = { woodwinds: "🎵", brass: "🎺", percussion: "🥁" };
    return `
      <div class="card" style="animation-delay:${instruments.indexOf(instrumentsArr.find((i) => i.instrument === instrument)) * 40}ms">
        <span class="card-icon">${icons[category] || "🎵"}</span>
        <div class="card-cat">${category}</div>
        <h2>${instrument}</h2>
        <p>$${price.toLocaleString()}</p>
        <button class="add-btn" onclick="handleAdd(this)">Add to Cart</button>
      </div>`;
  });
}

// original event listener
selectContainer.addEventListener("change", () => {
  productsContainer.innerHTML = instrumentCards(selectContainer.value).join("");
  updateUI(selectContainer.value);
});

// ============================================================
//  UI HELPERS
// ============================================================
const catTitles = {
  all: "All Instruments",
  woodwinds: "Woodwinds",
  brass: "Brass Instruments",
  percussion: "Percussion",
};

function updateUI(val) {
  const instruments =
    val === "all"
      ? instrumentsArr
      : instrumentsArr.filter((c) => c.category === val);
  const prices = instruments.map((i) => i.price);
  const min = Math.min(...prices),
    max = Math.max(...prices);
  document.getElementById("showing-count").textContent = instruments.length;
  document.getElementById("section-title").textContent = catTitles[val] || val;
  document.getElementById("section-showing").textContent =
    `${instruments.length} item${instruments.length !== 1 ? "s" : ""}`;
  document.getElementById("price-range").textContent =
    `$${min.toLocaleString()}–$${max.toLocaleString()}`;
}

function handleAdd(btn) {
  btn.textContent = "Added ✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "Add to Cart";
    btn.classList.remove("added");
  }, 1800);
}

// filter buttons → sync with select
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const val = btn.dataset.val;
    selectContainer.value = val;
    selectContainer.dispatchEvent(new Event("change")); // triggers original listener
  });
});

// INIT
productsContainer.innerHTML = instrumentCards("all").join("");
updateUI("all");
