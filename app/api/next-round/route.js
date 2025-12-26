import { games } from "../store";
import { randomNoun } from "../words";

function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export async function POST(req) {
  const { code, word } = await req.json();
  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  const trimmed = word?.trim();
  const chosenWord = (trimmed && trimmed.length > 0 ? trimmed : randomNoun()) || randomNoun();
  game.word = chosenWord.toUpperCase();

  const count = game.assigned.length;
  const impostoresCount = Math.min(game.impostors, count);

  const roles = [
    ...Array(impostoresCount).fill("IMPOSTOR"),
    ...Array(count - impostoresCount).fill(game.word),
  ];

  const mezclados = mezclar(roles);

  game.assigned = game.assigned.map((p, i) => ({
    ...p,
    role: mezclados[i] || null,
  }));

  game.status = "JUGANDO";
  game.round = (game.round || 1) + 1;

  return Response.json({ ok: true, round: game.round, word: game.word });
}
