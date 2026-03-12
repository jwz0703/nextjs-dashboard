"use client";
import { WaveBackground } from "@/app/ui/test/WaveProgress";
import { useEffect, useRef, useState } from "react";
import Dropdown from '@/app/ui/test/FramerDropdown';
function MyBtn({ text ,onClick}: { text: string ;onClick: ()=>void}) {
  return <button className="px-6 py-2 bg-white/20 border border-white/30 backdrop-blur-md rounded-lg text-black hover:bg-white/30 transition" onClick={onClick}>{text}</button>
}

export default function Home() {
  const [mode, setMode] = useState('browser');
  const [percent,setPercent] = useState(0);
  useEffect(() => {
    // 只有在瀏覽器掛載後才執行偵測
    const getDisplayMode = () => {
      const mqStandAlone = '(display-mode: standalone)';
      if ((navigator as any).standalone || window.matchMedia(mqStandAlone).matches) {
        return 'standalone';
      }
      return 'browser';
    };

    setMode(getDisplayMode());
    }, []);
  return (
    
    <main className="flex min-h-dvh flex-col items-center justify-between p-24">
      <WaveBackground progress={percent}/>
      <h1>{mode}</h1>
      <MyBtn text="++" onClick={()=>setPercent(prev=>Math.min(100,prev+10))}/>
    <MyBtn text="--" onClick={()=>setPercent(prev=> Math.max(0,prev-10))}/>
    </main>
  );
}