"use client";

import { useState } from "react";

export default function Room() {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  return (
    <main className="flex min-h-screen h-screen flex-col items-center justify-between p-24">
      <div className="w-1/4 h-3/4 bg-white border-solid rounded-xl shadow-md shadow-slate-300 flex flex-col items-center justify-between">
        <div className="flex items-center justify-center bg-indigo-600 rounded-tl-lg rounded-tr-lg text-white w-full h-1/8">
          <span className="text-2xl py-1">Sala</span>
        </div>
        <div className="container p-4 w-full h-3/4">
          <div className="msg-container">
            <span className="font-bold">Bruno</span>
            <br />
            <span>Oi!</span>
          </div>
        </div>
        <div className="container p-2 w-full h-1/6 bg-slate-300 rounded-bl-lg rounded-br-lg flex flex-row items-center justify-between">
          <textarea
            className="w-10/12 h-full bg-transparent outline-none"
            placeholder="Digite"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                console.log("clicou enter");
                setMessage("");
              }
            }
          }
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          />
          <button
            className="w-2/12 h-full bg-transparent outline-none"
            onClick={() => console.log("clicou")}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
