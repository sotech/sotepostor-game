"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState(null);

  // Crear partida
  const [players, setPlayers] = useState(8);
  const [impostors, setImpostors] = useState(1);
  const [word, setWord] = useState("");
  const [gameCode, setGameCode] = useState(null);

  // Listado de jugadores
  const [gamePlayers, setGamePlayers] = useState([]);
  const [shownRoles, setShownRoles] = useState({});

  // Unirse a partida
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);

  // ---------------------------
  // CREAR PARTIDA
  // ---------------------------
  async function crearPartida() {
    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players, impostors, word }),
    });

    const data = await res.json();
    setGameCode(data.code);
    actualizarInfo(data.code);
  }

  // Iniciar partida
  async function iniciar() {
    await fetch("/api/start-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });
  }

  // Siguiente ronda
  async function siguienteRonda() {
    await fetch("/api/next-round", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });

    alert("Nueva ronda iniciada");
    actualizarInfo(gameCode);
  }

  // Finalizar partida
  async function finalizar() {
    await fetch("/api/end-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });

    setMode(null);
    setGameCode(null);
    setGamePlayers([]);
    setShownRoles({});
  }

  // ---------------------------
  // ACTUALIZAR INFO PARTIDA
  // ---------------------------
  async function actualizarInfo(codeOverride) {
    const code = codeOverride || gameCode;
    if (!code) return;

    const res = await fetch("/api/game-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (!data.error) {
      setGamePlayers(data.assigned || []);
    }
  }

  // Mostrar / Ocultar rol
  function toggleVisibility(name) {
    setShownRoles((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  // ---------------------------
  // UNIRSE A PARTIDA
  // ---------------------------
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

  // Salir
  async function salir() {
    await fetch("/api/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name }),
    });

    setRole(null);
    setStatus(null);
  }

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------

  return (
    <main style={{ padding: 20 }}>

      {/* ================================================
          PANTALLA INICIAL
      ================================================== */}
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

          <button className="boton" onClick={() => setMode("crear")}>
            CREAR PARTIDA
          </button>

          <button className="boton" onClick={() => setMode("unirse")}>
            UNIRSE A PARTIDA
          </button>
        </div>
      )}

      {/* ================================================
          CREAR PARTIDA
      ================================================== */}
      {mode === "crear" && (
        <>
          <h2>CONFIGURAR PARTIDA</h2>

          <h3>Cantidad de jugadores:</h3>
          <input type="number" value={players} onChange={(e) => setPlayers(+e.target.value)} />

          <h3>Cantidad de impostores:</h3>
          <input type="number" min={1} value={impostors} onChange={(e) => setImpostors(+e.target.value)} />

          <h3>Palabra para esta ronda (opcional):</h3>
          <input type="text" value={word} placeholder="Palabra opcional" onChange={(e) => setWord(e.target.value)} />

          <br />
          <button className="boton" onClick={crearPartida}>Crear</button>

          {gameCode && (
            <>
              <h2>CÓDIGO: {gameCode}</h2>

              <button className="boton" onClick={iniciar}>INICIAR PARTIDA</button>
              <button className="boton" onClick={siguienteRonda}>SIGUIENTE RONDA</button>
              <button className="boton" onClick={finalizar}>FINALIZAR PARTIDA</button>

              {/* LISTA DE JUGADORES */}
              <h2 style={{ marginTop: "30px" }}>Jugadores Unidos:</h2>
              <button className="boton" onClick={() => actualizarInfo()}>Actualizar</button>

              <ul style={{ listStyle: "none", padding: 0 }}>
                {gamePlayers.map((p, i) => (
                  <li
                    key={i}
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      border: "1px solid black",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{p.name}</span>

                    <span style={{ marginRight: "15px", fontSize: "18px" }}>
                      {shownRoles[p.name] ? p.role : "— — —"}
                    </span>

                    <button
                      className="boton"
                      style={{ width: "110px" }}
                      onClick={() => toggleVisibility(p.name)}
                    >
                      {shownRoles[p.name] ? "OCULTAR" : "MOSTRAR"}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {/* ================================================
          UNIRSE A PARTIDA
      ================================================== */}
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
