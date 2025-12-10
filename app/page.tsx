"use client";

import { useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState(8);
  const [impostors, setImpostors] = useState(2);
  const [word, setWord] = useState("");
  const [gameCode, setGameCode] = useState(null);

  async function crearPartida() {
    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        players,
        impostors,
        word,
      }),
    });

    const data = await res.json();
    setGameCode(data.code);
  }

  return (
    <main style={{ minHeight: "100vh", padding: 20 }}>
      <h1>🎭 Juego de Impostores</h1>

      <div style={{ maxWidth: 300 }}>
        <label>Jugadores</label>
        <input
          type="number"
          value={players}
          onChange={(e) => setPlayers(Number(e.target.value))}
        />

        <label>Impostores</label>
        <input
          type="number"
          value={impostors}
          onChange={(e) => setImpostors(Number(e.target.value))}
        />

        <label>Palabra Secreta</label>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <button onClick={crearPartida} style={{ marginTop: 10 }}>
          Crear Partida
        </button>
      </div>

      {gameCode && (
        <div style={{ marginTop: 30 }}>
          <h2>✅ Partida creada</h2>
          <h3>Código del juego:</h3>
          <div
            style={{
              fontSize: 32,
              fontWeight: "bold",
              background: "#000",
              color: "#0f0",
              padding: 10,
              display: "inline-block",
            }}
          >
            {gameCode}
          </div>
        </div>
      )}
    </main>
  );
}
