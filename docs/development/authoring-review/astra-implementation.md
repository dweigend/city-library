**Noch keine uneingeschränkte Implementierungsfreigabe: Zwei Fehlergrenzen bleiben offen.** Die wesentlichen früheren Designbefunde sind im Snapshot dagegen nachvollziehbar umgesetzt.

Geprüft: `0747555..da667f3`, frühere Astra-Befunde und Antworten. Keine Änderungen, Subagents oder breiten Tests. Zwei enge Reproduktionen liefen mit Bun und dem echten Svelte-Client-Scheduler; sie sind **keine Browserverifikation**. Uncommitted Netzwerk- und Reviewänderungen sind ausgeschlossen.

1. **P1 – Nach fehlgeschlagenem Neustart können Modellbesitzer und veröffentlichte Beobachtung auseinanderfallen.**  
   Die Kandidatenprüfung ruft Live-Getter, aber nicht Live-`enabled` auf. Anschließend werden Besitzer und Epoche ersetzt; `observe()` kann beim ersten `publish()` an `enabled` scheitern. Das `finally` entsorgt trotzdem den alten Besitzer. Scheitert auch die Fehlerpublikation, übernimmt deren Fallback den bisherigen Store einschließlich alter Beobachtung und Epoche.

   Reproduziert mit dem echten Wealth-Modell: erfolgreicher Start mit `people=2`, Neustart mit `people=3`, dessen Live-`enabled` wirft. Ergebnis: **zwei erzeugte Modelle, alter Besitzer entsorgt, sichtbare Beobachtung weiterhin `people=2`, Epoche weiterhin 1**, intern jedoch neuer Besitzer.

   Quellen: [session.ts:178](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/ui/svelte/session.ts:178), [session.ts:190](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/ui/svelte/session.ts:190), [session.ts:120](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/ui/svelte/session.ts:120).

   **Abnahme:** Fehler in Live-`enabled` beim ersten Setup und beim Restart prüfen. Besitzer, veröffentlichte Beobachtung, Epoche und Disposal müssen konsistent bleiben. Kein allgemeiner Rollback erforderlich: Der dokumentierte Fehlerzustand darf auch ohne aktiven Besitzer enden; er darf aber keinen entsorgten Besitzer als aktuellen darstellen. Die Lücke war teilweise bereits im Basispfad vorhanden und bleibt durch den neuen `flushSync`-Fix ungelöst.

2. **P2 – Setup-Edits nach Formatterfehler umgehen den Host-Fehlerpfad.**  
   `setDraft()` verändert den internen Entwurf und ruft ungeschützt `publish()` auf. Ein weiterhin werfender Formatter verhindert die Veröffentlichung und entkommt dem Eventhandler. Dasselbe Muster besteht bei weiteren Präsentationsaktionen wie `setSpeed()`.

   Reproduziert: Formatter wirft bei Tick 1; anschließender Setup-Edit von `people=2` auf 3 wirft erneut. Der Store zeigt weiterhin Entwurf 2, der folgende Restart verwendet dennoch 3. Das verletzt die konsistente Darstellung des ausstehenden Entwurfs.

   Quelle: [session.ts:200](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/ui/svelte/session.ts:200), [session.ts:222](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/ui/svelte/session.ts:222).

   **Abnahme:** Nach Formatterfehler Setup bearbeiten, Geschwindigkeit ändern und neu starten: keine ungefangenen Fehler, sichtbarer Entwurf entspricht dem verwendeten Wert, ursprüngliche Fehlermeldung bleibt nachvollziehbar. Engen Regressionstest und betroffenen Browserflow ergänzen.

Im übrigen geprüften Quellumfang:

- `NoInfer` verhindert Rückinferenz aus Callbacks; der separate Legacy-Overload erhält dessen Kontexttypisierung. Die geklammerte Observation-Prüfung berücksichtigt die gesamte Union und erforderliche Felder. Kein konkreter APIbruch gefunden. Explizite Generics habe ich nicht separat kompiliert.
- Descriptor-Decodierung, dokumentierte Grenzen verfeinerter Typen, getrennte Setup-/Live-Entwürfe und Live-Vorrang sind nachvollziehbar. Gruppenvalidierung und Reihenfolge entsprechen dem Vertrag.
- Kategoriale Gruppen, Vorzeichen, Leerwerte, Duplikat- und Mixed-Domain-Ablehnung entsprechen dem eingefrorenen Chartvertrag; numerische Balken behalten ausdrücklich ihre bisherigen Positionsregeln.
- Die Fehlerloop- und `flushSync`-Korrekturen adressieren ihre beschriebenen Ursachen. Daraus folgt keine allgemeine Fehleratomarität.
- `6bdc9fe` verändert keine Testaufrufe oder Erwartungen: Direktiven wurden verschoben, Leerzeilen entfernt und Manifest/Dokumentation angepasst. Die Refreezes korrigieren Browserannahmen und ergänzen Assertions.
- Gemeinsame Normalisierung und Renderer bleiben ausreichend begrenzt; kein belegtes Overengineering. Taxi verwendet Modellreporter und verliert seinen privaten Mount-Patch. Eine vollständige wissenschaftliche Prüfung sämtlicher Migrationen war nicht Gegenstand dieser Review.

Der verbleibende Pre-Main-Audit:

| Priorität | Aufgabe und konkrete Abnahme |
|---|---|
| **P1** | Beide Fehlerbefunde schließen; danach finalen Gesamtcheck, öffentlichen Paketkonsumenten und Svelte-Build am endgültigen Commit ausführen. Die früheren 578 Tests/224 Beispiele und Folgechecks ersetzen diesen Lauf nicht. |
| **P1** | Dunklen Netzwerklabel-Kontrast separat abschließen: frischer Dark-Start und Themewechsel, beide Größen, neue unabhängige Bildprüfung. Die gemeldete 81-Bilder-Nachprüfung ist getrennte Evidenz; im geprüften committed Review stehen noch 49 Bilder und ältere offene Punkte. |
| **P1** | Ledger zeilenweise mit B08/B09 und späteren Nachweisen abgleichen. [progress-summary.json](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/experiments/catalog/progress-summary.json:1) führt weiterhin 105 implementierte und eine vollständig akzeptierte Position. 125 Setups/124 Schritte schließen weder die fehlenden 75 Implementierungen noch wissenschaftliche Einzelabnahmen der festen 200er-Auswahl. |
| **P2** | [PLAN.md:3](/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/PLAN.md:3), UI-Verfügbarkeit und Reviewantworten aktualisieren: Implementierung, ausgeführte Prüfungen und unabhängige Freigaben mit Commitbezug getrennt ausweisen. Historische Freeze-Dokumente historisch lassen. |
| **P2, vor Architekturfreigabe** | Tijuana-Frage ausdrücklich entscheiden: Reichen öffentliche Aktionspfade für private Domain-Prozeduren? Die Prozedurmatrix dokumentiert Erreichbarkeit, entscheidet den normativen Konflikt aber nicht. Kein pauschaler Export privater Helfer; zusätzliche APIs benötigen eigene eingefrorene Beispiele. |

Diese Review liefert unabhängige Quellcodebefunde und zwei gezielte Laufzeitnachweise, **keine visuelle, wissenschaftliche oder Main-Merge-Freigabe**.