"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";

export default function Home() {
  const [streamedText, setStreamedText] = useState('');
  const [errorText, setErrorText] = useState<Array<String>>([]);
  const [promptInput, setPromptInput] = useState<String>("");


  useEffect(() => {
    const fetchStream = async() => {
      const response = await fetch("/api/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if(!response.body) {
        throw new Error("No response body");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          try {
            setStreamedText((prev) => prev + chunk);
          } catch (e:any) {
            setErrorText((prev) => [...prev,e.message + " : " + chunk])
          }
        } 
      }
    }

    fetchStream();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-90 bg-red-800">
        <ul>
          {errorText.map((errr, i) => <li key={i}>{i} - {errr}</li>)}
        </ul>
      </div>
      <div className="h-90">
        <p>{streamedText}</p>
      </div>
      <div>
        <input></input>
      </div>     
    </main>
  );
}
