import { games } from "../store";

function generarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function obtenerPalabra() {
  const res = await fetch("https://api.datamuse.com/words?sp=*&v=es&max=1");
  const data = await res.json();
  return data[0]?.word || "PALABRA";
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
    assigned: [],
  };

  return Response.json({ code, word: games[code].word });
}
