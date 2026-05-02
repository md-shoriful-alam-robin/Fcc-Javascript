// ============================================================
//  ORIGINAL FUNCTIONS (unchanged)
// ============================================================
function initList() {
  return { head: null, length: 0 };
}
function isEmpty(list) {
  return list.length === 0;
}
function add(list, element) {
  const node = { element: element, next: null };
  if (isEmpty(list)) {
    list.head = node;
  } else {
    let current = list.head;
    while (current.next !== null) {
      current = current.next;
    }
    current.next = node;
  }
  list.length++;
}
function remove(list, element) {
  let previous = null;
  let current = list.head;
  while (current !== null && current.element !== element) {
    previous = current;
    current = current.next;
  }
  if (current === null) return;
  if (previous !== null) {
    previous.next = current.next;
  } else {
    list.head = current.next;
  }
  list.length--;
}

// ============================================================
//  STATE
// ============================================================
let myList = initList();

// ============================================================
//  RENDER
// ============================================================
function renderList() {
  const visual = document.getElementById("ll-visual");
  document.getElementById("st-len").textContent = myList.length;
  document.getElementById("st-empty").textContent = isEmpty(myList)
    ? "✓ হ্যাঁ"
    : "✗ না";
  document.getElementById("st-head").textContent = myList.head
    ? myList.head.element
    : "null";

  if (isEmpty(myList)) {
    visual.innerHTML =
      '<span class="ll-empty">খালি — কোনো node নেই। Add করো!</span>';
    return;
  }

  let html = "";
  let current = myList.head;
  let i = 0;
  while (current !== null) {
    const isLast = current.next === null;
    html += `
      <div class="ll-node" style="animation-delay:${i * 60}ms">
        ${i === 0 ? '<div style="display:flex;flex-direction:column;align-items:center"><div class="head-label">▼ head</div>' : "<div>"}
        <div class="ll-node-box">
          <div class="ll-node-element">${current.element}</div>
          <div class="ll-node-next ${isLast ? "" : "has-next"}">${isLast ? "null" : "next →"}</div>
        </div>
        </div>
      </div>`;
    if (!isLast) {
      html += `<div class="ll-arrow">→</div>`;
    }
    current = current.next;
    i++;
  }
  html += `<div class="ll-arrow" style="opacity:.4">→</div><div class="null-box">null</div>`;
  visual.innerHTML = html;
}

// ============================================================
//  LOG
// ============================================================
function addLog(msg, type = "info") {
  const log = document.getElementById("event-log");
  const icons = { add: "✅", remove: "🗑️", info: "💡", warn: "⚠️" };
  const classes = {
    add: "log-add",
    remove: "log-remove",
    info: "log-info",
    warn: "log-warn",
  };
  const item = document.createElement("div");
  item.className = `log-item ${classes[type]}`;
  item.innerHTML = `<span class="log-icon">${icons[type]}</span> ${msg}`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

// ============================================================
//  ACTIONS
// ============================================================
function doAdd() {
  const val = parseInt(document.getElementById("add-val").value);
  if (isNaN(val)) {
    addLog("একটা সংখ্যা দাও!", "warn");
    return;
  }
  add(myList, val);
  addLog(
    `add(${val}) → node তৈরি হলো, শেষে যোগ হলো। length = ${myList.length}`,
    "add",
  );
  renderList();
}

function doRemove() {
  const val = parseInt(document.getElementById("rem-val").value);
  if (isNaN(val)) {
    addLog("কোন node সরাবে? সংখ্যা দাও!", "warn");
    return;
  }
  const before = myList.length;
  remove(myList, val);
  if (myList.length < before) {
    addLog(
      `remove(${val}) → ${val} খুঁজে পেলাম, সরিয়ে দিলাম! length = ${myList.length}`,
      "remove",
    );
  } else {
    addLog(`remove(${val}) → ${val} list-এ নেই! কিছু হয়নি।`, "warn");
  }
  renderList();
}

function doReset() {
  myList = initList();
  addLog("↺ Reset — নতুন খালি list তৈরি হলো।", "info");
  renderList();
}

// INIT
renderList();
