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
  const [round, setRound] = useState<number | null>(null); // ronda actual
  const [isJoined, setIsJoined] = useState<boolean>(false);

  // Animacion de revelacion
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
      // Podriamos usar data.round para mostrar tambien en admin si quisieras
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
    setRole(data.role); // null al principio
    setStatus(data.status || null);
    setRound(data.round ?? null); // guardamos ronda actual
  }

  // Mostrar rol (consulta nuevamente al backend por si ya se asigno)
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
    setRound(data.round ?? round); // actualizamos ronda tambien

    // Si ahora se asigno rol, mostramos animacion
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
    setRound(null);
    setIsJoined(false);
    setShowReveal(false);
  }

  // --------------------------------------------------------
  // UI
  // --------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-content">
        {/* ================================================
            PANTALLA INICIAL
        ================================================== */}
        {!mode && (
          <div className="landing">
            <h1>SOTEPOSTOR</h1>

            <button className="boton" onClick={() => setMode("crear")}>
              CREAR PARTIDA
            </button>

            <button className="boton" onClick={() => setMode("unirse")}>
              UNIRSE A PARTIDA
            </button>
          </div>
        )}

        {/* ================================================
            CREAR PARTIDA (ADMIN)
        ================================================== */}
        {mode === "crear" && (
          <div className="admin-section">
            <h1 className="page-title">Panel de administrador</h1>

            <div className="admin-grid">
              <div className="card">
                <h2>Configurar partida</h2>

                <div className="field-group">
                  <label className="field-label">Cantidad de jugadores</label>
                  <input
                    type="number"
                    value={players}
                    onChange={(e) => setPlayers(+e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Cantidad de impostores</label>
                  <input
                    type="number"
                    min={1}
                    value={impostors}
                    onChange={(e) => setImpostors(+e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Palabra (opcional)</label>
                  <input
                    type="text"
                    value={word}
                    placeholder="Palabra opcional"
                    onChange={(e) => setWord(e.target.value)}
                  />
                </div>

                <button className="boton full-width" onClick={crearPartida}>
                  Crear
                </button>
              </div>

              <div className="card code-card">
                <h2>Codigo</h2>

                {gameCode ? (
                  <>
                    <p className="game-code">{gameCode}</p>

                    <div className="button-row">
                      <button className="boton" onClick={iniciar}>
                        INICIAR PARTIDA
                      </button>
                      <button className="boton" onClick={siguienteRonda}>
                        SIGUIENTE RONDA
                      </button>
                      <button className="boton" onClick={finalizar}>
                        FINALIZAR PARTIDA
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="muted">
                    Genera el codigo creando la partida.
                  </p>
                )}
              </div>
            </div>

            {gameCode && (
              <div className="card players-card">
                <div className="players-header">
                  <div>
                    <h2>Jugadores unidos</h2>
                    <p className="muted">
                      Actualiza para sincronizar los roles asignados.
                    </p>
                  </div>
                  <button className="boton" onClick={() => actualizarInfo()}>
                    Actualizar
                  </button>
                </div>

                {gamePlayers.length === 0 ? (
                  <p className="muted">Todavia no hay jugadores unidos.</p>
                ) : (
                  <div className="players-list">
                    {gamePlayers.map((p, i) => (
                      <div className="player-row" key={i}>
                        <span className="player-name">{p.name}</span>

                        <span className="player-role">
                          {shownRoles[p.name] ? p.role ?? "SIN ROL" : "???"}
                        </span>

                        <div className="player-actions">
                          <button
                            className="boton"
                            onClick={() => toggleVisibility(p.name)}
                          >
                            {shownRoles[p.name] ? "OCULTAR" : "MOSTRAR"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================
            UNIRSE A PARTIDA
        ================================================== */}
        {mode === "unirse" && (
          <div className="card join-card">
            <h2>UNIRSE A PARTIDA</h2>

            {!isJoined ? (
              <>
                <input
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  placeholder="Codigo"
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
                <h3>Ronda: {round ?? "-"}</h3>
                <h2>
                  {role === null
                    ? "La partida no ha sido iniciada"
                    : role
                      ? `Tu rol es: ${role}`
                      : "Pulsa 'Mostrar rol' para ver tu rol"}
                </h2>
              </>
            )}
          </div>
        )}

        {/* ANIMACION DE REVELACION */}
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
      </div>
    </main>
  );
}
