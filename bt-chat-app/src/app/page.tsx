"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

export default function Home() {
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  const [userData, setUserData] = useState({
    username: "",
    room: "",
    id: "",
  });

  const router = useRouter();

  function sendRoom() {
    socket.emit("join_room", {
      room: userData.room,
      username: userData.username,
      id: socket.id,
    });

    router.push(`/Room`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action="">
        <div className="sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
          </div>
        </div>
        <div className="sm:col-span-3 mt-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Sala
          </label>
          <div className="mt-2">
            <select
              id="country"
              name="country"
              autoComplete="country-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              onChange={(e) => setUserData({ ...userData, room: e.target.value })}
            >
              <option>Selecione uma sala</option>
              <option>Room1</option>
              <option>Room2</option>
              <option>Room3</option>
            </select>
          </div>
        </div>
        <div className=" w-full mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className=" w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => sendRoom()}
            disabled={ !userData.username || !userData.room }
          >
            Entrar
          </button>
        </div>
      </form>
    </main>
  );
}
