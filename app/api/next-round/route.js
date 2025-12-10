import { games } from "../store";

async function obtenerPalabra() {
  try {
    const res = await fetch(
      "https://api.datamuse.com/words?sp=*&v=es&md=p&max=2000"
    );

    if (!res.ok) {
      console.error("Error al llamar a Datamuse:", res.status);
      return "PALABRA";
    }

    const data = await res.json();
    const nouns = data.filter((w) => w?.tags?.includes("n"));

    if (!nouns.length) return "PALABRA";

    const rnd = Math.floor(Math.random() * nouns.length);
    return nouns[rnd].word;
  } catch (e) {
    console.error("Error en obtenerPalabra:", e);
    return "PALABRA";
  }
}

function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export async function POST(req) {
  const { code } = await req.json();
  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  const word = await obtenerPalabra();
  game.word = word.toUpperCase();

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
