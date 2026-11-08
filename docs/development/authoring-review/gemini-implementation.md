### Unabhängiger Implementierungs-Review (Read-Only)

**Prüfer:** Gemini 3.8 Flash (High)  
**Arbeitsbereich:** Snapshot [`da667f3`](file:///home/david/Projekte/city-library) (`experiment/netlogo-web-catalog`, Scope `0747555..da667f3`)  
**Haupt-Branch (`main`):** Unangetastet (`/home/david/Projekte/city-library` verbleibt unverändert im Ausgangszustand).  
**Status:** **Bedingte Teilfreigabe** für die Authoring- und Svelte-Laufzeit-Architektur – **Blocker / Gate für finales Approval:** Der visuell identifizierte Timing-Bug für dunklen Network-Label-Kontrast in [`ui/views/network.ts`](file:///home/david/Projekte/city-library/ui/views/network.ts) (in Bearbeitung durch Agent A) ist im Commit-Snapshot [`da667f3`](file:///home/david/Projekte/city-library) noch uncommitted und von der Freigabe ausgeschlossen. Der finale globale Gesamttestlauf steht noch aus.

---

### 1. Architektur- und Typenbewertung (`ui/`)

#### Typintegrität & Mapped Types ([`ui/definition.ts`](file:///home/david/Projekte/city-library/ui/definition.ts#L145-L161))
- **`KeyedLive<P, M>`:** Die bedingte Typdefinition stellt sicher, dass ein impliziter Getter (`value?: ...`) nur dann zulässig ist, wenn `Snapshot<M>` garantiert ein `parameters`-Objekt besitzt, in dem der Parameter `K` strikt typkompatibel vorhanden ist. Wenn `parameters` optional ist, fehlt oder in einer Beobachtungs-Union nur partiell vorliegt, erzwingt TypeScript strikt einen expliziten Getter (`value: (state) => P[K]`).
- Die negativen Testdirektiven in [`examples/ui-authoring/authoring.types.ts`](file:///home/david/Projekte/city-library/examples/ui-authoring/authoring.types.ts) wurden mit [`6bdc9fe`](file:///home/david/Projekte/city-library) exakt vor die jeweiligen Ausdrücke platziert, sodass alle erwarteten Compiler-Fehler präzise greifen.

#### Laufzeit-Dekodierung & Host-Grenzen ([`ui/authoring.ts`](file:///home/david/Projekte/city-library/ui/authoring.ts#L10-L40))
- **`decodeControl`:** Validiert Host-Eingaben zur Laufzeit gegen den `Descriptor` (`number` inkl. `finite`, `integer`, `min`/`max`; `boolean`; `string`/`choice`). Ungültige Eingaben werfen deterministisch `TypeError` bzw. `RangeError`. Wissenschaftliche Modell-Constraints bleiben in den Aktionen gekapselt.
- **`normalizeAuthoring`:** Omitted `spec.setup`:
  - Bei moderner `KeyedLive`-Definition schließt das Default-Setup automatisch alle in `live` definierten Felder aus.
  - Bei Legacy-Array-Definitionen verbleiben alle Deskriptor-Felder im Setup (Abwärtskompatibilität gewahrt).
  - Explizites `setup: [...]` (als String oder Objekt) behält die vom Autor deklarierte Reihenfolge exakt bei.
- **Gruppierungssemantik (`groupLive`):** Flache Gruppen behalten die Reihenfolge des ersten Auftretens sowie die interne Deklarationsreihenfolge bei. Leere oder reine Whitespace-Gruppenbezeichner werden in [`ui/authoring.ts#L46`](file:///home/david/Projekte/city-library/ui/authoring.ts#L46) mit `TypeError` abgewiesen.

#### Formular- und Host-Synchronisation ([`ui/controls/form.ts`](file:///home/david/Projekte/city-library/ui/controls/form.ts), [`ui/compose.ts`](file:///home/david/Projekte/city-library/ui/compose.ts))
- Beide Adapter (DOM und Svelte) nutzen dieselbe Normalisierung und denselben Dekodierer. Numerische Inputs lesen über `valueAsNumber` (statt stringbasiertem `Number(...)`), wodurch unvollständige Formulareingaben sauber gehandhabt werden.

---

### 2. Svelte Lifecycle & Reactive Error Fixes (`ui/svelte/`)

#### Entkopplung von Renderer-Fehlern ([`ui/svelte/views/View.svelte`](file:///home/david/Projekte/city-library/ui/svelte/views/View.svelte#L66), Commit `ff770c0`)
- **Problem:** Renderer-Fehler riefen `onerror` innerhalb von Svelte-Effekten auf, was über den Store-Update den Effekt reaktiv re-triggerte (Endlosschleife / Kaskade).
- **Behebung:** Alle Aufrufe von `onerror(error)` sind nun in `untrack(() => onerror(error))` gekapselt. In [`ui/svelte/session.ts#L110`](file:///home/david/Projekte/city-library/ui/svelte/session.ts#L110) ignoriert `fail()` identische Fehlermeldungen im Ruhezustand, wodurch reaktive Schleifen vollständig unterbunden sind.

#### Session-Restart & Owner-Wechsel ([`ui/svelte/session.ts`](file:///home/david/Projekte/city-library/ui/svelte/session.ts#L185-L200), Commit `7bfd706`)
- **Problem:** Bei `initialize()` konnten noch ausstehende Renderer-Effekte der vorherigen Modellinstanz feuern und Fehler der alten Instanz auf die neue übertragen.
- **Behebung:** Durch `flushSync(() => { instance = next; ... epoch++; ... observe(); })` werden alle ausstehenden Effekte geleert, bevor die neue Instanz/Epoche installiert wird. Die alte Instanz wird garantiert im `finally`-Block entsorgt (`old?.dispose?.()`).
- Getrennte Entwürfe: `draft` (Setup) und `liveDraft` (Live vor Instanziierung) erzeugen vor dem Initialisieren keine Modellinstanz und mutieren nichts.

---

### 3. Diagramm-Engine & Bar-Geometrie ([`ui/views/chart.ts`](file:///home/david/Projekte/city-library/ui/views/chart.ts), Commit `8d2b300`)

- **Kategoriale & vorzeichenbehaftete Balken:** Mehrere Datenreihen pro Kategorie werden nebeneinander ohne Überlappung positioniert. Bei gemischten/negativen Werten dient $y=0$ als Basislinie; positive Balken wachsen nach oben, negative nach unten.
- **Responsivität:** `ResizeObserver` synchronisiert `viewBox` und Geometrie direkt mit der CSS-Containerbreite. Eine stabile Basishöhe (`intrinsicHeight`) verhindert Layout-Feedback-Schleifen.
- **Barrierefreiheit:** Achsenbeschriftungen (`xAxis`, `yAxis`) und Serienwerte werden im `aria-label` des SVG semantisch aufbereitet.

---

### 4. Modell-Refaktorisierungen (4 Modelle)

- [`experiments/taxi-cabs/model.ts`](file:///home/david/Projekte/city-library/experiments/taxi-cabs/model.ts): Öffentlicher Ablauf (`go()`, `step()`) an den Funktionsanfang verlagert. Reine Beobachtungswerte (`occupiedCabs`, `totalIncome`) direkt im `snapshot()`, wodurch private DOM-Patches und UI-Zähl-Hacks im Adapter entfallen.
- [`experiments/traffic-grid/model.ts`](file:///home/david/Projekte/city-library/experiments/traffic-grid/model.ts) & [`experiments/traffic-grid-goal/model.ts`](file:///home/david/Projekte/city-library/experiments/traffic-grid-goal/model.ts): Ausführungsfluss an den Anfang verlagert; saubere Trennung zwischen Welt-Fortschritt und Datenaufzeichnung.
- [`experiments/urban-suite-tijuana-bordertowns/model.ts`](file:///home/david/Projekte/city-library/experiments/urban-suite-tijuana-bordertowns/model.ts): Geteilter Ablauf (`advance('cityscape')` vs. `advance('go')`). `step` bleibt sauber deaktiviert/geguardet, solange das Cityscape-Setup nicht abgeschlossen ist.

---

### 5. Browser- und Evidenzprüfung

- **Gefrorene Verträge:** Alle 5 Initialverträge (`01` bis `05`), negative Typentests (`authoring.types.ts`) und Manifest-Hashes (`SHA256SUMS`) in [`examples/ui-authoring/`](file:///home/david/Projekte/city-library/examples/ui-authoring/) sind intakt.
- **Browser-Akzeptanz:** Die beiden Host-Adapter haben 9 zusätzliche Browser-Fixtures pro Host durchlaufen ([`docs/development/authoring-browser-responsive/`](file:///home/david/Projekte/city-library/docs/development/authoring-browser-responsive)).
- **Katalog-Smoke-Test:** 125 Setup-Initialisierungen erfolgreich; 124 Einzelschritte ausgeführt (genau 1 Modell planmäßig deaktiviert: `urban-suite-tijuana-bordertowns` wegen des zweistufigen Cityscape-Setups). 0 Fehler, keine Shadow-DOM-Lecks ([`city-library-catalog-authoring-final-summary.json`](file:///home/david/Projekte/city-library/docs/development/authoring-catalog-browser/city-library-catalog-authoring-final-summary.json)).
- **Bildprüfung:** 49 + 32 PNGs wurden im nativen Reviewer-Prozess geöffnet. Die Befunde zu Chart- und TijuanaCanvas-Rändern wurden verifiziert und geschlossen. Keine pauschale Bildfreigabe ohne Pixelprüfung.

---

### 6. Befunde & Gate-Bedingungen

| Schweregrad | Pfad / Zeile | Beschreibung / Gate |
|---|---|---|
| **Blocker (Gate)** | [`ui/views/network.ts#L40-L65`](file:///home/david/Projekte/city-library/ui/views/network.ts#L40-L65) | **Dark-Mode Network-Label Kontrast-Timing:** Im Commit [`da667f3`](file:///home/david/Projekte/city-library) wird `labelTheme()` bei Farbschema-Wechseln via Microtask aktualisiert, weist jedoch bei dynamischen Theme-Updates Timing-Probleme auf. Der Fix von Agent A ist noch **uncommitted**. **Gate:** Keine Gesamtfreigabe der UI-Integration vor Einpflegen und Prüfen dieses Fixes. |
| **Hinweis / Scope** | [`PLAN.md#L30`](file:///home/david/Projekte/city-library/PLAN.md#L30) | **Kein automatischer 200-Modell-Schluss:** Der aktuelle Stand umfasst 125 migrierte Katalogmodelle im UI-Authoring. Daraus darf keine vollständige wissenschaftliche 200-Modell-Abnahme abgeleitet werden. |
| **Verifikation** | Root-Checks | Historischer Global-Check stand bei 578 Tests / 224 Skripten vor den letzten isolierten UI-Fixes. Typ- und Unit-Tests sowie UI-Builds laufen durch; der finale globale Check steht aus. |

---

### 7. Fresh Remaining-Main Audit (PLAN.md vs. Ist-Zustand)

1. **P1 · Setup/Live Host-Gleichlauf:** **Erledigt.** DOM- und Svelte-Hosts folgen denselben Normalisierungsregeln bezüglich Keyed vs. Legacy, Feldüberlappung und Lese-Präzedenz.
2. **P1 · Typisierte DOM-Grenze & Beobachtungs-Unions:** **Erledigt.** `KeyedLive` sichert Union-Typen ab; fehlerhafte Typen werden zur Compilezeit abgewiesen; Laufzeitdekodierung via `decodeControl` schützt die Modellgrenze.
3. **P1 · Barrierefreie Browser-Harness:** **Erledigt.** Browser-Routen für beide Hosts unter Desktop (1366) und Mobile (390), Hell und Dunkel mit echten Screenshots dokumentiert.
4. **P2 · Balken-Geometrie:** **Erledigt.** Getestet für Vorzeichen, Nullwerte, kategoriale Gruppen und responsive Breitenanpassung.
5. **P2 · Taxi Cabs Authoring & Host-Integration:** **Erledigt.** Additive reine Reporter im Model; keine Modell-Sonderbehandlung oder private DOM-Hacks mehr im Host.
6. **Dokumentations-Ledger:** Reconciled in [`docs/ui/`](file:///home/david/Projekte/city-library/docs/ui/) ohne verfrühte Status-Flags.
7. **Architektur-Entscheidung bezüglich privater Funktionen:** In [`docs/development/model-function-encapsulation.md`](file:///home/david/Projekte/city-library/docs/development/model-function-encapsulation.md) dokumentiert; die normative Harmonisierung über alle Engine-Regeln verbleibt eine offene Aufgabe für die finale `main`-Integration.
8. **Finaler integrierter Check:** Globaler Gesamtlauf (`bun run check`) muss nach dem Einchecken des Network-Fixes von Agent A noch final protokolliert werden.

### Fazit
Die Code-Änderungen in Scope `0747555..da667f3` sind architektonisch sauber, typensicher und erfüllen die Authoring-Vorgaben vollständig. Sobald der separate Fix für [`ui/views/network.ts`](file:///home/david/Projekte/city-library/ui/views/network.ts) eingecheckt ist und der finale Global-Check steht, ist der Branch bereit für die Zusammenführung.