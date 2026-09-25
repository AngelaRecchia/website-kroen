"use client";

import { storyblokEditable } from "@storyblok/react";
import { useState } from "react";
import { getKroenFormConfig } from "../../lib/kroen-form-config";
import {
  getVisibleKroenFormFields,
  isKroenFormFieldVisible,
} from "../../lib/kroen-form-fields";
import "./KroenForm.scss";

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function fieldValue(values, name) {
  const raw = values[name];
  return typeof raw === "string" ? raw.trim() : (raw ?? "");
}

export default function KroenForm({ blok, introHtml }) {
  const formType = blok.form_type === "contatti" ? "contatti" : "tessera";
  const config = getKroenFormConfig(formType);
  const {
    title,
    submit_label,
    success_title,
    success_text,
    privacy_label,
    privacy_error,
    fields = [],
  } = config;

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [privacy, setPrivacy] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const isTessera = formType === "tessera";
  const apiPath = isTessera ? "/api/forms/tessera" : "/api/forms/contatti";
  const visibleFields = getVisibleKroenFormFields(fields, values);
  const heading =
    typeof blok.titolo === "string" && blok.titolo.trim()
      ? blok.titolo.trim()
      : title;

  function setFieldValue(name, value) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "richiesta_alias" && value !== "si") {
        delete next.genere_alias;
      }
      return next;
    });
  }

  function validate() {
    const next = {};
    for (const field of fields) {
      if (!isKroenFormFieldVisible(field, values)) continue;
      const v = fieldValue(values, field.name);
      if (field.required && !v) next[field.name] = field.error;
      if (field.type === "email" && v && !validateEmail(v)) {
        next[field.name] = field.error;
      }
    }
    if (isTessera && privacy_label && !privacy) {
      next.privacy = privacy_error ?? "Serve il consenso per procedere.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...values };
    for (const field of fields) {
      if (!isKroenFormFieldVisible(field, payload)) {
        delete payload[field.name];
      }
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, privacy: privacy || undefined }),
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

  if (status === "success" && isTessera && success_title) {
    return (
      <div {...storyblokEditable(blok)} className="block" role="status">
        <p className="display t-h3">{success_title}</p>
        {success_text && <p className="prose">{success_text}</p>}
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
        {heading}
      </h2>

      {introHtml && (
        <div
          className="form-intro prose"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      )}

      {visibleFields.map((field) => (
        <div
          key={field.name}
          className={`field${errors[field.name] ? " is-bad" : ""}`}
        >
          <label htmlFor={`${blok._uid}-${field.name}`}>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              id={`${blok._uid}-${field.name}`}
              name={field.name}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(ev) => setFieldValue(field.name, ev.target.value)}
            />
          ) : field.type === "select" ? (
            <select
              id={`${blok._uid}-${field.name}`}
              name={field.name}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(ev) => setFieldValue(field.name, ev.target.value)}
            >
              {field.placeholderOption !== undefined && (
                <option value="">{field.placeholderOption}</option>
              )}
              {(field.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${blok._uid}-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(ev) => setFieldValue(field.name, ev.target.value)}
            />
          )}
          {errors[field.name] && (
            <span className="form-msg is-err" role="alert">
              {errors[field.name]}
            </span>
          )}
        </div>
      ))}

      {isTessera && privacy_label && (
        <div className={`field field--check${errors.privacy ? " is-bad" : ""}`}>
          <label className="field-check">
            <input
              type="checkbox"
              name="privacy"
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
