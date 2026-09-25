import { NextResponse } from "next/server";

const FIELD_MAP: Record<string, string | undefined> = {
  nome: process.env.GOOGLE_FORM_TESSERA_ENTRY_NOME,
  cognome: process.env.GOOGLE_FORM_TESSERA_ENTRY_COGNOME,
  sesso: process.env.GOOGLE_FORM_TESSERA_ENTRY_SESSO,
  nascita: process.env.GOOGLE_FORM_TESSERA_ENTRY_NASCITA,
  luogo_nascita: process.env.GOOGLE_FORM_TESSERA_ENTRY_LUOGO_NASCITA,
  richiesta_alias: process.env.GOOGLE_FORM_TESSERA_ENTRY_RICHIESTA_ALIAS,
  genere_alias: process.env.GOOGLE_FORM_TESSERA_ENTRY_GENERE_ALIAS,
  email: process.env.GOOGLE_FORM_TESSERA_ENTRY_EMAIL,
  cell: process.env.GOOGLE_FORM_TESSERA_ENTRY_CELL,
  residenza_via: process.env.GOOGLE_FORM_TESSERA_ENTRY_RESIDENZA_VIA,
  residenza_comune: process.env.GOOGLE_FORM_TESSERA_ENTRY_RESIDENZA_COMUNE,
  residenza_cap: process.env.GOOGLE_FORM_TESSERA_ENTRY_RESIDENZA_CAP,
  residenza_stato: process.env.GOOGLE_FORM_TESSERA_ENTRY_RESIDENZA_STATO,
};

export async function POST(request: Request) {
  const actionUrl = process.env.GOOGLE_FORM_TESSERA_ACTION_URL;

  if (!actionUrl) {
    return NextResponse.json(
      { error: "Form non configurato (manca GOOGLE_FORM_TESSERA_ACTION_URL)." },
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
    if (!entryId || body[key] == null || body[key] === "") continue;
    params.set(entryId, String(body[key]));
  }

  if ([...params.keys()].length === 0) {
    return NextResponse.json(
      { error: "Nessun campo mappato. Verifica GOOGLE_FORM_TESSERA_ENTRY_*." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(actionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "manual",
    });

    if (res.status >= 400 && res.status !== 302) {
      return NextResponse.json({ error: "Google Form ha rifiutato l'invio." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore di rete verso Google Form." }, { status: 502 });
  }
}
