import { games } from "../store";

export async function POST(req) {
  const { code } = await req.json();
  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  return Response.json({
    players: game.players,
    impostors: game.impostors,
    word: game.word,
    status: game.status,
    round: game.round,
    assigned: game.assigned,
  });
}
