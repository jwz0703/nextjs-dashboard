"use client";
import { useState, useCallback } from "react";

const extractFramerUrls = (code) => {
  const results = [];
  const seen = new Set();

  // Match all import statements with URLs
  const importRegex = /import\s+[\s\S]*?from\s+["'](https?:\/\/[^"']+)["']/g;
  // Match dynamic imports
  const dynamicImportRegex = /import\(["'](https?:\/\/[^"']+)["']\)/g;
  // Match require() with URLs
  const requireRegex = /require\(["'](https?:\/\/[^"']+)["']\)/g;
  // Match any standalone URL in strings
  const urlRegex = /["'`](https?:\/\/framerusercontent\.com\/[^"'`\s]+)["'`]/g;

  const addUrl = (url, type) => {
    if (!seen.has(url)) {
      seen.add(url);
      results.push({ url, type });
    }
  };

  let match;
  while ((match = importRegex.exec(code)) !== null) addUrl(match[1], "static import");
  while ((match = dynamicImportRegex.exec(code)) !== null) addUrl(match[1], "dynamic import");
  while ((match = requireRegex.exec(code)) !== null) addUrl(match[1], "require()");
  while ((match = urlRegex.exec(code)) !== null) addUrl(match[1], "url string");

  return results;
};

const typeColors = {
  "static import": { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
  "dynamic import": { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  "require()": { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
  "url string": { bg: "#f3e8ff", text: "#6b21a8", border: "#d8b4fe" },
};

export default function App() {
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(null);

  const handleExtract = useCallback(() => {
    const urls = extractFramerUrls(code);
    setResults(urls);
  }, [code]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCopyAll = () => {
    const all = results.map((r) => r.url).join("\n");
    navigator.clipboard.writeText(all);
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  };

  const handleClear = () => {
    setCode("");
    setResults(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f11", color: "#e8e6f0", fontFamily: "'Courier New', monospace", padding: "32px 24px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7c6fcd" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#7c6fcd", textTransform: "uppercase" }}>工具</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#f0eeff", letterSpacing: "-0.02em" }}>
            Framer URL Extractor
          </h1>
          <p style={{ margin: "8px 0 0", color: "#6b6880", fontSize: 13 }}>
            貼上 Framer 生成的程式碼，自動抓取所有 import URL
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: "#9d9ab0", letterSpacing: "0.08em" }}>INPUT CODE</label>
            {code && (
              <button onClick={handleClear} style={{ background: "none", border: "none", color: "#6b6880", fontSize: 12, cursor: "pointer", padding: "2px 6px" }}>
                清除
              </button>
            )}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="貼上 Framer 程式碼..."
            style={{
              width: "100%", height: 220, background: "#18171f", border: "1px solid #2e2c3d",
              borderRadius: 8, color: "#c8c5e0", fontSize: 12, padding: "14px 16px",
              resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box",
              fontFamily: "'Courier New', monospace"
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleExtract}
          disabled={!code.trim()}
          style={{
            background: code.trim() ? "#7c6fcd" : "#2e2c3d",
            color: code.trim() ? "#fff" : "#4a4860",
            border: "none", borderRadius: 6, padding: "10px 24px",
            fontSize: 13, fontWeight: 600, cursor: code.trim() ? "pointer" : "not-allowed",
            letterSpacing: "0.04em", marginBottom: 32, transition: "all 0.15s"
          }}
        >
          ▶ 開始擷取
        </button>

        {/* Results */}
        {results !== null && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#9d9ab0", letterSpacing: "0.08em" }}>RESULTS</span>
                <span style={{
                  background: results.length > 0 ? "#7c6fcd22" : "#2e2c3d",
                  color: results.length > 0 ? "#b8b0f0" : "#6b6880",
                  fontSize: 11, padding: "2px 8px", borderRadius: 20, border: `1px solid ${results.length > 0 ? "#7c6fcd44" : "#2e2c3d"}`
                }}>
                  {results.length} 個 URL
                </span>
              </div>
              {results.length > 0 && (
                <button onClick={handleCopyAll} style={{
                  background: "#1e1d28", border: "1px solid #2e2c3d", color: "#9d9ab0",
                  fontSize: 11, padding: "5px 12px", borderRadius: 5, cursor: "pointer",
                  letterSpacing: "0.04em"
                }}>
                  {copied === "all" ? "✓ 已複製全部" : "複製全部"}
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div style={{ background: "#18171f", border: "1px solid #2e2c3d", borderRadius: 8, padding: 32, textAlign: "center", color: "#4a4860" }}>
                沒有找到任何 URL
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.map((item, i) => {
                  const colors = typeColors[item.type] || typeColors["url string"];
                  return (
                    <div key={i} style={{
                      background: "#18171f", border: "1px solid #2e2c3d", borderRadius: 8,
                      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12
                    }}>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
                        background: colors.bg + "22", color: colors.text,
                        border: `1px solid ${colors.border}44`, letterSpacing: "0.05em"
                      }}>
                        {item.type}
                      </span>
                      <span style={{
                        flex: 1, fontSize: 12, color: "#c8c5e0", wordBreak: "break-all",
                        lineHeight: 1.5
                      }}>
                        {item.url}
                      </span>
                      <button
                        onClick={() => handleCopy(item.url, i)}
                        style={{
                          background: copied === i ? "#7c6fcd33" : "#1e1d28",
                          border: `1px solid ${copied === i ? "#7c6fcd" : "#2e2c3d"}`,
                          color: copied === i ? "#b8b0f0" : "#6b6880",
                          fontSize: 11, padding: "4px 10px", borderRadius: 4,
                          cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
                        }}
                      >
                        {copied === i ? "✓" : "複製"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}