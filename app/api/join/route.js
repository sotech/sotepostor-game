import { games } from "../store";

function asignarImpostorRandom(game) {
  const totalAsignados = game.assigned.length;
  const impostoresAsignados = game.assigned.filter(
    (p) => p.role === "IMPOSTOR"
  ).length;

  const quedanImpostores = game.impostors - impostoresAsignados;
  const quedanJugadores = game.players - totalAsignados;

  if (quedanImpostores <= 0) return false;
  if (quedanJugadores <= quedanImpostores) return true;

  return Math.random() < 0.3;
}

export async function POST(req) {
  const body = await req.json();
  const { code, name } = body;

  const game = games[code];

  if (!game) {
    return Response.json({ error: "Partida no encontrada" }, { status: 404 });
  }

  const yaExiste = game.assigned.find((p) => p.name === name);
  if (yaExiste) {
    return Response.json(
      { error: "Este jugador ya recibió su rol" },
      { status: 400 }
    );
  }

  if (game.assigned.length >= game.players) {
    return Response.json(
      { error: "La partida ya está completa" },
      { status: 400 }
    );
  }

  const esImpostor = asignarImpostorRandom(game);

  const role = esImpostor ? "IMPOSTOR" : game.word;

  game.assigned.push({ name, role });

  return Response.json({ role });
}
