import labels from "./kroen-labels.json";

/** @param {string} path Es. `event.open_time` */
export function kroenLabel(path) {
  const value = path.split(".").reduce((node, key) => node?.[key], labels);
  return typeof value === "string" ? value : path;
}
