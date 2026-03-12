"use client";
import { useEffect, useRef } from "react";

/**
 * WaveBackground — 純背景元件，自動佔滿整個頁面底層
 *
 * Props:
 *   progress    {number}    0–100，外部控制水位
 *   showNumber  {boolean}   是否顯示數字（預設 true）
 */
export function WaveBackground({
  progress: targetProp = 0,
  showNumber = false,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    progress: 0,
    target: 0,
    offset: 0,
    ampScale: 1.0,
  });

  // 同步外部 prop 變化
  useEffect(() => {
    const s = stateRef.current;
    s.target = Math.max(0, Math.min(100, targetProp));
  }, [targetProp]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawText = (color, text, scale = 1.0) => {
      if (!showNumber) return;
      const w = canvas.width;
      const h = canvas.height;
      const baseFontSize = Math.min(w, h) * 0.22;
      ctx.save();
      ctx.font = `900 ${baseFontSize * scale}px 'PingFang TC', 'Microsoft JhengHei', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(text, w / 2, h / 2);
      ctx.restore();
    };

    const draw = () => {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      const diff = s.target - s.progress;
      if (Math.abs(diff) < 0.1) {
        s.progress = s.target;
      } else {
        s.progress += (s.target - s.progress) * 0.04;
      }

      s.offset += 0.04;

      // 到達 100% 後，amp 逐漸歸零；否則恢復
      if (s.target >= 100 && s.progress > 99) {
        s.ampScale -= 0.005;
        if (s.ampScale < 0) s.ampScale = 0;
      } else if (s.target < 100) {
        s.ampScale += (1.0 - s.ampScale) * 0.04;
      }

      const fillLevel = h - h * (s.progress / 100);
      const mainText = Math.round(s.progress) + "%";

      // 背景幽靈文字
      drawText(`rgba(59,130,246,0.15)`, mainText);

      // 三層波浪
      const waves = [
        { amp: 22, freq: 0.004, speed: 1.00, color: (a) => `rgba(59,130,246,${a * 0.42})` },
        { amp: 28, freq: 0.006, speed: 0.68, color: (a) => `rgba(37,99,235,${a * 0.47})` },
        { amp: 16, freq: 0.003, speed: 1.35, color: (a) => `rgba(96,165,250,${a * 0.52})` },
      ];

      waves.forEach((wave, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x++) {
          const y =
            wave.amp * s.ampScale * Math.sin(x * wave.freq + s.offset * wave.speed + i * 2) +
            fillLevel;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = wave.color(1);
        ctx.fill();
        ctx.clip();
        drawText(`rgba(255,255,255,1)`, mainText);
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [showNumber]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: "#ffffff",
        zIndex: -1,
      }}
    />
  );
}