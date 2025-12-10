import { games } from "../store";

export async function POST(req) {
  const { code, name } = await req.json();
  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  game.assigned = game.assigned.filter(p => p.name !== name);

  return Response.json({ ok: true });
}
