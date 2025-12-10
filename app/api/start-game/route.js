import { games } from "../store";

export async function POST(req) {
  const { code } = await req.json();
  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  game.status = "JUGANDO";

  return Response.json({ ok: true });
}
