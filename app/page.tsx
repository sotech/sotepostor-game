"use client";

import { useState } from "react";
import "./page.css";

type PlayerInfo = {
  name: string;
  role: string | null;
};

type Mode = "crear" | "unirse" | null;

export default function Home() {
  const [mode, setMode] = useState<Mode>(null);

  // Crear partida
  const [players, setPlayers] = useState<number>(8);
  const [impostors, setImpostors] = useState<number>(1);
  const [word, setWord] = useState<string>("");
  const [gameCode, setGameCode] = useState<string | null>(null);

  // Listado de jugadores (admin)
  const [gamePlayers, setGamePlayers] = useState<PlayerInfo[]>([]);
  const [shownRoles, setShownRoles] = useState<Record<string, boolean>>({});

  // Unirse a partida (jugador)
  const [name, setName] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [role, setRole] = useState<string | null | undefined>(undefined);
  const [status, setStatus] = useState<string | null>(null);
  const [round, setRound] = useState<number | null>(null);   // 👈 NUEVO
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // Animación de revelación
  const [showReveal, setShowReveal] = useState<boolean>(false);

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

  // Iniciar partida (asigna roles)
  async function iniciar() {
    if (!gameCode) return;

    const res = await fetch("/api/start-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: gameCode }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    actualizarInfo(gameCode);
  }

  // Siguiente ronda
  async function siguienteRonda() {
    if (!gameCode) return;

    try {
      const res = await fetch("/api/next-round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: gameCode }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Error next-round:", text);
        alert("Error al iniciar la siguiente ronda");
        return;
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert(`Nueva ronda iniciada (Ronda ${data.round})`);
      actualizarInfo(gameCode);
    } catch (e) {
      console.error(e);
      alert("Error inesperado al iniciar la siguiente ronda");
    }
  }


  // Finalizar partida
  async function finalizar() {
    if (!gameCode) return;

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
  // ACTUALIZAR INFO PARTIDA (admin)
  // ---------------------------
  async function actualizarInfo(codeOverride?: string | null) {
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
      // Podríamos usar data.round para mostrar también en admin si quisieras
    }
  }

  // Mostrar / Ocultar rol (solo vista admin)
  function toggleVisibility(name: string) {
    setShownRoles((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  // ---------------------------
  // UNIRSE A PARTIDA (jugador)
  // ---------------------------
  async function unirse() {
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setIsJoined(true);
    setRole(data.role);                 // null al principio
    setStatus(data.status || null);
    setRound(data.round ?? null);       // 👈 guardamos ronda actual
  }

  // Mostrar rol (consulta nuevamente al backend por si ya se asignó)
  async function mostrarRol() {
    if (!joinCode || !name) return;

    const res = await fetch("/api/player-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setRole(data.role);
    setStatus(data.status || null);
    setRound(data.round ?? round);      // 👈 actualizamos ronda también

    // Si ahora sí tiene rol, mostramos animación
    if (typeof data.role === "string" && data.role.length > 0) {
      setShowReveal(true);
      setTimeout(() => setShowReveal(false), 4000);
    }
  }

  // Salir de partida (jugador)
  async function salir() {
    await fetch("/api/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinCode, name }),
    });

    setRole(undefined);
    setStatus(null);
    setRound(null);               // 👈 limpiamos ronda
    setIsJoined(false);
    setShowReveal(false);
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
          <input
            type="number"
            value={players}
            onChange={(e) => setPlayers(+e.target.value)}
          />

          <h3>Cantidad de impostores:</h3>
          <input
            type="number"
            min={1}
            value={impostors}
            onChange={(e) => setImpostors(+e.target.value)}
          />

          <h3>Palabra para esta ronda (opcional):</h3>
          <input
            type="text"
            value={word}
            placeholder="Palabra opcional"
            onChange={(e) => setWord(e.target.value)}
          />

          <br />
          <button className="boton" onClick={crearPartida}>
            Crear
          </button>

          {gameCode && (
            <>
              <h2>CÓDIGO: {gameCode}</h2>

              <button className="boton" onClick={iniciar}>
                INICIAR PARTIDA
              </button>
              <button className="boton" onClick={siguienteRonda}>
                SIGUIENTE RONDA
              </button>
              <button className="boton" onClick={finalizar}>
                FINALIZAR PARTIDA
              </button>

              {/* LISTA DE JUGADORES */}
              <h2 style={{ marginTop: "30px" }}>Jugadores Unidos:</h2>
              <button className="boton" onClick={() => actualizarInfo()}>
                Actualizar
              </button>

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
                      {shownRoles[p.name]
                        ? p.role ?? "SIN ROL"
                        : "— — —"}
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

          {!isJoined ? (
            <>
              <input
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Código"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />

              <button className="boton" onClick={unirse}>
                Unirse a la partida
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>{name}</strong> unido a la partida{" "}
                <strong>{joinCode}</strong>
              </p>

              <button className="boton" onClick={mostrarRol}>
                Mostrar rol
              </button>

              <button className="boton" onClick={salir}>
                Abandonar partida
              </button>

              <h3>Estado: {status ?? "DESCONOCIDO"}</h3>
              <h3>Ronda: {round ?? "-"}</h3>   {/* 👈 ronda visible para el jugador */}
              <h2>
                {role === null
                  ? "La partida no ha sido iniciada"
                  : role
                    ? `Tu rol es: ${role}`
                    : "Pulsa 'Mostrar rol' para ver tu rol"}
              </h2>
            </>
          )}
        </>
      )}

      {/* ANIMACIÓN DE REVELACIÓN */}
      {showReveal && role && (
        <div className="reveal-overlay">
          <div
            className={
              "reveal-card " +
              (role === "IMPOSTOR" ? "reveal-impostor" : "reveal-crewmate")
            }
          >
            {role === "IMPOSTOR" ? "IMPOSTOR" : `Palabra: ${role}`}
          </div>
        </div>
      )}
    </main>
  );
}
