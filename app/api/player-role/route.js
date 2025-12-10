import { games } from "../store";

export async function POST(req) {
  const body = await req.json();
  const { code, name } = body;

  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  const player = game.assigned.find((p) => p.name === name);

  if (!player) {
    return Response.json(
      { error: "Jugador no encontrado en esta partida" },
      { status: 404 }
    );
  }

  return Response.json({
    role: player.role,
    status: game.status || null,
    round: game.round || 1,
  });
}
