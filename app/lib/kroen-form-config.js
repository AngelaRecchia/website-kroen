import labels from "./kroen-labels.json";

const FORM_TYPES = ["tessera", "contatti"];

/** @param {string} [formType] */
export function getKroenFormConfig(formType) {
  if (formType && labels.form[formType]) {
    return labels.form[formType];
  }
  return labels.form.tessera;
}

export { FORM_TYPES, labels as kroenLabels };
