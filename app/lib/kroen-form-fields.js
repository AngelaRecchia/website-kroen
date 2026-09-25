/** @param {Record<string, string>} values */
export function isKroenFormFieldVisible(field, values) {
  if (!field.showWhen) return true;
  return values[field.showWhen.field] === field.showWhen.value;
}

/** @param {Record<string, string>} values */
export function getVisibleKroenFormFields(fields, values) {
  return fields.filter((field) => isKroenFormFieldVisible(field, values));
}
