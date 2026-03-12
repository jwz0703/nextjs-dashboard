"use client";
import { useEffect, useState } from "react";
interface QueryItem {
  amount: number;
  name: string;
}
export default function Page() {
    const [result,setResult] = useState<QueryItem[]>([]);
    useEffect(()=>{
        fetch('/query').then(res=>res.json()).then(data=>setResult(data));
    },[]);
    return (
       <div className="flex flex-col justify-center items-center ">
        {result.map(({amount,name},index)=>( 
            <div key={index}>
                <span>{`${name}:`}</span>
                <span className="bg-cyan-100">{amount}</span>
            </div>
        ))}
       </div>
    );
}