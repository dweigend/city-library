**P1 und P2 sind im geprüften Svelte-Korrekturumfang geschlossen. Keine verbleibenden konkreten Blocker in `d069be3` gefunden.**

- **P1:** Live-`enabled` wird vor dem Besitzerwechsel geprüft. Abgelehnte Kandidaten werden entsorgt; bisheriger Besitzer und Epoche bleiben erhalten. Scheitert die Projektion erst nach dem Wechsel, veröffentlicht der callbackfreie Fallback den neuen Besitzerzustand samt aktueller Beobachtung und Epoche. Der alte Store mit inzwischen entsorgtem Besitzer wird nicht übernommen.
- **P2:** Dauerhafte Formatterfehler entkommen Draft-/Speed-Edits nicht mehr. Die Veröffentlichung enthält aktuelle Entwürfe, Pending-Markierung und Geschwindigkeit; der Primärfehler bleibt erhalten. Ein erfolgreicher Restart verwendet den sichtbaren Entwurf und löscht den Fehler. Aktionen nach Disposal bleiben wirkungslos.

**Selbst ausgeführt:** `bun test tests/ui-authoring.test.ts` — **11 bestanden, 53 Assertions**, einschließlich Wealth-Fällen mit echtem Svelte-Client-Scheduler. HEAD `5ac1502` enthält gegenüber `d069be3` ausschließlich zusätzliche Evidenz; der Session-Quellhash stimmt mit dem hinterlegten Nachweis überein.

Die geprüften Browser-Rohbelege stützen die Svelte-Korrektur einschließlich Post-Preflight-Fehler und nachfolgender Bearbeitung. **Wichtige Reichweitengrenze:** Die Legacy-Belege zeigen weiterhin partielle beziehungsweise alte Darstellung im Fehlerfall. Daraus folgt keine hostübergreifende Zusage stets aktueller Tabellen; dieser unveränderte Legacy-Pfad ist kein neuer Befund gegen die geprüfte Session-Korrektur.

Keine Dateien geändert, keine Subagents und keine breiten Tests. Browserläufe wurden hier **nicht erneut ausgeführt**, Screenshots nicht visuell abgenommen.

Separat offen bleiben unabhängige Bildprüfung der neuen Fehlerzustände, 200er-Ledger-Abgleich, Public-Procedure-Auslegung sowie finale Gesamt-/Consumer-/Build-Checks und CI. Diese Review erteilt **keine wissenschaftliche, visuelle oder Main-Merge-Freigabe**.