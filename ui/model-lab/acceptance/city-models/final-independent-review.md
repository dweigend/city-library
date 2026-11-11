# Abschließender unabhängiger Prüfbericht: City-Modelle UI-Reapproval

**Datum:** 2026-11-10  
**Rolle:** Unabhängiger Review-Subagent (Read-only, keine Code-Edits, keine Kind-Agenten)  
**Referenzdokumente:**  
- Vorheriger substanzieller Design-Review: `/tmp/city-models-independent-design-review.md` (Domain/Contracts/Grenzen genehmigt, UI unter Vorbehalt)
- Coordinator-Stellungnahme und Nachweise: `ui/agent-lab/acceptance/city-models/review-responses.md`
- Screenshots (16 Final-Captures + 1 Interventions-Screenshot): `/tmp/city-{housing,mobility,economy,air-noise}-{desktop,narrow}-{light,dark}-review-final.png`, `/tmp/city-mobility-walking-policy-valid.png`

---

## 1. Zusammenfassung & Gesamtergebnis

Im vorherigen substanziellen Design-Review (`/tmp/city-models-independent-design-review.md`) wurden die Domänenmodelle, öffentlichen Verträge und wissenschaftlichen Modellgrenzen aller 15 City-Modelle uneingeschränkt genehmigt. Die UI-Freigabe für 11 Modelle wurde erteilt, für 4 Modelle (`city-air-noise`, `city-mobility`, `city-economy`, `city-housing`) jedoch an vier konkrete Nachbesserungen geknüpft.

Die Überprüfung der aktuellen Quelldateien (`models/city-*/ui.ts`), der Testprotokolle und der 17 finalen Screenshots bestätigt:
1. Alle vier Befunde wurden fachgerecht, robust und im Einklang mit den öffentlichen UI-Projektionsverträgen behoben bzw. geklärt.
2. An den Domänen-APIs und Modellsemantiken wurden keinerlei verändernde Eingriffe vorgenommen.
3. Die UI-Freigabe für die vier nachgebesserten Modelle wird hiermit **vollumfänglich und unabhängig erteilt (APPROVED)**.

Damit sind **alle 15 City-Simulationsmodelle sowohl auf Domain- als auch auf UI-Ebene vollständig abgenommen**.

---

## 2. Detaillierte Disposition der vier UI-Befunde

### Befund 1: Fehlende Zahlenformatierung in Expositionstabelle (`models/city-air-noise/ui.ts`)
- **Ursprünglicher Befund:** Rohe Fließkommazahlen (z. B. `1.1999752528499812`) führten auf mobilen/schmalen Viewports zu Spaltenüberlauf und abgeschnittenen Zellinhalten/Headern.
- **Prüfung der Implementierung:** In `models/city-air-noise/ui.ts` (Zeilen 24–30) wurden konsistente Formatierer ergänzt:
  - Konzentration: `.toFixed(3)`
  - Exposition (Luft): `.toFixed(3)`
  - Schallpegel: `.toFixed(2)`
  - Schallenergie: `.toExponential(3)`
- **Visuelle Evidenz:** Die Screenshots `/tmp/city-air-noise-{desktop,narrow}-{light,dark}-review-final.png` zeigen saubere, kompakte Werte (z. B. `1.200`, `12.480`, `63.03`, `1.327e-4`).
- **Verhalten bei schmalem Viewport:** Die Tabelle scrollt auf mobilen Bildschirmen kontrolliert horizontal innerhalb des Tabellencontainers (`contained horizontal table scroll`). Es tritt kein unkontrollierter Layout-Bruch der Seite auf.
- **Disposition:** **BEHOBEN & GENEHMIGT (RESOLVED & APPROVED)**.

---

### Befund 2: Fußgängerroute im Mobilitäts-Netzwerkgraphen ausgeblendet (`models/city-mobility/ui.ts`)
- **Ursprünglicher Befund:** Das Netzwerk filterte auf `mode === "car"`, sodass Fußwege fehlten und eine Routenverlagerung den Graphen leer erscheinen ließ.
- **Prüfung der Implementierung:** In `models/city-mobility/ui.ts` werden nun sämtliche Kanten gerendert (`state.links.map`). Auto-Kanten sind orange (`carColor = indexedColor(25)`), Fußwege blau (`walkColor = indexedColor(105)`). Die Linienbreite kodiert die Belegung (`width: 1 + link.used`). Die Beschriftung lautet explizit: `"Routes · orange car / blue walk · width shows occupancy"`.
- **Politik-Intervention & Evidenz:** Der Screenshot `/tmp/city-mobility-walking-policy-valid.png` verifiziert die Interventionswirkung im gültigen Parameterbereich:
  - Parameter: `carPenalty = 5` (zulässiger Bereich; der frühere Wert 20 lag außerhalb der Bounds und wird nicht mehr verwendet).
  - Aktion: `Dispatch 4 trips`.
  - Zustand bei Minute 1: `completedTrips: 0`, `movingTrips: 6`, `waitingTrips: 2`.
  - Visuell: Die blaue Fußweg-Kante zwischen `Home` und `Jobs` ist deutlich sichtbar und aktiv belegt.
- **Visuelle Evidenz:** `/tmp/city-mobility-{desktop,narrow}-{light,dark}-review-final.png` zeigen korrekte Knoten (`Home`, `Junction`, `Jobs`), Kanten und Beschriftungen in allen vier Themes/Viewports.
- **Disposition:** **BEHOBEN & GENEHMIGT (RESOLVED & APPROVED)**.

---

### Befund 3: Haushaltsknoten-Überlappung auf schmalen Viewports (`models/city-economy/ui.ts`)
- **Ursprünglicher Befund:** Statische Knotenplatzierung und lange Labels führten bei 390 px Breite zu Überlappungen von Text und Knoten.
- **Prüfung der Implementierung:** Verwendung kompakter Labels (`F1 3/3`, `H1 employed` / `unemployed`) und eines vertikal gestreckten Tall-Presets. Firmen- und Haushaltsknoten sind entlang der vertikalen Achse (-120, 0, 100, 200, 300) klar entflochten.
- **Visuelle Evidenz:** Die Screenshots `/tmp/city-economy-{desktop,narrow}-{light,dark}-review-final.png` belegen bei 390 px sowie auf dem Desktop in Light und Dark Mode eine einwandfreie Lesbarkeit ohne Textkollisionen. Alle 2 Firmen und 8 Haushalte sowie Beschäftigungskanten, Monitore und Liniendiagramme sind vollständig sichtbar.
- **Disposition:** **BEHOBEN & GENEHMIGT (RESOLVED & APPROVED)**.

---

### Befund 4: `(unordered)`-Annotation in Housing-Collection (`models/city-housing/ui.ts`)
- **Ursprünglicher Befund & Berechtigter Einwand:** Die frühere Review-Empfehlung lautete, `order: "supplied"` zu setzen. Die Analyse des Coordinators anhand von `ui/views/collections.ts` zeigte jedoch, dass `order: "supplied"` wörtlich zu `(supplied order)` geführt hätte, anstatt die technische Kennzeichnung zu entfernen, und eine nicht gegebene Ordnungsbehauptung aufgestellt hätte.
- **Architektonische Lösung:** `models/city-housing/ui.ts` nutzt nun die standardmäßige Zähl-Projektion (`kind: "count"`, `itemCount: ...`) für Wohnungszeilen (`home-1` bis `home-n`), `Never housed` und `Displaced`. Dadurch entfällt jede Ordnungsbehauptung; die Zeilenbeschriftung zeigt sauber die Anzahl (z. B. `home-1: 1`).
- **Zusätzliche Detailtabelle:** Um die individuellen Haushaltszuweisungen transparent darzustellen, wurde eine strukturierte Tabelle `Household assignments` ergänzt (`Household`, `Status`, `Home`, `Income / month`, `Bid / month`).
- **Vertragstreue:** Diese Lösung nutzt ausschließlich bestehende öffentliche UI-Verträge ohne Anpassung des Renderers oder Eingriff in die Domänen-API.
- **Visuelle Evidenz:** In `/tmp/city-housing-{desktop,narrow}-{light,dark}-review-final.png` erscheinen die Zählzeilen und die Zuweisungstabelle fehlerfrei und ohne störende Suffixe. Auch die Dark-Canvas-Darstellung ist vollständig und fehlerfrei.
- **Disposition:** **EINWAND BERECHTIGT, LÖSUNG GENEHMIGT (OBJECTION UPHELD & APPROVED)**.

---

## 3. Verifikation der Prüfsummen, Grenzen und Testläufe

- **Dokumentierte Grenzen & Hash-Integrität:**
  - Es existieren keine nachträglich erfundenen Git-Commit-Hashes; die Testskripte wurden vor Implementierungsbeginn eingefroren.
  - Dokumentierte redaktionelle Ausnahme: In `tests/public-contracts/city-materials/04-validation-and-observations.ts` (Zeile 16) wurde an einem werfenden Getter die TypeScript-Typannotation `: number` ergänzt (`get reuseFraction(): number`). Dies dient ausschließlich dem sauberen Typechecking; Assertions und Fehlererwartungen blieben identisch.
- **Test- und Build-Status:**
  - Typecheck: `bun run check:ui:svelte` / `svelte-check` liefert 0 Fehler und 0 Warnungen (`/tmp/city-models-review-fixes-typecheck.log`).
  - UI-Build: `bun run build:ui` erfolgreich.
  - Fokussierte Tests: `models/city-housing/housing.test.ts` und `tests/public-contracts/city-mobility/behavior.test.ts` bestanden (8 Tests, 458 Assertions, 0 Fehler, siehe `/tmp/city-review-fixes-tests.log`). Ein globaler Testsuite-Lauf war für diese reinen Darstellungsnachbesserungen nicht erforderlich.

---

## 4. Abschließendes Genehmigungsurteil (Final Independent Approval)

| Prüfbereich | Vorheriger Status | Neuer Status | Begründung |
| :--- | :--- | :--- | :--- |
| **Domänenmodelle (`city-*`)** | GENEHMIGT | **GENEHMIGT** | Unverändert; Erhaltungssätze und Headless-Isolation intakt. |
| **Öffentliche Verträge** | GENEHMIGT | **GENEHMIGT** | Verträge eingehalten; redaktionelle Typannotation dokumentiert. |
| **Wissenschaftliche Grenzen** | GENEHMIGT | **GENEHMIGT** | Didaktisch abgegrenzte Lehrmodelle, klare Transparenz. |
| **UIs (11 Basis-Modelle)** | GENEHMIGT | **GENEHMIGT** | Unverändert genehmigt. |
| **UI: `city-air-noise`** | VORBEHALTLICH | **GENEHMIGT** | Zahlenformatierung mit `.toFixed`/`.toExponential` implementiert; Tabellenscrollen gekapselt. |
| **UI: `city-mobility`** | VORBEHALTLICH | **GENEHMIGT** | Fußwege mit visueller Farbcodierung und Belegung integriert; valide Interventions-Evidenz erbracht. |
| **UI: `city-economy`** | VORBEHALTLICH | **GENEHMIGT** | Tall-Preset und kompakte Labels verhindern Überlappung auf allen Viewports. |
| **UI: `city-housing`** | VORBEHALTLICH | **GENEHMIGT** | Zählzeilen eliminieren Ordnungsartefakte; Zuweisungstabelle bietet saubere Detailansicht. |

**Gesamturteil:** Sämtliche 15 City-Simulationsmodelle erfüllen die Qualitätskriterien, Domänenverträge und UI-Richtlinien. Die endgültige Abnahme wird hiermit unabhängig erteilt.
