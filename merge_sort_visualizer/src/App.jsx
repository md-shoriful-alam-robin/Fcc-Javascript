import { useState, useEffect, useRef } from 'react';
import './styles/App.css';

// ── Generate random array ──────────────────
function generateArray(size = 12) {
  const arr = [];
  const used = new Set();
  while (arr.length < size) {
    const v = Math.floor(Math.random() * 80) + 5;
    if (!used.has(v)) { used.add(v); arr.push(v); }
  }
  return arr;
}

// ── Build ALL merge sort steps ─────────────
function buildMergeSortSteps(inputArray) {
  const steps = [];
  const arr   = [...inputArray];

  function mergeSortTrace(array, start) {
    if (array.length <= 1) return;

    const mid       = Math.floor(array.length / 2);
    const leftPart  = array.slice(0, mid);
    const rightPart = array.slice(mid);

    // Step: DIVIDE
    steps.push({
      type:    'divide',
      array:   [...arr],
      start,
      mid:     start + mid,
      end:     start + array.length - 1,
      left:    leftPart,
      right:   rightPart,
      log:     `DIVIDE [${array.join(', ')}] → LEFT [${leftPart.join(', ')}] | RIGHT [${rightPart.join(', ')}]`,
    });

    mergeSortTrace(leftPart,  start);
    mergeSortTrace(rightPart, start + mid);

    // Merge
    let li = 0, ri = 0, si = 0;
    const merged = [];

    while (li < leftPart.length && ri < rightPart.length) {
      steps.push({
        type:    'compare',
        array:   [...arr],
        start,
        mid:     start + mid,
        end:     start + array.length - 1,
        left:    [...leftPart],
        right:   [...rightPart],
        compareLeft:  leftPart[li],
        compareRight: rightPart[ri],
        log:     `COMPARE ${leftPart[li]} vs ${rightPart[ri]} → pick ${Math.min(leftPart[li], rightPart[ri])}`,
      });

      if (leftPart[li] <= rightPart[ri]) {
        merged.push(leftPart[li]);
        array[si] = leftPart[li];
        arr[start + si] = leftPart[li];
        li++;
      } else {
        merged.push(rightPart[ri]);
        array[si] = rightPart[ri];
        arr[start + si] = rightPart[ri];
        ri++;
      }
      si++;
    }

    while (li < leftPart.length) {
      merged.push(leftPart[li]);
      array[si] = leftPart[li];
      arr[start + si] = leftPart[li];
      li++; si++;
    }

    while (ri < rightPart.length) {
      merged.push(rightPart[ri]);
      array[si] = rightPart[ri];
      arr[start + si] = rightPart[ri];
      ri++; si++;
    }

    steps.push({
      type:   'merge',
      array:  [...arr],
      start,
      mid:    start + mid,
      end:    start + array.length - 1,
      left:   leftPart,
      right:  rightPart,
      merged: [...merged],
      log:    `MERGE → [${merged.join(', ')}] placed at indices ${start}–${start + array.length - 1}`,
    });
  }

  mergeSortTrace(arr, 0);

  steps.push({
    type:   'done',
    array:  [...arr],
    start:  0,
    end:    arr.length - 1,
    log:    `✅ Sorting complete! [${arr.join(', ')}]`,
  });

  return steps;
}

// ── Main App ───────────────────────────────
export default function App() {
  const [array,      setArray]      = useState(() => generateArray(12));
  const [steps,      setSteps]      = useState([]);
  const [stepIndex,  setStepIndex]  = useState(-1);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [speed,      setSpeed]      = useState(800);
  const [customInput,setCustomInput]= useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [inputErr,   setInputErr]   = useState('');
  const intervalRef = useRef(null);
  const logRef      = useRef(null);

  const currentStep = steps[stepIndex] ?? null;

  // ── Auto-play ──────────────────────────
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps, speed]);

  // ── Scroll log ─────────────────────────
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [stepIndex]);

  // ── Start ──────────────────────────────
  const handleStart = () => {
    const s = buildMergeSortSteps(array);
    setSteps(s);
    setStepIndex(-1);
    setIsPlaying(false);
  };

  // ── Controls ────────────────────────────
  const handlePlay  = () => { if (steps.length > 0 && stepIndex < steps.length - 1) setIsPlaying(true); };
  const handlePause = () => setIsPlaying(false);
  const handleNext  = () => { setIsPlaying(false); setStepIndex(p => Math.min(p + 1, steps.length - 1)); };
  const handlePrev  = () => { setIsPlaying(false); setStepIndex(p => Math.max(p - 1, -1)); };
  const handleReset = () => { setIsPlaying(false); setStepIndex(-1); };

  const handleNewArray = () => {
    setArray(generateArray(12));
    setSteps([]); setStepIndex(-1); setIsPlaying(false);
  };

  const handleCustomArray = () => {
    const nums = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length < 2) { setInputErr('At least 2 numbers!'); return; }
    setArray(nums.slice(0, 16));
    setSteps([]); setStepIndex(-1); setIsPlaying(false);
    setShowCustom(false); setCustomInput(''); setInputErr('');
  };

  // ── Cell color ──────────────────────────
  const getCellState = (idx) => {
    if (!currentStep) return 'default';
    const { type, start, end, mid, compareLeft, compareRight, array: stepArr } = currentStep;
    const val = stepArr[idx];

    if (type === 'done') return 'sorted';
    if (idx < start || idx > end) return 'outside';
    if (type === 'divide') {
      if (idx < mid) return 'left';
      return 'right';
    }
    if (type === 'compare') {
      if (val === compareLeft  && idx >= start && idx < mid)  return 'compare-left';
      if (val === compareRight && idx >= mid   && idx <= end) return 'compare-right';
      if (idx >= start && idx < mid)  return 'left';
      if (idx >= mid   && idx <= end) return 'right';
    }
    if (type === 'merge') return 'merging';
    return 'active';
  };

  // Display array
  const displayArray = currentStep ? currentStep.array : array;
  const maxVal = Math.max(...displayArray);
  const progress = steps.length > 0 ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;

  return (
    <div className="app">
      <div className="scanline" />

      {/* ── Header ── */}
      <header className="header fade-up">
        <div className="header-left">
          <div className="header-badge">ALGORITHM</div>
          <h1 className="header-title">
            Merge Sort <span className="header-accent">Visualizer</span>
          </h1>
          <p className="header-sub">
            Divide → Conquer → Merge — Step by step interactive visualization
          </p>
        </div>
        <div className="complexity-box">
          <div className="complexity-item">
            <span className="complexity-label">Time</span>
            <span className="complexity-value accent">O(n log n)</span>
          </div>
          <div className="complexity-divider" />
          <div className="complexity-item">
            <span className="complexity-label">Space</span>
            <span className="complexity-value">O(n)</span>
          </div>
          <div className="complexity-divider" />
          <div className="complexity-item">
            <span className="complexity-label">Stable</span>
            <span className="complexity-value green">Yes</span>
          </div>
        </div>
      </header>

      <main className="main">

        {/* ── Controls ── */}
        <section className="controls-section fade-up">
          <div className="controls-row">
            <div className="input-group">
              <label className="input-label">SPEED — {speed}ms</label>
              <input type="range" min="200" max="2000" step="100"
                value={speed} onChange={e => setSpeed(Number(e.target.value))}
                className="speed-slider" />
              <div className="speed-labels"><span>Fast</span><span>Slow</span></div>
            </div>
            <div className="input-group">
              <label className="input-label">ARRAY</label>
              <div className="arr-btns">
                <button className="btn-arr" onClick={handleNewArray}>🎲 Random</button>
                <button className="btn-arr" onClick={() => setShowCustom(!showCustom)}>✏️ Custom</button>
                <button className="btn-start" onClick={handleStart}>▶ START SORT</button>
              </div>
            </div>
          </div>
          {showCustom && (
            <div className="custom-row slide-in">
              <input type="text" className="custom-input"
                placeholder="e.g. 4, 10, 6, 14, 2, 1, 8, 5"
                value={customInput} onChange={e => setCustomInput(e.target.value)} />
              <button className="btn-start" onClick={handleCustomArray}>Apply</button>
              {inputErr && <span className="input-err">{inputErr}</span>}
            </div>
          )}
        </section>

        {/* ── Bar Chart ── */}
        <section className="chart-section fade-up">
          <div className="section-header">
            <h2 className="section-title">ARRAY VISUALIZATION</h2>
            <div className="legend">
              <span className="leg leg--left">LEFT HALF</span>
              <span className="leg leg--right">RIGHT HALF</span>
              <span className="leg leg--compare">COMPARING</span>
              <span className="leg leg--merge">MERGING</span>
              <span className="leg leg--sorted">SORTED</span>
            </div>
          </div>

          <div className="bar-chart">
            {displayArray.map((val, idx) => {
              const state  = getCellState(idx);
              const height = Math.max(8, Math.round((val / maxVal) * 200));
              return (
                <div key={idx} className="bar-wrap">
                  <div
                    className={`bar bar--${state}`}
                    style={{ height: `${height}px` }}
                  >
                    <span className="bar-val">{val}</span>
                  </div>
                  <span className="bar-idx">{idx}</span>
                </div>
              );
            })}
          </div>

          {/* Step type badge */}
          {currentStep && (
            <div className={`step-badge step-badge--${currentStep.type} slide-in`}>
              {currentStep.type === 'divide'  && '✂️ DIVIDING'}
              {currentStep.type === 'compare' && '⚖️ COMPARING'}
              {currentStep.type === 'merge'   && '🔗 MERGING'}
              {currentStep.type === 'done'    && '✅ COMPLETE'}
            </div>
          )}
        </section>

        {/* ── Tree View ── */}
        {currentStep && (
          <section className="tree-section fade-up slide-in">
            <h2 className="section-title">CURRENT OPERATION</h2>
            <div className="tree-visual">
              {/* Left part */}
              <div className="tree-box tree-box--left">
                <div className="tree-label">LEFT</div>
                <div className="tree-items">
                  {(currentStep.left || []).map((v, i) => (
                    <span key={i} className={`tree-item ${v === currentStep.compareLeft ? 'tree-item--active' : ''}`}>{v}</span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="tree-arrow">
                {currentStep.type === 'divide'  && <span className="arrow-label">SPLIT ✂️</span>}
                {currentStep.type === 'compare' && <span className="arrow-label">vs ⚖️</span>}
                {currentStep.type === 'merge'   && <span className="arrow-label">MERGE 🔗</span>}
                {currentStep.type === 'done'    && <span className="arrow-label">DONE ✅</span>}
              </div>

              {/* Right part */}
              <div className="tree-box tree-box--right">
                <div className="tree-label">RIGHT</div>
                <div className="tree-items">
                  {(currentStep.right || []).map((v, i) => (
                    <span key={i} className={`tree-item ${v === currentStep.compareRight ? 'tree-item--active-r' : ''}`}>{v}</span>
                  ))}
                </div>
              </div>

              {/* Merged result */}
              {currentStep.merged && (
                <div className="tree-merged slide-in">
                  <div className="tree-label tree-label--merge">MERGED RESULT</div>
                  <div className="tree-items">
                    {currentStep.merged.map((v, i) => (
                      <span key={i} className="tree-item tree-item--merged">{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Bottom Grid ── */}
        <div className="bottom-grid">

          {/* Playback */}
          <section className="playback-section fade-up">
            <h2 className="section-title">PLAYBACK</h2>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-label">{stepIndex + 1} / {steps.length} steps</span>
            </div>
            <div className="playback-btns">
              <button className="btn-ctrl" onClick={handlePrev} disabled={stepIndex <= -1}>⏮</button>
              {isPlaying
                ? <button className="btn-ctrl btn-ctrl--accent" onClick={handlePause}>⏸ Pause</button>
                : <button className="btn-ctrl btn-ctrl--accent" onClick={handlePlay} disabled={steps.length === 0 || stepIndex >= steps.length - 1}>▶ Play</button>
              }
              <button className="btn-ctrl" onClick={handleNext} disabled={stepIndex >= steps.length - 1}>⏭</button>
              <button className="btn-ctrl btn-ctrl--reset" onClick={handleReset}>↺</button>
            </div>
            {currentStep && (
              <div className={`step-info step-info--${currentStep.type} slide-in`}>
                <div className="step-info-log">{currentStep.log}</div>
              </div>
            )}
          </section>

          {/* Log */}
          <section className="log-section fade-up">
            <h2 className="section-title">EXECUTION LOG</h2>
            <div className="log-box" ref={logRef}>
              {steps.length === 0 && (
                <div className="log-empty">
                  <span className="blink">_</span> Click START SORT to begin...
                </div>
              )}
              {steps.map((step, i) => (
                <div key={i} className={`log-entry log-entry--${step.type} ${i === stepIndex ? 'log-entry--active' : ''} ${i < stepIndex ? 'log-entry--done' : ''}`}>
                  <span className="log-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`log-type log-type--${step.type}`}>
                    {step.type === 'divide'  ? '✂️' : step.type === 'compare' ? '⚖️' : step.type === 'merge' ? '🔗' : '✅'}
                  </span>
                  <span className="log-text">{step.log}</span>
                  {i === stepIndex && <span className="log-cur blink">◀</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Code */}
          <section className="code-section fade-up">
            <h2 className="section-title">CODE</h2>
            <div className="code-box">
              <pre className="code-pre">{`function mergeSort(array) {
  // Base case
  if (array.length <= 1) return;

  // DIVIDE
  const mid   = Math.floor(
    array.length / 2
  );
  const left  = array.slice(0, mid);
  const right = array.slice(mid);

  // Recursively sort
  mergeSort(left);
  mergeSort(right);

  // MERGE
  let li = 0, ri = 0, si = 0;

  while (li < left.length &&
         ri < right.length) {

    if (left[li] <= right[ri]) {
      array[si++] = left[li++];
    } else {
      array[si++] = right[ri++];
    }
  }

  // Copy remaining
  while (li < left.length)
    array[si++] = left[li++];
  while (ri < right.length)
    array[si++] = right[ri++];
}`}</pre>
              {currentStep && (
                <div className="code-highlight slide-in">
                  <span className="code-hl-label">Currently:</span>
                  <span className={`code-hl-text code-hl--${currentStep.type}`}>
                    {currentStep.type === 'divide'  && 'const left = array.slice(0, mid); const right = array.slice(mid);'}
                    {currentStep.type === 'compare' && `if (left[li] <= right[ri]) → comparing ${currentStep.compareLeft} vs ${currentStep.compareRight}`}
                    {currentStep.type === 'merge'   && 'array[si++] = ... // placing merged values'}
                    {currentStep.type === 'done'    && '✅ mergeSort() complete!'}
                  </span>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* ── Stats ── */}
        <section className="stats-section fade-up">
          <StatCard value={array.length}          label="Array Size" />
          <StatCard value={steps.length || '—'}   label="Total Steps" />
          <StatCard value={steps.length > 0 ? Math.round(array.length * Math.log2(array.length)) : '—'} label="n × log n" />
          <StatCard
            value={steps.length === 0 ? '—' : stepIndex === steps.length - 1 ? 'DONE' : isPlaying ? 'RUNNING' : 'PAUSED'}
            label="Status"
            color={stepIndex === steps.length - 1 ? 'var(--green)' : isPlaying ? 'var(--accent)' : 'var(--text2)'}
          />
        </section>

      </main>

      <footer className="footer">
        <span>Merge Sort Visualizer</span>
        <span style={{color:'var(--text2)'}}>Built by MD Shoriful Alam Robin</span>
        <span style={{color:'var(--accent)'}}>O(n log n)</span>
      </footer>
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={{ color: color || 'var(--accent)' }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
