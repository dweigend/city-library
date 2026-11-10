# Nächste Migrations- und Entwicklungsaufgaben

Die strukturelle Migration ist auf `main`: Modelle und Quellen liegen unter `models/<slug>`, Svelte ist die einzige Oberfläche, und eine Root-tsconfig prüft den gemeinsamen Stand. Diese Arbeit wird nicht erneut umgesetzt.

145 Modellpaare bedeuten 125 Implementierungen aus der festen NetLogo-Auswahl plus zwanzig zusätzliche Stadtbeispiele. Die zusätzlichen Beispiele ersetzen keine fehlenden Auswahlmodelle. Die [Fortschrittsdatei](../../models/catalog/progress-summary.json) besitzt die Abnahmezahlen; technische Funktion, Quellenvergleich und wissenschaftliche Abnahme bleiben getrennt.

## In dieser Reihenfolge vorbereiten und umsetzen

1. Den [API-Abgleich](coverage.md#source-reconciliation-and-remaining-scope) pro Eintrag vervollständigen. Die Spezifikation nennt 309 Einträge, die Tabelle enthält derzeit 312 Überschriften; Umfang und Überladungen explizit klären, nichts stillschweigend streichen. Vorhandene Funktionen und Belege zuerst zuordnen.
2. Fehlende Abnahmestufen der vorhandenen Auswahlmodelle mit ihren Belegen abgleichen. Die zwanzig Stadtbeispiele bleiben gesondert. Danach tatsächliche Prüflücken in kleinen Modellgruppen schließen.
3. Die gemeinsame UI anhand ihrer [Verträge](../ui/api-table.md) vollständig prüfen: schneller Modellwechsel, Setup-Erholung, Lade-/Laufzeitfehler, Timerbereinigung, Tastatur/Fokus und Auswahl. Betroffene Ansichten in Desktop/schmal und hell/dunkel unabhängig ansehen lassen.
4. Giant Component als erste kleine fehlende Modellgruppe prüfen: vier eingefrorene Zielskripte sind vorhanden. Quellenvertrag und echte API-Abhängigkeiten klären, bevor Runtime entsteht. Weitere Auswahlmodelle nach tatsächlichen Abhängigkeiten gruppieren.
5. Quartiersgeometrie nach dem [verbindlichen Ablauf](example-first/PLAN.md#geometry-and-topology-delivery-sequence) ergänzen: Straßenkorridore und Subtraktion vor begrenzter Unterteilung. Die akzeptierten Quartiersassertions bleiben unverändert.
6. Übrige Kern-, Daten- und Stadtfähigkeiten in den [vorbereiteten Arbeitspaketen](../../PLAN.md#remaining-migration-sequence) liefern. Bereits vorhandene Agenda-, History-, Studien- und Kapazitätsfunktionen wiederverwenden; kein zweites Ausführungs- oder Zustandsmodell aufbauen.

Der genaue Zugriff auf einzelne Modellprozeduren bleibt eine [offene API-Entscheidung](model-function-encapsulation.md). Speicher-/Node-Studien-Unterpfade und vollständige Fortsetzung brauchen ebenfalls ihre eigenen Verträge. Offene Entscheidungen blockieren nur die betroffenen Erweiterungen.

## Prüf- und Abnahmerhythmus

Vor jedem betroffenen Bibliotheks- oder Modellschritt die Refactor-Skills und gemeinsamen Coding-Standards anwenden; bei Schritten über beide Grenzen beide Skills nutzen. Gemini 3.8 Flash prüft wesentliche Entwürfe und Implementierungen unabhängig. Opus 5.5 mit mittlerem Reasoning übernimmt die Abnahmen und prüft bei API-Erweiterungen, abgeschlossenen Funktionsfamilien und vor Integration erneut: „Geht es einfacher? Wie wäre es KISS bei gleicher Funktionalität?“ Befunde beheben und wesentliche Änderungen unabhängig nachprüfen lassen.

Architekturregeln zu Headless-Code, Abhängigkeitsrichtung, Identität und einem Zustandsowner bei jedem wesentlichen Schritt prüfen. Bei UI-Arbeit zusätzlich Design-Skills, Designregeln und echte Browser-/Screenshot-Abnahme anwenden. Bestehende öffentliche Syntax, RNG-Reihenfolge und Tick-/Fehlersemantik nicht als Vereinfachung verändern. Neue APIs beginnen mit vier oder fünf eingefrorenen öffentlichen Beispielen.

`bun run check`, `bun run build:ui` und `bun models/catalog/progress.ts verify` sind die regulären technischen Prüfungen. Quartier und Giant haben bis zur tatsächlichen Umsetzung getrennte rote Zielprüfungen: `bun run typecheck:city:targets`, `bun run contracts:city:targets` und `bun run typecheck:giant-component:targets`. Erfüllte Ziele erst nach echter Abnahme in das Standardgate aufnehmen.

Jeder konkrete PR benötigt den unabhängig geprüften endgültigen Diff, grüne GitHub-Prüfungen und eine ausdrückliche Mergefreigabe. Veröffentlichung und das Löschen aktiver Worktrees bleiben eigene Entscheidungen.
