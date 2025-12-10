import { games } from "../store";

async function obtenerPalabra() {
  const res = await fetch("https://api.datamuse.com/words?sp=*&v=es&max=1");
  const data = await res.json();
  return data[0]?.word || "PALABRA";
}

function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}

export async function POST(req) {
  const { code } = await req.json();
  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  const word = await obtenerPalabra();
  game.word = word.toUpperCase();

  const roles = [
    ...Array(game.impostors).fill("IMPOSTOR"),
    ...Array(game.players - game.impostors).fill(game.word),
  ];

  const mezclados = mezclar(roles);

  game.assigned = game.assigned.map((p, i) => ({
    ...p,
    role: mezclados[i],
  }));

  game.status = "JUGANDO";

  return Response.json({ ok: true, word: game.word });
}
