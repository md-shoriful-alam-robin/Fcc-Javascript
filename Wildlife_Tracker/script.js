// ===== STATE =====
const initialTiger = { species: "Tiger", age: 5, isEndangered: true };
const initialElephant = { species: "Elephant", age: 10, isEndangered: true };
let tiger = { ...initialTiger };
let elephant = { ...initialElephant };
let toastTimer = null;

// ===== RENDER =====
function getAnimal(name) {
  return name === "tiger" ? tiger : elephant;
}

function valHTML(val) {
  if (typeof val === "string")
    return `<span class="prop-val-str">"${val}"</span>`;
  if (typeof val === "number")
    return `<span class="prop-val-num">${val}</span>`;
  if (typeof val === "boolean")
    return `<span class="prop-val-bool">${val}</span>`;
  return `<span>${val}</span>`;
}

function renderAnimal(name, flashKey = null, flashType = null) {
  const obj = getAnimal(name);
  const box = document.getElementById(name + "-props");
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    box.innerHTML = '<div class="empty-msg">অবজেক্টে কোনো প্রপার্টি নেই!</div>';
    return;
  }
  box.innerHTML = keys
    .map((k) => {
      let cls = "prop-item";
      if (k === flashKey) cls += " flash-" + flashType;
      return `<div class="${cls}"><span class="prop-key">${k}</span><span class="prop-colon">:</span>${valHTML(obj[k])}</div>`;
    })
    .join("");
}

function renderAll(flashAnimal = null, flashKey = null, flashType = null) {
  renderAnimal("tiger", flashAnimal === "tiger" ? flashKey : null, flashType);
  renderAnimal(
    "elephant",
    flashAnimal === "elephant" ? flashKey : null,
    flashType,
  );
}

// ===== TOAST =====
function showToast(fn, output, explain) {
  document.getElementById("toast-fn").textContent = fn;
  document.getElementById("toast-output").textContent = "→ " + output;
  document.getElementById("toast-explain").textContent = explain;
  const t = document.getElementById("toast");
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
}

// ===== CONSOLE =====
function addLog(fn, result) {
  const body = document.getElementById("console-body");
  const first = body.querySelector('[style*="italic"]');
  if (first) first.remove();
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `<span class="log-fn">${fn}</span> <span class="log-result">→ ${result}</span><span class="log-time">${time}</span>`;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

// ===== THE ACTUAL JS FUNCTIONS =====
const getSpecies = (animal) => {
  return animal.species;
};
const getAge = (animal) => {
  return animal.age;
};
const addHabitat = (animal, habitat) => {
  animal.habitat = habitat;
  return animal;
};
const updateAge = (animal, newAge) => {
  animal.age = newAge;
  return animal;
};
const removeEndangeredStatus = (animal) => {
  delete animal.isEndangered;
  return animal;
};
const hasHabitat = (animal) => {
  return animal.hasOwnProperty("habitat");
};
const getProperty = (animal, propertyName) => {
  return animal[propertyName];
};

// ===== BUTTON HANDLERS =====
function runGetSpecies() {
  const name = document.getElementById("s1-animal").value;
  const obj = getAnimal(name);
  const result = getSpecies(obj);
  renderAnimal(name, "species", "update");
  showToast(
    `getSpecies(${name})`,
    JSON.stringify(result),
    `${name} অবজেক্টের species প্রপার্টি পড়া হলো। মান হলো "${result}"`,
  );
  addLog(`getSpecies(${name})`, JSON.stringify(result));
}

function runGetAge() {
  const name = document.getElementById("s2-animal").value;
  const obj = getAnimal(name);
  const result = getAge(obj);
  renderAnimal(name, "age", "update");
  showToast(
    `getAge(${name})`,
    result,
    `${name} অবজেক্টের age প্রপার্টি পড়া হলো। বয়স ${result} বছর।`,
  );
  addLog(`getAge(${name})`, result);
}

function runAddHabitat() {
  const name = document.getElementById("s3-animal").value;
  const habitat = document.getElementById("s3-habitat").value || "Forest";
  const obj = getAnimal(name);
  addHabitat(obj, habitat);
  renderAnimal(name, "habitat", "add");
  showToast(
    `addHabitat(${name}, "${habitat}")`,
    `{ ...${name}, habitat: "${habitat}" }`,
    `${name} অবজেক্টে নতুন প্রপার্টি habitat যোগ হলো! আগে এটা ছিল না। সবুজ হাইলাইট মানে নতুন।`,
  );
  addLog(`addHabitat(${name}, "${habitat}")`, `habitat: "${habitat}" যোগ হলো`);
}

function runUpdateAge() {
  const name = document.getElementById("s4-animal").value;
  const newAge = parseInt(document.getElementById("s4-age").value) || 1;
  const obj = getAnimal(name);
  const oldAge = obj.age;
  updateAge(obj, newAge);
  renderAnimal(name, "age", "update");
  showToast(
    `updateAge(${name}, ${newAge})`,
    `age: ${oldAge} → ${newAge}`,
    `${name} অবজেক্টের age ${oldAge} থেকে ${newAge} হয়ে গেল! হলুদ মানে আপডেট।`,
  );
  addLog(`updateAge(${name}, ${newAge})`, `age ${oldAge} → ${newAge}`);
}

function runRemoveEndangered() {
  const name = document.getElementById("s5-animal").value;
  const obj = getAnimal(name);
  if (!obj.hasOwnProperty("isEndangered")) {
    showToast(
      `removeEndangeredStatus(${name})`,
      "কিছু হয়নি!",
      `${name} অবজেক্টে isEndangered প্রপার্টি আগেই নেই!`,
    );
    addLog(`removeEndangeredStatus(${name})`, "isEndangered আগেই ছিল না");
    return;
  }
  removeEndangeredStatus(obj);
  renderAll(null, null, null);
  showToast(
    `removeEndangeredStatus(${name})`,
    "isEndangered মুছে গেছে",
    `delete কীওয়ার্ড দিয়ে ${name} থেকে isEndangered চিরতরে মুছে গেল!`,
  );
  addLog(`removeEndangeredStatus(${name})`, "isEndangered deleted ✕");
}

function runHasHabitat() {
  const name = document.getElementById("s6-animal").value;
  const obj = getAnimal(name);
  const result = hasHabitat(obj);
  renderAnimal(name, result ? "habitat" : null, "update");
  showToast(
    `hasHabitat(${name})`,
    result.toString(),
    result
      ? `${name} অবজেক্টে habitat প্রপার্টি আছে! তাই true।`
      : `${name} অবজেক্টে habitat প্রপার্টি নেই! তাই false। আগে addHabitat চালাও।`,
  );
  addLog(`hasHabitat(${name})`, result.toString());
}

function runGetProperty() {
  const name = document.getElementById("s7-animal").value;
  const prop = document.getElementById("s7-prop").value.trim();
  const obj = getAnimal(name);
  const result = getProperty(obj, prop);
  renderAnimal(name, prop, "update");
  showToast(
    `getProperty(${name}, "${prop}")`,
    result === undefined
      ? "undefined (এই প্রপার্টি নেই!)"
      : JSON.stringify(result),
    result === undefined
      ? `${name} অবজেক্টে "${prop}" বলে কোনো প্রপার্টি নেই!`
      : `animal["${prop}"] দিয়ে ${name}-এর ${prop} পড়া হলো।`,
  );
  addLog(
    `getProperty(${name}, "${prop}")`,
    result === undefined ? "undefined" : JSON.stringify(result),
  );
}

function resetAll() {
  tiger = { ...initialTiger };
  elephant = { ...initialElephant };
  renderAll();
  const body = document.getElementById("console-body");
  body.innerHTML =
    '<div class="log-line" style="color:var(--muted);font-style:italic">// রিসেট হয়েছে — সব শুরু থেকে শুরু!</div>';
  showToast(
    "reset()",
    "সব রিসেট!",
    "tiger ও elephant অবজেক্ট আবার প্রথম অবস্থায় ফিরে গেছে।",
  );
}

// Init
renderAll();
