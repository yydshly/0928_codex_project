import catalog from "./zh-CN.json";

export type UiLanguage = "zh-CN" | "en";
const STORAGE_KEY = "buzz-ui-language.v1";
const messages: Readonly<Record<string, string>> = catalog;

/** Read the local interface preference. This research edition defaults to Chinese. */
export function getUiLanguage(): UiLanguage {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh-CN";
  } catch {
    return "zh-CN";
  }
}

/** Translate only source-authored presentation text, with positional values. */
export function uiText(source: string, values: readonly unknown[] = []): string {
  const message = getUiLanguage() === "zh-CN" ? (messages[source] ?? source) : source;
  const entities: Record<string, string> = { apos: "'", quot: '"', gt: ">", lt: "<", amp: "&" };
  return message.replace(/&(apos|quot|gt|lt|amp);/g, (_token, name: string) => entities[name]).replace(/\{(\d+)\}/g, (token, index: string) =>
    Number(index) < values.length ? String(values[Number(index)] ?? "") : token,
  );
}

/** Persist a language; failures propagate so the control can display an error. */
export function saveUiLanguage(language: UiLanguage): void {
  localStorage.setItem(STORAGE_KEY, language);
}

/** Expose the selected language to screen readers before rendering the app. */
export function initializeUiLanguage(): void {
  document.documentElement.lang = getUiLanguage();
}
