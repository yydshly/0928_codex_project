import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { getUiLanguage, saveUiLanguage, uiText, type UiLanguage } from "./uiText";

/** Local UI language selector; explicit reload avoids losing drafts unexpectedly. */
export function LanguageSettings() {
  const current = getUiLanguage();
  const [language, setLanguage] = useState<UiLanguage>(current);
  const [error, setError] = useState<string | null>(null);
  return (
    <section className="mb-6 rounded-xl border border-border p-5" aria-labelledby="ui-language-title" data-testid="ui-language-settings">
      <h2 id="ui-language-title" className="text-base font-semibold">{uiText("Interface language")} / Language</h2>
      <p className="mt-2 text-sm text-muted-foreground">{uiText("Choose the language of buttons, menus, and settings. Your messages and names stay as written.")}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label htmlFor="ui-language-select" className="text-sm">{uiText("Language")}</label>
        <select id="ui-language-select" className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={language} onChange={(event) => setLanguage(event.target.value as UiLanguage)}>
          <option value="zh-CN">简体中文</option>
          <option value="en">English</option>
        </select>
        <Button disabled={language === current} onClick={() => {
          try {
            saveUiLanguage(language);
            window.location.reload();
          } catch {
            setError(uiText("Could not save the language. Please try again."));
          }
        }}>{uiText("Save and reload")}</Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{uiText("Save unfinished edits before reloading. This Chinese edition is a local research modification of Buzz.")}</p>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </section>
  );
}
