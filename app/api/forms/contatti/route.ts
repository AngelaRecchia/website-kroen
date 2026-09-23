import { NextResponse } from "next/server";

const FIELD_MAP: Record<string, string | undefined> = {
  nome: process.env.GOOGLE_FORM_CONTATTI_ENTRY_NOME,
  email: process.env.GOOGLE_FORM_CONTATTI_ENTRY_EMAIL,
  messaggio: process.env.GOOGLE_FORM_CONTATTI_ENTRY_MESSAGGIO,
};

export async function POST(request: Request) {
  const actionUrl = process.env.GOOGLE_FORM_CONTATTI_ACTION_URL;

  if (!actionUrl) {
    return NextResponse.json(
      {
        error:
          "Form contatti non configurato. Imposta GOOGLE_FORM_CONTATTI_ACTION_URL o usa email dedicata.",
      },
      { status: 503 },
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload non valido." }, { status: 400 });
  }

  const params = new URLSearchParams();
  for (const [key, entryId] of Object.entries(FIELD_MAP)) {
    if (!entryId || body[key] == null) continue;
    params.set(entryId, String(body[key]));
  }

  try {
    const res = await fetch(actionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "manual",
    });

    if (res.status >= 400 && res.status !== 302) {
      return NextResponse.json({ error: "Invio non riuscito." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore di rete." }, { status: 502 });
  }
}
