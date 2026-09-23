"use client";

import { storyblokEditable } from "@storyblok/react";
import { useState } from "react";

const TESSERA_FIELDS = [
  { name: "nome", label: "Nome", type: "text", autoComplete: "given-name", required: true, error: "Scrivi il tuo nome." },
  { name: "cognome", label: "Cognome", type: "text", autoComplete: "family-name", required: true, error: "Scrivi il tuo cognome." },
  { name: "nascita", label: "Data di nascita", type: "date", autoComplete: "bday", required: true, error: "Inserisci la data di nascita." },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true, placeholder: "nome@esempio.it", error: "Inserisci un'email valida, ad esempio nome@esempio.it." },
];

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function KroenForm({ blok }) {
  const {
    form_type = "tessera",
    title = "Richiedi la tessera",
    submit_label = "Richiedi la tessera",
    event_options = [],
    success_title = "Richiesta inviata",
    success_text = "Ritira la tessera al Colorificio Kroen la sera del concerto.",
    privacy_label = "Ho letto l'informativa sulla privacy e accetto il trattamento dei miei dati per il tesseramento.",
  } = blok;

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const isTessera = form_type === "tessera";
  const apiPath = isTessera ? "/api/forms/tessera" : "/api/forms/contatti";

  function validate() {
    const next = {};
    if (isTessera) {
      for (const field of TESSERA_FIELDS) {
        const v = values[field.name]?.trim?.() ?? values[field.name] ?? "";
        if (field.required && !v) next[field.name] = field.error;
        if (field.type === "email" && v && !validateEmail(v)) {
          next[field.name] = field.error;
        }
      }
      if (!values.evento) next.evento = "Scegli il concerto.";
      if (!privacy) next.privacy = "Serve il consenso per procedere.";
    } else {
      if (!values.nome?.trim()) next.nome = "Scrivi il tuo nome.";
      if (!values.email?.trim() || !validateEmail(values.email)) {
        next.email = "Inserisci un'email valida.";
      }
      if (!values.messaggio?.trim()) next.messaggio = "Scrivi un messaggio.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, privacy: privacy || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Invio non riuscito.");
      }
      setStatus("success");
      setValues({});
      setPrivacy(false);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Errore di rete.");
    }
  }

  if (status === "success" && isTessera) {
    return (
      <div {...storyblokEditable(blok)} className="block" role="status">
        <p className="display t-h3">{success_title}</p>
        <p className="prose">{success_text}</p>
        <button
          type="button"
          className="btn mt-6"
          onClick={() => setStatus("idle")}
        >
          Fai un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form
      {...storyblokEditable(blok)}
      className="form block"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={`form-${blok._uid}`}
    >
      <h2 className="display t-h3" id={`form-${blok._uid}`}>
        {title}
      </h2>

      {isTessera ? (
        <>
          {TESSERA_FIELDS.map((field) => (
            <div
              key={field.name}
              className={`field${errors[field.name] ? " is-bad" : ""}`}
            >
              <label htmlFor={`${blok._uid}-${field.name}`}>{field.label}</label>
              <input
                id={`${blok._uid}-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(ev) =>
                  setValues((v) => ({ ...v, [field.name]: ev.target.value }))
                }
              />
              {errors[field.name] && (
                <span className="form-msg is-err" role="alert">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}

          <div className={`field${errors.evento ? " is-bad" : ""}`}>
            <label htmlFor={`${blok._uid}-evento`}>Per quale concerto</label>
            <select
              id={`${blok._uid}-evento`}
              name="evento"
              required
              value={values.evento ?? ""}
              onChange={(ev) =>
                setValues((v) => ({ ...v, evento: ev.target.value }))
              }
            >
              <option value="">Scegli il concerto</option>
              {event_options.map((opt) => (
                <option key={opt._uid} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.evento && (
              <span className="form-msg is-err" role="alert">
                {errors.evento}
              </span>
            )}
          </div>

          <div className={`field${errors.privacy ? " is-bad" : ""}`}>
            <label className="flex gap-3 items-start cursor-pointer">
              <input
                type="checkbox"
                checked={privacy}
                onChange={(ev) => setPrivacy(ev.target.checked)}
              />
              <span>{privacy_label}</span>
            </label>
            {errors.privacy && (
              <span className="form-msg is-err" role="alert">
                {errors.privacy}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          {[
            { name: "nome", label: "Nome", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "messaggio", label: "Messaggio", type: "textarea" },
          ].map((field) => (
            <div
              key={field.name}
              className={`field${errors[field.name] ? " is-bad" : ""}`}
            >
              <label htmlFor={`${blok._uid}-${field.name}`}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  id={`${blok._uid}-${field.name}`}
                  name={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(ev) =>
                    setValues((v) => ({ ...v, [field.name]: ev.target.value }))
                  }
                />
              ) : (
                <input
                  id={`${blok._uid}-${field.name}`}
                  name={field.name}
                  type={field.type}
                  value={values[field.name] ?? ""}
                  onChange={(ev) =>
                    setValues((v) => ({ ...v, [field.name]: ev.target.value }))
                  }
                />
              )}
              {errors[field.name] && (
                <span className="form-msg is-err" role="alert">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </>
      )}

      {message && (
        <p className="form-msg is-err" role="alert">
          {message}
        </p>
      )}

      <div>
        <button className="btn" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Invio…" : submit_label}
        </button>
      </div>
    </form>
  );
}
