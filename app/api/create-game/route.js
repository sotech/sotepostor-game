import { games } from "../store";
import { randomNoun } from "../words";

function generarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req) {
  const body = await req.json();
  let { players, impostors, word } = body;

  const trimmed = word?.trim();
  const chosenWord = trimmed && trimmed.length > 0 ? trimmed : randomNoun();

  const code = generarCodigo();

  games[code] = {
    players,
    impostors,
    word: chosenWord.toUpperCase(),
    status: "ESPERA",
    round: 1,
    assigned: [],
  };

  return Response.json({ code, word: games[code].word, round: games[code].round });
}
