import { games } from "../store";

function generarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function obtenerPalabra() {
  const res = await fetch("https://api.datamuse.com/words?sp=*&v=es&md=p&max=2000");
  const data = await res.json();

  const nouns = data.filter((w) => w?.tags?.includes("n"));
  if (!nouns.length) return "PALABRA";

  const rnd = Math.floor(Math.random() * nouns.length);
  return nouns[rnd].word;
}

export async function POST(req) {
  const body = await req.json();
  let { players, impostors, word } = body;

  if (!word || word.trim() === "") {
    word = await obtenerPalabra();
  }

  const code = generarCodigo();

  games[code] = {
    players,
    impostors,
    word: word.toUpperCase(),
    status: "ESPERA",
    round: 1,
    assigned: [],
  };

  return Response.json({ code, word: games[code].word, round: games[code].round });
}
