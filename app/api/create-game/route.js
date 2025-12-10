import { games } from "../store";

function generarCodigo() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req) {
  const body = await req.json();
  const { players, impostors, word } = body;

  const code = generarCodigo();

  games[code] = {
    players,
    impostors,
    word,
    assigned: [],
  };

  return Response.json({ code });
}
