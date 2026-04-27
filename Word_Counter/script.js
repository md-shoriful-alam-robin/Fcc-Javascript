// ==================== UTILS ====================
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function clearLog(id) {
  const el = document.getElementById(id);
  el.innerHTML = "";
}

function appendLog(id, html) {
  const el = document.getElementById(id);
  const row = document.createElement("div");
  row.className = "log-row";
  row.innerHTML = html;
  el.appendChild(row);
  el.scrollTop = el.scrollHeight;
}

// ==================== FUNCTION 1: printCharacters ====================
function printCharacters(str) {
  for (const char of str) {
    console.log(char);
  }
}

function buildCharStream(str) {
  const stream = document.getElementById("char-stream");
  stream.innerHTML = "";
  document.getElementById("pc-str-preview").textContent = `"${str}"`;
  for (const ch of str) {
    const box = document.createElement("div");
    box.className = "char-box" + (ch === " " ? " space-char" : "");
    box.textContent = ch === " " ? "·" : ch;
    stream.appendChild(box);
  }
}

async function runPrintChars() {
  const str = document.getElementById("pc-input").value;
  if (!str) {
    return;
  }
  const delay = 1000 - parseInt(document.getElementById("pc-speed").value);
  const btn = document.getElementById("pc-run");
  btn.disabled = true;

  buildCharStream(str);
  clearLog("pc-log");
  document.getElementById("pc-result").classList.remove("show");
  await sleep(200);

  const boxes = document.querySelectorAll("#char-stream .char-box");
  let i = 0;
  for (const char of str) {
    boxes[i].classList.add("active");
    appendLog(
      "pc-log",
      `<span class="log-arrow">›</span><span class="log-char">console.log("${char === " " ? " (space)" : char}")</span>`,
    );
    await sleep(delay);
    boxes[i].classList.remove("active");
    boxes[i].classList.add("done");
    i++;
  }

  document.getElementById("pc-result-text").textContent =
    `Loop finished! Printed ${str.length} character${str.length !== 1 ? "s" : ""} — one per iteration.`;
  document.getElementById("pc-result").classList.add("show");
  btn.disabled = false;
}

function resetPC() {
  document.getElementById("char-stream").innerHTML = "";
  clearLog("pc-log");
  appendLog(
    "pc-log",
    '<span class="log-iter">// output will appear here...</span>',
  );
  document.getElementById("pc-result").classList.remove("show");
  document.getElementById("pc-run").disabled = false;
  document.getElementById("pc-str-preview").textContent =
    `"${document.getElementById("pc-input").value}"`;
}

// ==================== FUNCTION 2: getMatchedWordCount ====================
function getMatchedWordCount(sentence, match) {
  let count = 0;
  for (const word of sentence) {
    if (word === match) {
      count++;
    }
  }
  return count;
}

function buildWordTrack(words) {
  const track = document.getElementById("word-track");
  track.innerHTML = "";
  words.forEach((w) => {
    const pill = document.createElement("div");
    pill.className = "word-pill";
    pill.textContent = w;
    track.appendChild(pill);
  });
}

async function runWordCount() {
  const sentenceRaw = document.getElementById("wc-sentence").value.trim();
  const match = document.getElementById("wc-match").value.trim();
  if (!sentenceRaw || !match) {
    return;
  }

  const sentence = sentenceRaw.split(/\s+/);
  const delay = 1100 - parseInt(document.getElementById("wc-speed").value);
  const btn = document.getElementById("wc-run");
  btn.disabled = true;

  buildWordTrack(sentence);
  clearLog("wc-log");
  document.getElementById("wc-result").classList.remove("show");
  document.getElementById("count-num").textContent = "0";
  await sleep(200);

  const pills = document.querySelectorAll("#word-track .word-pill");
  let count = 0;

  for (let i = 0; i < sentence.length; i++) {
    const word = sentence[i];
    pills[i].classList.add("checking");

    if (word === match) {
      await sleep(delay * 0.55);
      count++;
      pills[i].classList.remove("checking");
      pills[i].classList.add("matched");
      const numEl = document.getElementById("count-num");
      numEl.textContent = count;
      numEl.classList.add("bump");
      setTimeout(() => numEl.classList.remove("bump"), 300);
      appendLog(
        "wc-log",
        `<span class="log-arrow">›</span>Checking <span class="log-match">"${word}"</span> vs "${match}" → <span class="log-match">MATCH!</span> <span class="log-count">count = ${count}</span>`,
      );
    } else {
      await sleep(delay * 0.55);
      pills[i].classList.remove("checking");
      pills[i].classList.add("skipped");
      appendLog(
        "wc-log",
        `<span class="log-arrow">›</span>Checking <span class="log-miss">"${word}"</span> vs "${match}" → no match. count = ${count}`,
      );
    }
    await sleep(delay * 0.45);
  }

  document.getElementById("wc-result-text").textContent =
    `return ${count}  —  "${match}" found ${count} time${count !== 1 ? "s" : ""} in ${sentence.length} words.`;
  document.getElementById("wc-result").classList.add("show");
  btn.disabled = false;
}

function resetWC() {
  document.getElementById("word-track").innerHTML = "";
  clearLog("wc-log");
  appendLog(
    "wc-log",
    '<span class="log-iter">// output will appear here...</span>',
  );
  document.getElementById("count-num").textContent = "0";
  document.getElementById("wc-result").classList.remove("show");
  document.getElementById("wc-run").disabled = false;
}

// live preview update
document.getElementById("pc-input").addEventListener("input", (e) => {
  document.getElementById("pc-str-preview").textContent = `"${e.target.value}"`;
});
