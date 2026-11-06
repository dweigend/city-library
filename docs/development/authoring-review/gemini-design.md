### Unabhängige Design-Review-Stellungnahme (Gemini 3.8 Flash HIGH)

**Geprüfter Revisionsstand:** Checkout `experiment/netlogo-web-catalog` (Commit `b7a972c` / `9a4203c`)  
**Fokus:** Evaluierung des UI-Authoring-Vertrags (`docs/development/ui-authoring-syntax.md`, `examples/ui-authoring/*`, `docs/ui/api-reference.md`), Typ-/Laufzeitkonsistenz, State Ownership, Abgrenzung Blocker vs. Follow-ups sowie Audit der verbleibenden Pre-Main-Aufgaben gem. `PLAN.md`.

---

### 1. Bewertung des UI-Authoring-Vertrags (Contract Review)

Der vorgeschlagene Authoring-Slice ist konzeptionell stringent, schlank und vermeidet bewusst eine zweite DSL, Komponenten-Hierarchien oder Renderer-Escape-Hatcher.

#### A. Typ- und Laufzeitkonsistenz
* **Keyed Live (`P[K]`-Typisierung & impliziter vs. expliziter Getter):**
  * *Vertrag:* Für Keyed Live ist `value(state)` optional, wenn `Snapshot<M>` über eine kompatible, erforderliche Eigenschaft `parameters[K]: P[K]` verfügt. Andernfalls ist ein typisierter Getter zwingend erforderlich (`examples/ui-authoring/03-alternate-observation.ts`, `authoring.types.ts:25-28`).
  * *Konsistenz:* Exzellent gelöst. Wenn die Beobachtung kein kanonisches `parameters`-Feld bereitstellt, erzwingt TypeScript zur Compile-Zeit einen expliziten Getter. Ein expliziter Getter muss zwingend `P[K]` liefern (`authoring.types.ts:29-33`).
* **BarSeries & kategoriale Achsen:**
  * *Vertrag:* Kategoriale `x`-Werte (`string | number`) sind ausschließlich für `type: "bar"` zulässig; `line` und `scatter` bleiben strikt numerisch (`authoring.types.ts:34-38`).
  * *Konsistenz:* Der Vertrag trennt `Series` (numerisch) und `BarSeries` (kategorial oder numerisch). Das Laufzeitverbot von gemischten Modi (Strings und Zahlen innerhalb eines Bar-Views) verhindert Inkonsistenzen bei Achsenskalierungen.
* **Monitor-Formatierung:**
  * *Vertrag:* `format?: (value: string | number) => string` ist eine reine Darstellungsfunktion für skalare Rückgaben; der wissenschaftliche Monitorwert bleibt numerisch/unverändert (`04-groups-format-and-categories.ts:28-30`).

#### B. Setup- / Live-Ownership & Validierung
* **Omitted Setup & Exklusion:**
  * Bei Keyed Live (`live: { ... }` oder `live: {}`) listet ein weggelassenes `setup` alle Eingabefelder in Deklarationsreihenfolge abzüglich der Keyed-Live-Felder (`01-defaults-and-inert-entry.ts:26-27`).
  * Bei Legacy-Live-Arrays (`live: [...]`) oder fehlendem `live` bleibt das bisherige Verhalten vollständig erhalten (inklusive historischer Duplikat-Steuerung und Live-Reader-Präzedenz, geprüft in `05-independent-actions-and-legacy.ts:39`).
  * Explizites `setup: []` rendert keine Setup-Steuerelemente (`03-alternate-observation.ts:24`, `05:8`).
* **State Ownership:**
  * Vor dem Setup schreibt eine Interaktion an Live-Controls ausschließlich in den Setup-Entwurf.
  * Nach dem Setup ruft sie ausschließlich die explizite Setter-Aktion auf (`live.set(model, value)`). Es gibt keinen zweiten Zustandshalter im Host; das Modell bleibt alleiniger Owner.

#### C. Gruppierung & Taxi-Entflechtung
* **Flache Gruppen (`group?: string`):**
  * Gruppen erscheinen bei ihrem ersten Auftreten; nicht aufeinanderfolgende Steuerelemente mit identischem Gruppennamen werden in denselben `<fieldset>`-Container mit `<legend>` in Deklarationsreihenfolge zusammengeführt (`04-groups-format-and-categories.ts:37-41`).
  * Dies löst die bisherige Taxi-Ausnahme (`experiments/taxi-cabs/ui.ts:149-177`), bei der per DOM-Patching nachträglich `<details>/<summary>` in `.live-controls` injiziert wurde, vollständig deklarativ und ohne Host-DOM-Zugriff ab.

---

### 2. Konkrete Befunde (Findings mit Pfad/Zeile)

#### [BLOCKER FÜR RUNTIME-IMPLEMENTIERUNG]
1. **Unterscheidung von `BarSeries` vs. `Series` in `ui/definition.ts`**
   * **Pfad / Zeile:** [ui/definition.ts#L67-L91](file:///home/david/Projekte/city-library/ui/definition.ts#L67-L91)
   * **Problem:** Aktuell definiert `definition.ts` nur ein einheitliches `Series`-Interface (`points: readonly { x: number; y: number }[]`) für `"line" | "bar" | "scatter"`. Um den negativen Compile-Test in [examples/ui-authoring/authoring.types.ts#L34-L38](file:///home/david/Projekte/city-library/examples/ui-authoring/authoring.types.ts#L34-L38) zu erfüllen, muss `View<S>` aufgetrennt werden, sodass `"line" | "scatter"` ausschließlich `Series` akzeptiert, während `"bar"` `BarSeries` akzeptiert.
   * **Lösungsvorschlag:** Export von `BarSeries` mit `points: readonly { readonly x: string | number; readonly y: number }[]` in `ui/definition.ts` und Diskriminierung in `View<S>`:
     ```ts
     | { readonly type: "line" | "scatter"; readonly label: string; readonly xAxis?: AxisSpec; readonly yAxis?: AxisSpec; readonly series: (state: S) => readonly Series[]; }
     | { readonly type: "bar"; readonly label: string; readonly xAxis?: AxisSpec; readonly yAxis?: AxisSpec; readonly series: (state: S) => readonly BarSeries[]; }
     ```
   * **Akzeptanzkriterium:** `bun x tsc -p examples/ui-authoring/tsconfig.json` akzeptiert kategoriale Punkte bei Bar-Charts und meldet bei Line-/Scatter-Charts mit String-Koordinaten exakt den erwarteten `@ts-expect-error`.

2. **Mount-Validierung für leere / Whitespace-Gruppennamen**
   * **Pfad / Zeile:** [docs/development/ui-authoring-syntax.md#L20-L24](file:///home/david/Projekte/city-library/docs/development/ui-authoring-syntax.md#L20-L24)
   * **Problem:** Der Vertrag fordert: *„Empty/whitespace-only labels reject at mount.“* In der aktuellen Normalisierung ([ui/compose.ts#L225-L270](file:///home/david/Projekte/city-library/ui/compose.ts#L225-L270) und [ui/svelte/session.ts#L25-L45](file:///home/david/Projekte/city-library/ui/svelte/session.ts#L25-L45)) existiert diese Prüfung noch nicht.
   * **Lösungsvorschlag:** Beim Mounten/Initialisieren in beiden Hosts prüfen:
     ```ts
     if (binding.group !== undefined && binding.group.trim().length === 0) {
       throw new Error(`Invalid empty group label for field: ${field}`);
     }
     ```
   * **Akzeptanzkriterium:** Mounten eines UI-Specs mit `group: " "` oder `group: ""` wirft einen Fehler beim Mounten und verhindert die Initialisierung.

#### [NÜTZLICHE FOLLOW-UPS / RUNTIME-AUFGABEN]
1. **Bereinigung der Taxi-Cabs UI und Entfernung aus `legacyEntries`**
   * **Pfad / Zeile:** [experiments/taxi-cabs/ui.ts#L149-L177](file:///home/david/Projekte/city-library/experiments/taxi-cabs/ui.ts#L149-L177), [vite.config.ts#L8](file:///home/david/Projekte/city-library/vite.config.ts#L8)
   * **Kontext:** Nach Implementierung der flachen Gruppen in beiden Host-Renderern (`ui/compose.ts` und Svelte `Workbench.svelte`) muss `experiments/taxi-cabs/ui.ts` auf das Standard-`defineUI` umgestellt werden (Gruppen `"AM"`, `"MD"`, `"PM"`, `"EVE"`, `"EM"`). Die Eigenschaft `legacyEntries: ["taxi-cabs"]` in `vite.config.ts` entfällt.
2. **Reale Browser-Verifikation (`browserChecks`)**
   * **Pfad / Zeile:** [examples/ui-authoring/README.md#L35-L43](file:///home/david/Projekte/city-library/examples/ui-authoring/README.md#L35-L43)
   * **Kontext:** Die 5 Skripte exportieren `browserChecks(container)`. Diese dürfen nicht isoliert in Bun abgehakt werden, sondern müssen nach Runtime-Fertigstellung in echtem Chromium/WebKit in beiden Hosts (Legacy & Svelte) inklusive Desktop/Narrow-Screenshots ausgeführt werden.

---

### 3. Unabhängiges Audit der verbleibenden Pre-Main-Aufgaben (`PLAN.md` & Checkout)

Basierend auf der Überprüfung des aktuellen Checkouts und des [PLAN.md](file:///home/david/Projekte/city-library/PLAN.md):

1. **Umfangs- und Ledger-Gates (125 vorliegende Modelle vs. 200 Gesamtumfang):**
   * *Status:* Im aktuellen Katalog liegen 125 Modelle aus B01–B19 vor.
   * *Audit-Feststellung:* Das gegenwärtige Authoring- und Kapselungs-Refactoring vereinheitlicht die Schnittstellen der vorhandenen Modelle, reduziert jedoch **nicht** die vertraglich fixierte Gesamtlieferverpflichtung von 200 Modellen (`PLAN.md#evidence-and-completion`).
   * *Gate:* Offene wissenschaftliche Ledger-Gates (z. B. Kristallisations-Zähler-Diskrepanz in B11, Rundungsdifferenz bei Blood in B07 sowie ausstehende Argon-Reviews) dürfen durch dieses UI-Authoring-Inkrement nicht stillschweigend als geschlossen markiert werden.

2. **Kapselung öffentlicher Prozeduren (Tijuana, Traffic, Taxi):**
   * *Status:* Commit `9a4203c` hat den Ausführungsfluss (`go`, `step`, `advanceCityscape`) an den Anfang der Modelldateien gerückt und kanonische Beobachtungen (`occupiedCabs`, `totalIncome`) bereitgestellt.
   * *Audit-Feststellung:* Private Implementierungshelfer (wie die 19 internen Prozeduren in Tijuana) verbleiben strikt modellintern. Öffentliche Interaktionen erfolgen ausschließlich über die typisierten Aktionen (`advance`, `setRules`, `setParameters`, `clear`, `addNode`, `setScenario`). Diese saubere Grenze entspricht exakt den Architekturvorgaben aus `docs/development/model-function-encapsulation.md`.

3. **Dokumentation und unveränderliche Evidenz:**
   * *Status:* `README.md`, `docs/README.md` und `docs/development/model-authoring.md` stellen nun nachvollziehbar die Open-Source-Stadtmodellierung in den Vordergrund.
   * *Audit-Feststellung:* Die Manifeste `examples/model-authoring/SHA256SUMS` und `examples/ui-authoring/SHA256SUMS` sind fixiert. Frühere eingefrorene Skripte blieben unverändert.

---

### 4. Fazit und Scoped Approval

* **Vertragsfreigabe (Contract Approval):** **ERTEILT** für die Spezifikation in `docs/development/ui-authoring-syntax.md` und die fünf eingefrorenen Beispiele `examples/ui-authoring/01-05`. Der Vertrag ist minimal, rückwärtskompatibel und schließt die Lücken für Setup-Strings, Keyed Live, Gruppen, Formatierer und Bar-Kategorien ohne Architekturbrüche.
* **Implementierungsfreigabe (Runtime/Browser):** **AUSSTEHEND** (weisungsgemäß nicht erteilt). Die Runtime-Anpassung in `ui/` und die Ausführung der `browserChecks` in beiden Host-Adaptern mit visueller Begutachtung stehen als nächster Arbeitsschritt an.