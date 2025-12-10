"use client";

import { useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState(8);
  const [impostors, setImpostors] = useState(2);
  const [word, setWord] = useState("");
  const [gameCode, setGameCode] = useState(null);
  const [joinedName, setJoinedName] = useState("");
  const [joinedCode, setJoinedCode] = useState("");
  const [role, setRole] = useState(null);

  async function crearPartida() {
    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players, impostors, word }),
    });

    const data = await res.json();
    setGameCode(data.code);
  }

  async function unirse() {
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: joinedCode,
        name: joinedName,
      }),
    });

    const data = await res.json();
    if (data.role) {
      setRole(data.role);
    } else {
      alert(data.error);
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: 20 }}>
      <h1>🎭 Juego de Impostores</h1>

      <hr />

      <h2>👑 Crear Partida</h2>
      <div style={{ maxWidth: 300 }}>
        <input
          type="number"
          placeholder="Jugadores"
          value={players}
          onChange={(e) => setPlayers(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Impostores"
          value={impostors}
          onChange={(e) => setImpostors(Number(e.target.value))}
        />

        <input
          type="text"
          placeholder="Palabra (opcional)"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <button onClick={crearPartida}>Crear Partida</button>

        {gameCode && <h3>✅ Código: {gameCode}</h3>}
      </div>

      <hr />

      <h2>👤 Entrar a Partida</h2>
      <div style={{ maxWidth: 300 }}>
        <input
          type="text"
          placeholder="Tu Nombre"
          value={joinedName}
          onChange={(e) => setJoinedName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Código"
          value={joinedCode}
          onChange={(e) => setJoinedCode(e.target.value)}
        />

        <button onClick={unirse}>Ver Rol</button>

        {role && (
          <h3 style={{ marginTop: 20 }}>
            🎯 Tu rol es: <strong>{role}</strong>
          </h3>
        )}
      </div>
    </main>
  );
}
