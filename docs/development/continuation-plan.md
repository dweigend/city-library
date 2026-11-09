# Nächste Integrations- und Entwicklungsaufgaben

Modelle, UI-Bindungen, Anleitungen und modellspezifische Quellen liegen unter `models/<slug>`. Svelte ist die einzige Oberfläche; `bun run dev` startet den Lab.

[PLAN](../../PLAN.md) beschreibt den aktuellen Umfang. Die [Fortschrittsdatei](../../models/catalog/progress-summary.json) besitzt die Abnahmezahlen; Implementierung, Browserprüfung, Originalvergleich und wissenschaftliche Abnahme bleiben getrennte Anforderungen.

## Das aktuelle Integrationspaket abschließen

1. Veraltete Links, widersprüchliche Angaben und doppelte Zuständigkeiten entfernen. Quellen, Lizenztexte, eingefrorene Beispiele und benötigte Abnahmebelege erhalten; historische Arbeitsprotokolle gehören nicht in die gepflegte Dokumentation.
2. Funktion und Komplexität unabhängig prüfen lassen: „Geht es einfacher? Wie wäre es KISS?“ Für dieses Paket gilt Claude Opus 5.5 mit mittlerem Reasoning. Befunde beheben und den endgültigen PR-Diff erneut unabhängig prüfen lassen.
3. `bun run check`, `bun run build:ui` und `bun models/catalog/progress.ts verify` ausführen. Browserabläufe und Screenshots belegen die tatsächlich geprüften Zustände; sie ersetzen keine vollständige Modellabnahme.
4. Commit, Push und Pull Request bereitstellen, GitHub-Prüfungen abschließen. Erst nach ausdrücklicher Freigabe des konkreten PR nach `main` mergen. Paketveröffentlichung und das Löschen aktiver Worktrees sind nicht Teil dieses Pakets.

## Danach gezielt weiterarbeiten

- Fehlende Abnahmebelege vorhandener Modelle mit dem [Katalog](../../models/catalog/README.md) abgleichen. Nur tatsächlich belegte Stufen aktualisieren.
- UI-Restliste mit [API-Tabelle](../ui/api-table.md), Komponenten und Browserbelegen abgleichen. Schnellen Modellwechsel, Lade-/Ausführungsfehler, Tastatur und Fokus sowie schmale Ansichten in beiden Themes vollständig prüfen.
- Die [API-Coverage](coverage.md) mit öffentlichen Exporten und ausführbaren Beispielen abgleichen; vorhandene Funktionen nicht erneut implementieren.
- Den offenen Umfang direkter Modellprozeduren anhand der [Prozedurübersicht](model-function-encapsulation.md) klären, bevor neue APIs entstehen.
- Neue Modelle nur in einer kleinen ausgewählten Gruppe ergänzen. Die vollständige Katalogauswahl ist kein Auftrag, alle fehlenden Modelle in dieses Integrationspaket aufzunehmen.

## Offene Zielverträge erhalten

Das Quartiersziel braucht `geometry.corridor`, `geometry.subtract` und `geometry.subdivide`. Giant Component benötigt sein Modell. Die zugehörigen Zielprüfungen bleiben getrennt vom grünen Standardgate; ihre Assertions werden nicht abgeschwächt:

```sh
bun run examples:city:targets
bun run typecheck:city:targets
bun run typecheck:giant-component:targets
```

Neue Fähigkeiten beginnen mit vier oder fünf öffentlichen, assertierten Beispielen gemäß [Example-first-Gate](../../PLAN.md#example-first-delivery-gate). Die strukturelle Konsolidierung schließt diese Entwicklungsziele oder wissenschaftliche Prüfungen nicht ab.
