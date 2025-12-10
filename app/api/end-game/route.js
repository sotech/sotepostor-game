import { games } from "../store";

export async function POST(req) {
  const { code } = await req.json();
  delete games[code];
  return Response.json({ ok: true });
}
