import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/App.css';

// ── Generate sorted array ──────────────────
function generateArray(size = 16) {
  const arr = [];
  let val = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(val);
    val += Math.floor(Math.random() * 10) + 1;
  }
  return arr;
}

// ── Build all steps of binary search ──────
function buildSteps(list, target) {
  const steps = [];
  let low = 0;
  let high = list.length - 1;
  let pathToTarget = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const valueAtMiddle = list[mid];
    pathToTarget = [...pathToTarget, valueAtMiddle];

    steps.push({
      low, high, mid,
      valueAtMiddle,
      pathToTarget: [...pathToTarget],
      found: valueAtMiddle === target,
      comparison: valueAtMiddle === target ? 'equal'
        : target > valueAtMiddle ? 'greater' : 'less',
      log: valueAtMiddle === target
        ? `✅ Found ${target} at index ${mid}!`
        : target > valueAtMiddle
          ? `${target} > ${valueAtMiddle} → Search RIGHT half (low = ${mid + 1})`
          : `${target} < ${valueAtMiddle} → Search LEFT half (high = ${mid - 1})`,
    });

    if (valueAtMiddle === target) break;
    if (target > valueAtMiddle) low = mid + 1;
    else high = mid - 1;
  }

  if (steps.length === 0 || !steps[steps.length - 1].found) {
    steps.push({
      low, high, mid: -1, valueAtMiddle: null,
      pathToTarget, found: false, comparison: 'notfound',
      log: `❌ ${target} not found in the list.`,
    });
  }

  return steps;
}

// ── Main App ───────────────────────────────
export default function App() {
  const [array,       setArray]       = useState(() => generateArray(16));
  const [target,      setTarget]      = useState('');
  const [steps,       setSteps]       = useState([]);
  const [stepIndex,   setStepIndex]   = useState(-1);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [speed,       setSpeed]       = useState(900);
  const [inputError,  setInputError]  = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showCustom,  setShowCustom]  = useState(false);
  const intervalRef = useRef(null);
  const logRef      = useRef(null);

  const currentStep = steps[stepIndex] ?? null;

  // ── Auto-play ──────────────────────────
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps, speed]);

  // ── Scroll log ─────────────────────────
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [stepIndex]);

  // ── Start search ───────────────────────
  const handleSearch = () => {
    const t = parseInt(target);
    if (isNaN(t)) { setInputError('Please enter a valid number!'); return; }
    setInputError('');
    const s = buildSteps(array, t);
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

  // ── New array ───────────────────────────
  const handleNewArray = () => {
    setArray(generateArray(16));
    setSteps([]); setStepIndex(-1);
    setTarget(''); setIsPlaying(false); setInputError('');
  };

  // ── Custom array ─────────────────────────
  const handleCustomArray = () => {
    const nums = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length < 2) { setInputError('Enter at least 2 numbers!'); return; }
    const sorted = [...new Set(nums)].sort((a, b) => a - b);
    setArray(sorted);
    setSteps([]); setStepIndex(-1); setTarget('');
    setIsPlaying(false); setInputError('');
    setShowCustom(false); setCustomInput('');
  };

  // ── Cell color ──────────────────────────
  const getCellState = (idx) => {
    if (!currentStep) return 'default';
    const { low, high, mid, found, comparison } = currentStep;
    if (found && idx === mid) return 'found';
    if (idx === mid) return 'mid';
    if (idx === low && idx === high) return 'narrowed';
    if (idx < low || idx > high) return 'eliminated';
    if (idx === low) return 'low';
    if (idx === high) return 'high';
    return 'active';
  };

  const progress = steps.length > 0 ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;

  return (
    <div className="app">

      {/* ── Scanline effect ── */}
      <div className="scanline" />

      {/* ── Header ── */}
      <header className="header fade-up">
        <div className="header-left">
          <div className="header-badge">ALGORITHM</div>
          <h1 className="header-title">Binary Search <span className="header-accent">Visualizer</span></h1>
          <p className="header-sub">Step-by-step interactive visualization of the Binary Search algorithm</p>
        </div>
        <div className="complexity-box">
          <div className="complexity-item">
            <span className="complexity-label">Time</span>
            <span className="complexity-value">O(log n)</span>
          </div>
          <div className="complexity-divider" />
          <div className="complexity-item">
            <span className="complexity-label">Space</span>
            <span className="complexity-value">O(1)</span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">

        {/* ── Controls ── */}
        <section className="controls-section fade-up">
          <div className="controls-row">

            {/* Search input */}
            <div className="input-group">
              <label className="input-label">TARGET VALUE</label>
              <div className="input-wrap">
                <input
                  type="number"
                  className={`search-input ${inputError ? 'input-err' : ''}`}
                  placeholder="Enter number..."
                  value={target}
                  onChange={e => { setTarget(e.target.value); setInputError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn-search" onClick={handleSearch}>
                  SEARCH
                </button>
              </div>
              {inputError && <p className="input-error">{inputError}</p>}
            </div>

            {/* Speed */}
            <div className="input-group">
              <label className="input-label">SPEED — {speed}ms</label>
              <input
                type="range" min="200" max="2000" step="100"
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
                className="speed-slider"
              />
              <div className="speed-labels">
                <span>Fast</span><span>Slow</span>
              </div>
            </div>

            {/* Array buttons */}
            <div className="input-group">
              <label className="input-label">ARRAY</label>
              <div className="arr-btns">
                <button className="btn-arr" onClick={handleNewArray}>🎲 Random</button>
                <button className="btn-arr btn-arr--outline" onClick={() => setShowCustom(!showCustom)}>
                  ✏️ Custom
                </button>
              </div>
            </div>

          </div>

          {/* Custom array input */}
          {showCustom && (
            <div className="custom-row slide-in">
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. 1, 5, 8, 12, 20, 35"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
              />
              <button className="btn-search" onClick={handleCustomArray}>Apply</button>
            </div>
          )}
        </section>

        {/* ── Array Visualization ── */}
        <section className="array-section fade-up">
          <div className="section-header">
            <h2 className="section-title">ARRAY</h2>
            <div className="legend">
              <span className="legend-item legend-low">LOW</span>
              <span className="legend-item legend-mid">MID</span>
              <span className="legend-item legend-high">HIGH</span>
              <span className="legend-item legend-found">FOUND</span>
              <span className="legend-item legend-elim">ELIMINATED</span>
            </div>
          </div>

          <div className="array-grid">
            {array.map((val, idx) => {
              const state = getCellState(idx);
              return (
                <div key={idx} className={`cell cell--${state}`}>
                  <div className="cell-index">{idx}</div>
                  <div className="cell-value">{val}</div>
                  <div className="cell-markers">
                    {currentStep?.low === idx  && <span className="marker marker--low">L</span>}
                    {currentStep?.mid === idx   && <span className="marker marker--mid">M</span>}
                    {currentStep?.high === idx  && <span className="marker marker--high">H</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Range indicator */}
          {currentStep && (
            <div className="range-bar slide-in">
              <div className="range-label">
                <span style={{color:'var(--low)'}}>LOW [{currentStep.low}]</span>
                <span style={{color:'var(--mid)'}}>MID [{currentStep.mid}]</span>
                <span style={{color:'var(--high)'}}>HIGH [{currentStep.high}]</span>
              </div>
            </div>
          )}
        </section>

        {/* ── Bottom Grid ── */}
        <div className="bottom-grid">

          {/* Playback controls */}
          <section className="playback-section fade-up">
            <h2 className="section-title">PLAYBACK</h2>

            {/* Progress */}
            <div className="progress-wrap">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progress}%`}} />
              </div>
              <span className="progress-label">
                {stepIndex + 1} / {steps.length} steps
              </span>
            </div>

            {/* Buttons */}
            <div className="playback-btns">
              <button className="btn-ctrl" onClick={handlePrev} disabled={stepIndex <= -1}>⏮ Prev</button>
              {isPlaying
                ? <button className="btn-ctrl btn-ctrl--accent" onClick={handlePause}>⏸ Pause</button>
                : <button className="btn-ctrl btn-ctrl--accent" onClick={handlePlay} disabled={steps.length === 0 || stepIndex >= steps.length - 1}>▶ Play</button>
              }
              <button className="btn-ctrl" onClick={handleNext} disabled={stepIndex >= steps.length - 1}>Next ⏭</button>
              <button className="btn-ctrl btn-ctrl--reset" onClick={handleReset}>↺ Reset</button>
            </div>

            {/* Current step info */}
            {currentStep && (
              <div className={`step-info step-info--${currentStep.found ? 'found' : currentStep.comparison === 'notfound' ? 'notfound' : 'active'} slide-in`}>
                <div className="step-info-icon">
                  {currentStep.found ? '✅' : currentStep.comparison === 'notfound' ? '❌' : '🔍'}
                </div>
                <div>
                  <div className="step-info-title">Step {stepIndex + 1}</div>
                  <div className="step-info-log">{currentStep.log}</div>
                </div>
              </div>
            )}

            {/* Path */}
            {currentStep && (
              <div className="path-wrap">
                <span className="path-label">PATH:</span>
                <div className="path-items">
                  {currentStep.pathToTarget.map((v, i) => (
                    <span key={i} className="path-item">{v}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Log */}
          <section className="log-section fade-up">
            <h2 className="section-title">EXECUTION LOG</h2>
            <div className="log-box" ref={logRef}>
              {steps.length === 0 && (
                <div className="log-empty">
                  <span className="log-cursor">_</span>
                  Enter a target value and click SEARCH to begin...
                </div>
              )}
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`log-entry ${i === stepIndex ? 'log-entry--active' : ''} ${i < stepIndex ? 'log-entry--done' : 'log-entry--pending'}`}
                >
                  <span className="log-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="log-text">{step.log}</span>
                  {i === stepIndex && <span className="log-cursor-active">◀</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Code */}
          <section className="code-section fade-up">
            <h2 className="section-title">CODE</h2>
            <div className="code-box">
              <pre className="code-pre">
{`function binarySearch(list, target) {
  let low = 0;
  let high = list.length - 1;

  while (low <= high) {
    let mid = Math.floor(
      (low + high) / 2
    );

    if (target === list[mid]) {
      return mid; // ✅ Found!
    }

    if (target > list[mid]) {
      low = mid + 1; // → Right
    } else {
      high = mid - 1; // ← Left
    }
  }

  return -1; // ❌ Not found
}`}
              </pre>

              {/* Highlight current line */}
              {currentStep && (
                <div className="code-highlight slide-in">
                  <span className="code-highlight-label">Currently executing:</span>
                  <span className="code-highlight-text">
                    {currentStep.found
                      ? 'return mid; // ✅ Found!'
                      : currentStep.comparison === 'notfound'
                      ? 'return -1; // ❌ Not found'
                      : currentStep.comparison === 'greater'
                      ? 'low = mid + 1; // → Right'
                      : 'high = mid - 1; // ← Left'
                    }
                  </span>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* ── Stats ── */}
        <section className="stats-section fade-up">
          <div className="stat-card">
            <div className="stat-value">{array.length}</div>
            <div className="stat-label">Array Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{steps.length || '—'}</div>
            <div className="stat-label">Total Steps</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{steps.length > 0 ? Math.ceil(Math.log2(array.length)) : '—'}</div>
            <div className="stat-label">Max Possible Steps</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{color: steps[steps.length-1]?.found ? 'var(--found)' : steps.length > 0 ? 'var(--danger)' : 'var(--text2)'}}>
              {steps.length === 0 ? '—' : steps[steps.length-1]?.found ? 'FOUND' : 'NOT FOUND'}
            </div>
            <div className="stat-label">Result</div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>Binary Search Visualizer</span>
        <span style={{color:'var(--text2)'}}>Built by MD Shoriful Alam Robin</span>
        <span style={{color:'var(--accent)'}}>O(log n)</span>
      </footer>

    </div>
  );
}
