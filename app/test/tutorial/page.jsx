"use client";
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────
// 教學資料
// ─────────────────────────────────────────
const sections = [
  {
    id: "concept",
    label: "📖 概念",
    content: (
      <div>
        <h2 className="section-title">什麼是 useRef？</h2>
        <p className="desc">
          <code>useRef</code> 是 React Hook，回傳一個可變的 <strong>ref 物件</strong>，
          其 <code>.current</code> 屬性被初始化為傳入的值。
        </p>
        <div className="card-grid">
          <div className="card accent-blue">
            <div className="card-icon">🔒</div>
            <h3>不觸發重新渲染</h3>
            <p>改變 <code>.current</code> 不會像 <code>useState</code> 一樣觸發元件重渲染</p>
          </div>
          <div className="card accent-green">
            <div className="card-icon">📌</div>
            <h3>跨渲染保留值</h3>
            <p>ref 物件在整個元件生命週期中持續存在，值不會因重渲染而重置</p>
          </div>
          <div className="card accent-orange">
            <div className="card-icon">🎯</div>
            <h3>存取 DOM 節點</h3>
            <p>最常見用途：直接操作 DOM 元素，例如 focus、scroll、取得尺寸</p>
          </div>
        </div>

        <div className="syntax-block">
          <div className="syntax-label">語法</div>
          <pre>{`const myRef = useRef(initialValue);

// 存取值
console.log(myRef.current);

// 修改值（不觸發重渲染）
myRef.current = newValue;

// 綁定 DOM
<input ref={myRef} />`}</pre>
        </div>

        <div className="comparison">
          <h3>⚖️ useRef vs useState</h3>
          <table>
            <thead>
              <tr>
                <th>特性</th>
                <th>useRef</th>
                <th>useState</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>觸發重渲染</td>
                <td className="no">❌ 不會</td>
                <td className="yes">✅ 會</td>
              </tr>
              <tr>
                <td>跨渲染保留值</td>
                <td className="yes">✅ 是</td>
                <td className="yes">✅ 是</td>
              </tr>
              <tr>
                <td>適合操作 DOM</td>
                <td className="yes">✅ 是</td>
                <td className="no">❌ 否</td>
              </tr>
              <tr>
                <td>適合存 UI 狀態</td>
                <td className="no">❌ 否</td>
                <td className="yes">✅ 是</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "examples",
    label: "⚡ 範例",
    content: <Examples />,
  },
  {
    id: "quiz",
    label: "🧩 出題",
    content: <Quiz />,
  },
];

// ─────────────────────────────────────────
// 範例元件
// ─────────────────────────────────────────
function Examples() {
  return (
    <div>
      <h2 className="section-title">實戰範例</h2>
      <div className="example-list">
        <ExampleFocus />
        <ExampleCounter />
        <ExampleTimer />
      </div>
    </div>
  );
}

function ExampleFocus() {
  const inputRef = useRef(null);
  return (
    <div className="example-card">
      <div className="example-tag">範例 1</div>
      <h3>🎯 自動聚焦 Input</h3>
      <p className="example-desc">點擊按鈕後，直接 focus 到 input 欄位</p>
      <div className="code-block">
        <pre>{`const inputRef = useRef(null);

// 綁到 DOM
<input ref={inputRef} />

// 點擊時 focus
function handleFocus() {
  inputRef.current.focus();
}`}</pre>
      </div>
      <div className="demo">
        <input ref={inputRef} placeholder="等待聚焦..." className="demo-input" />
        <button onClick={() => inputRef.current.focus()} className="demo-btn">
          點我 Focus ✨
        </button>
      </div>
    </div>
  );
}

function ExampleCounter() {
  const countRef = useRef(0);
  const [display, setDisplay] = useState(0);
  return (
    <div className="example-card">
      <div className="example-tag">範例 2</div>
      <h3>🔢 靜默計數器</h3>
      <p className="example-desc">
        <code>countRef.current</code> 累加但<strong>不觸發重渲染</strong>，
        只有按「顯示」才更新畫面
      </p>
      <div className="code-block">
        <pre>{`const countRef = useRef(0);

// 累加不重渲染
function add() {
  countRef.current += 1;
}

// 手動同步到畫面
function show() {
  setDisplay(countRef.current);
}`}</pre>
      </div>
      <div className="demo">
        <span className="counter-display">畫面顯示：{display}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => (countRef.current += 1)} className="demo-btn secondary">
            +1（靜默）
          </button>
          <button onClick={() => setDisplay(countRef.current)} className="demo-btn">
            顯示實際值
          </button>
        </div>
      </div>
    </div>
  );
}

function ExampleTimer() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  function start() {
    if (running) return;
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 100);
  }

  function stop() {
    clearInterval(timerRef.current);
    setRunning(false);
  }

  function reset() {
    stop();
    setTime(0);
  }

  return (
    <div className="example-card">
      <div className="example-tag">範例 3</div>
      <h3>⏱️ 計時器</h3>
      <p className="example-desc">
        用 <code>useRef</code> 儲存 <code>setInterval</code> 的 ID，
        才能在之後 <code>clearInterval</code>
      </p>
      <div className="code-block">
        <pre>{`const timerRef = useRef(null);

function start() {
  timerRef.current = setInterval(...);
}

function stop() {
  clearInterval(timerRef.current);
}`}</pre>
      </div>
      <div className="demo">
        <span className="timer-display">{(time / 10).toFixed(1)}s</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={start} className="demo-btn" disabled={running}>
            ▶ 開始
          </button>
          <button onClick={stop} className="demo-btn secondary" disabled={!running}>
            ⏸ 暫停
          </button>
          <button onClick={reset} className="demo-btn secondary">
            ↺ 重置
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 出題元件
// ─────────────────────────────────────────
const questions = [
  {
    id: 1,
    title: "🎯 題目一：讓文字方塊自動捲到底部",
    difficulty: "初級",
    desc: `建立一個聊天訊息列表。
每次點擊「新增訊息」按鈕時，
列表應該自動捲動到最底部。

提示：
• 需要一個 ref 綁定到列表容器
• scrollTop 和 scrollHeight 是你的好朋友
• useEffect 配合 messages 的依賴陣列`,
    tags: ["DOM 操作", "useEffect"],
  },
  {
    id: 2,
    title: "🕐 題目二：記錄前一次的 props 值",
    difficulty: "中級",
    desc: `建立一個元件，接收一個數字 prop（count）。
畫面上同時顯示「目前值」和「前一次的值」。

提示：
• useState 管理目前值沒問題，但前一次的值呢？
• useRef 可以在 render 之間「記憶」值而不觸發重渲染
• useEffect 的執行時機（在渲染之後）是關鍵`,
    tags: ["前一次值", "useEffect"],
  },
  {
    id: 3,
    title: "🎬 題目三：影片播放控制器",
    difficulty: "中級",
    desc: `建立一個自訂影片播放器（使用 <video> 標籤）。
需要有「播放」、「暫停」、「重置」三個按鈕，
不能使用原生控制列（controls 屬性）。

提示：
• <video> 元素有 .play()、.pause()、.currentTime 等方法
• useRef 是存取 DOM 元素的標準方式
• 可用 https://www.w3schools.com/html/mov_bbb.mp4 作為測試影片`,
    tags: ["媒體 API", "DOM 方法"],
  },
  {
    id: 4,
    title: "🚀 題目四：防抖搜尋（Debounce）",
    difficulty: "進階",
    desc: `建立一個搜尋框，使用者輸入後
需等待 500ms 沒有新輸入，才觸發「搜尋」。
（模擬 API 搜尋，console.log 結果即可）

提示：
• 每次輸入要清除上一個 setTimeout，再建立新的
• setTimeout 回傳一個 ID → 需要跨渲染記住它
• 為什麼不用 useState 存 timer ID？
  因為改變它不需要觸發重渲染！`,
    tags: ["setTimeout", "效能優化", "進階"],
  },
];

function Quiz() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <h2 className="section-title">練習題</h2>
      <p className="desc">共 4 題，難度遞增。試著自己寫，不要看答案！</p>
      <div className="quiz-list">
        {questions.map((q) => (
          <div key={q.id} className={`quiz-card ${expanded === q.id ? "open" : ""}`}>
            <button
              className="quiz-header"
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
            >
              <span className="quiz-title">{q.title}</span>
              <span className={`badge ${q.difficulty}`}>{q.difficulty}</span>
              <span className="chevron">{expanded === q.id ? "▲" : "▼"}</span>
            </button>
            {expanded === q.id && (
              <div className="quiz-body">
                <pre className="quiz-desc">{q.desc}</pre>
                <div className="tag-row">
                  {q.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="tip-box">
        💡 完成後想對答案？直接問我「題目一答案」就可以囉！
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 主元件
// ─────────────────────────────────────────
export default function UseRefPractice() {
  const [active, setActive] = useState("concept");
  const current = sections.find((s) => s.id === active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+TC:wght@400;500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Noto Sans TC', sans-serif;
          background: #0d1117;
          color: #e6edf3;
          min-height: 100vh;
        }

        .app {
          max-width: 860px;
          margin: 0 auto;
          padding: 32px 16px 80px;
        }

        .hero {
          text-align: center;
          margin-bottom: 36px;
        }

        .hero h1 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.2rem;
          font-weight: 600;
          color: #58a6ff;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }

        .hero p {
          color: #8b949e;
          font-size: 0.95rem;
        }

        .tabs {
          display: flex;
          gap: 8px;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 6px;
          margin-bottom: 28px;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 10px 0;
          color: #8b949e;
          font-family: 'Noto Sans TC', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
        }

        .tab:hover { color: #e6edf3; background: #21262d; }
        .tab.active { background: #1f6feb; color: #fff; }

        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #e6edf3;
        }

        .desc {
          color: #8b949e;
          line-height: 1.75;
          margin-bottom: 20px;
        }

        code {
          font-family: 'JetBrains Mono', monospace;
          background: #1c2128;
          color: #79c0ff;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.85em;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) { .card-grid { grid-template-columns: 1fr; } }

        .card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 16px;
          border-top: 3px solid;
        }

        .accent-blue { border-top-color: #58a6ff; }
        .accent-green { border-top-color: #3fb950; }
        .accent-orange { border-top-color: #f78166; }

        .card-icon { font-size: 1.5rem; margin-bottom: 8px; }
        .card h3 { font-size: 0.9rem; font-weight: 700; margin-bottom: 6px; color: #e6edf3; }
        .card p { font-size: 0.8rem; color: #8b949e; line-height: 1.6; }

        .syntax-block {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .syntax-label {
          background: #21262d;
          padding: 6px 14px;
          font-size: 0.75rem;
          color: #8b949e;
          font-family: 'JetBrains Mono', monospace;
          border-bottom: 1px solid #30363d;
        }

        pre {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          padding: 16px;
          color: #e6edf3;
          line-height: 1.7;
          overflow-x: auto;
          white-space: pre-wrap;
        }

        .comparison { margin-bottom: 8px; }
        .comparison h3 { font-size: 1rem; margin-bottom: 12px; }

        table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
        th { background: #21262d; padding: 10px 14px; font-size: 0.82rem; color: #8b949e; text-align: left; }
        td { padding: 9px 14px; border-top: 1px solid #21262d; font-size: 0.85rem; }
        td.yes { color: #3fb950; }
        td.no { color: #f78166; }

        /* Examples */
        .example-list { display: flex; flex-direction: column; gap: 20px; }

        .example-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 20px;
          position: relative;
        }

        .example-tag {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          background: #1f6feb;
          color: #fff;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .example-card h3 { font-size: 1rem; margin-bottom: 6px; }
        .example-desc { font-size: 0.82rem; color: #8b949e; margin-bottom: 12px; }

        .code-block {
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 8px;
          margin-bottom: 14px;
          overflow: hidden;
        }

        .code-block pre { padding: 12px; font-size: 0.78rem; }

        .demo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .demo-input {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 7px 12px;
          color: #e6edf3;
          font-family: 'Noto Sans TC', sans-serif;
          outline: none;
          flex: 1;
          min-width: 140px;
          transition: border-color .2s;
        }

        .demo-input:focus { border-color: #58a6ff; }

        .demo-btn {
          background: #1f6feb;
          border: none;
          border-radius: 6px;
          padding: 7px 14px;
          color: #fff;
          font-family: 'Noto Sans TC', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all .15s;
          white-space: nowrap;
        }

        .demo-btn:hover { background: #388bfd; }
        .demo-btn:disabled { background: #21262d; color: #484f58; cursor: not-allowed; }
        .demo-btn.secondary { background: #21262d; }
        .demo-btn.secondary:hover { background: #30363d; }

        .counter-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.1rem;
          color: #3fb950;
          min-width: 100px;
        }

        .timer-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.5rem;
          color: #58a6ff;
          min-width: 70px;
        }

        /* Quiz */
        .quiz-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

        .quiz-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color .2s;
        }

        .quiz-card.open { border-color: #58a6ff; }

        .quiz-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: #e6edf3;
        }

        .quiz-header:hover { background: #1c2128; }

        .quiz-title { flex: 1; font-size: 0.9rem; font-weight: 600; font-family: 'Noto Sans TC', sans-serif; }
        .chevron { color: #8b949e; font-size: 0.7rem; }

        .badge {
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
        }

        .badge.初級 { background: #1a4a1a; color: #3fb950; }
        .badge.中級 { background: #2a2a00; color: #d29922; }
        .badge.進階 { background: #3a1a1a; color: #f78166; }

        .quiz-body {
          padding: 0 16px 16px;
          border-top: 1px solid #21262d;
        }

        .quiz-desc {
          font-family: 'Noto Sans TC', sans-serif;
          font-size: 0.85rem;
          color: #8b949e;
          line-height: 1.8;
          background: none;
          padding: 14px 0 10px;
          white-space: pre-wrap;
        }

        .tag-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .tag {
          font-size: 0.72rem;
          background: #21262d;
          color: #8b949e;
          padding: 3px 9px;
          border-radius: 10px;
        }

        .tip-box {
          background: #1c2d3d;
          border: 1px solid #1f6feb;
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 0.85rem;
          color: #79c0ff;
          line-height: 1.6;
        }
      `}</style>

      <div className="app">
        <div className="hero">
          <h1>{'<useRef />'}</h1>
          <p>概念 × 範例 × 練習題 — 完整學習指南</p>
        </div>

        <div className="tabs">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`tab ${active === s.id ? "active" : ""}`}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {current.content}
      </div>
    </>
  );
}