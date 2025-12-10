"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<null|string>(null);
  const [players, setPlayers] = useState(8);
  const [impostors, setImpostors] = useState(1);
  const [word, setWord] = useState("");
  const [gameCode, setGameCode] = useState(null);

  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);

  async function crearPartida() {
    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players, impostors, word }),
    });

    const data = await res.json();
    setGameCode(data.code);
  }

  async function iniciar() {
    await fetch("/api/start-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });
  }

  async function siguienteRonda() {
    await fetch("/api/next-round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });

    alert("Nueva ronda iniciada");
  }

  async function finalizar() {
    await fetch("/api/end-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });

    setMode(null);
    setGameCode(null);
  }

  async function unirse() {
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name }),
    });

    const data = await res.json();

    if (data.error) return alert(data.error);

    setRole(data.role);
    setStatus(data.status || "ESPERA");
  }

  async function salir() {
    await fetch("/api/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name }),
    });

    setRole(null);
    setStatus(null);
  }

  return (
    <main style={{ padding: 20 }}>
      
      {/* --- PANTALLA INICIAL --- */}
      {!mode && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            gap: "20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
          >
            SOTEPOSTOR
          </h1>

          <button
            onClick={() => setMode("crear")}
            className="boton"
          >
            CREAR PARTIDA
          </button>

          <button
            onClick={() => setMode("unirse")}
            className="boton"
          >
            UNIRSE A PARTIDA
          </button>
        </div>
      )}

      {/* --- MODO CREAR --- */}
      {mode === "crear" && (
        <>
          <h2>CONFIGURAR PARTIDA</h2>

          <h1>Cantidad de Jugadores:</h1>
          <input type="number" value={players} onChange={(e) => setPlayers(+e.target.value)} />
          <h1>Cantidad de impostores:</h1>
          <input type="number" min={1} value={impostors} onChange={(e) => setImpostors(+e.target.value)} />
          <h1>Palabra para esta ronda (opcional):</h1>
          <input type="text" value={word} placeholder="Palabra opcional" onChange={(e) => setWord(e.target.value)} />
          <br/>
          <button className="boton" onClick={crearPartida}>Crear</button>

          {gameCode && (
            <>
              <h3>CÓDIGO: {gameCode}</h3>

              <button className="boton" onClick={iniciar}>INICIAR PARTIDA</button>
              <button className="boton" onClick={siguienteRonda}>SIGUIENTE RONDA</button>
              <button className="boton" onClick={finalizar}>FINALIZAR PARTIDA</button>
            </>
          )}
        </>
      )}

      {/* --- MODO UNIRSE --- */}
      {mode === "unirse" && (
        <>
          <h2>UNIRSE A PARTIDA</h2>

          <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Código" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />

          <button className="boton" onClick={unirse}>Unirse</button>

          {role && (
            <>
              <h3>Estado: {status}</h3>
              <h2>ROL: {role}</h2>
              <button className="boton" onClick={salir}>Salir</button>
            </>
          )}
        </>
      )}
    </main>
  );
}
