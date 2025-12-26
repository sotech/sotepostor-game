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

  const count = game.assigned.length;
  if (count === 0) {
    return Response.json(
      { error: "No hay jugadores unidos" },
      { status: 400 }
    );
  }

  const trimmed = word?.trim();
  const chosenWord = (trimmed && trimmed.length > 0 ? trimmed : game.word) || randomNoun();
  game.word = chosenWord.toUpperCase();

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

  return Response.json({ ok: true });
}
