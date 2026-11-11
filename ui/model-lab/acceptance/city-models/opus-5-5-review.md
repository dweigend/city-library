# Unabhängiger Review: 15 City-Simulationsmodelle (Claude Opus 5.5)

Datum: 2026-11-10 · Branch `t3/city-simulation-models` · Worktree `t3-ad043594-efa84c79fbccafc6`
Modus: read-only. Keine Repository-Änderungen, Commits, Pushes, Service- oder Freigabe-Konfigurationen. Keine Subagenten.

## Kurzfazit

Die 15 Modelle sind kleine, gut lesbare, deterministische Lehrmodelle. Sie nutzen die öffentlichen Bibliotheks-APIs sauber, trennen Domäne und UI korrekt und bestehen alle eigenen öffentlichen Skripte und Tests. Ich habe **keine Korrektheitsfehler in den Bilanzgleichungen** gefunden. Für **Population** hat das Default-Szenario aber ein didaktisch irreführendes Rundungsverhalten, und die öffentlichen Beispiele schreiben dieses Verhalten fest. Die Abnahmedokumentation ist an mehreren Stellen stärker oder widersprüchlicher als die Evidenz. Dazu kommen einige konkrete UI-Mängel; einen davon habe ich im Browser reproduziert.

**Empfehlung: Änderungen nötig** (überwiegend Dokumentation/Evidenz und kleine UI/API-Korrekturen; keine Architekturänderung). Details unten.

---

## 1. Findings nach Schwere

### M1 (Mittel) – Population: Default-Szenario wird von Rundung pro Kohorte dominiert; die öffentlichen Beispiele schreiben das fest

- Code: `models/city-population/model.ts:76-80` (`Math.floor(residentCount * parameters.deathRate)` pro Kohorte), Defaults `:18-24`.
- Trigger (reproduziert mit eigenem Skript): `model.create(); advance(n)`.
  - Jahr 1: 100 Todesfälle (10 pro Kohorte × 0,1 = 1). Jahr 2: **3 Todesfälle** bei ~925 Einwohnern. Nominal gilt eine jährliche Sterberate von 10 %, also ~90 Todesfälle.
  - Ab Jahr ~50 stationär: 1060 Einwohner, 19 Geburten, **24 Todesfälle/Jahr (≈2,3 % effektiv statt 10 %)**. Die Kohorte 100+ hält 90 Personen (8,5 % der Bevölkerung). Jede Kohorte unter 10 Personen ist faktisch unsterblich.
  - Gegenprobe mit 100 000 Einwohnern: Jahr 2 hat 9200 Todesfälle. Der Effekt ist also ein Skalenartefakt der Defaults.
- Auswirkung: Das Standardbeispiel zeigt kein demografisches Verhalten, sondern ein Rundungsartefakt. Ein Agent-Lab-Nutzer sieht „Annual mortality fraction 0.1“ und eine stark wachsende 100+-Säule (Screenshot `city-population-narrow-dark.png`, ~65 Personen bei Alter 100 nach 11 Jahren). Contract/README erwähnen nur „flooring can suppress small-cohort flows“. Das unterschätzt den Effekt im Default massiv. Die eingefrorenen Erwartungen („Year two: … deaths 3“ in `tests/public-contracts/city-population/02-conservation.ts`) spiegeln die Implementierung, statt einen sinnvollen Mechanismus zu zeigen.
- Vorschlag: Ganzzahlige Todesfälle für die Gesamtbevölkerung bestimmen (z. B. `floor(total × rate)`) und per Largest-Remainder auf die Kohorten verteilen, oder Kohorten als Erwartungswerte (Gleitkomma) führen. Zusätzlich plausiblere Defaults wählen (z. B. altersabhängige oder niedrigere Mortalität, mehr Einwohner). Weil damit eingefrorene Erwartungen fallen, braucht es eine explizit dokumentierte Vertragsentscheidung (AGENTS: Beispiele nicht stillschweigend abschwächen). Minimal: Die Wirkung im README quantifizieren.

### M2 (Mittel) – Behauptete Screenshot-Abnahme ist stärker als die abgelegten Bilder

- Dateien: `ui/agent-lab/acceptance/screenshots/city-models/city-housing-{desktop,narrow}-{light,dark}.png`, `city-air-noise-narrow-{light,dark}.png`, `city-air-noise-desktop-{light,dark}.png`; Aussagen in `ui/agent-lab/acceptance/city-models/README.md` und `final-independent-review.md` (Befund 1 „abgeschnittene … Header … behoben“).
- Visueller Befund:
  - In allen vier Housing-Aufnahmen und in den Air-Noise-Aufnahmen bei 390 px hat die Tabelle eine **leere Kopfzeile**: Spaltennamen fehlen, nur die Datenzeilen sind sichtbar.
  - Im Air-Noise-Desktop-Bild ist die Spalte „Sound exposure (J/m²)“ abgeschnitten (`1.327e…`). Die Tabelle ist auf ~500 px begrenzt, obwohl rechts freier Platz ist.
- Gegenprobe im echten Browser (eigene Sitzung, `localhost:3101` aus diesem Worktree, 390×844, Light, Housing nach Setup und 10 Schritten): Alle fünf Kopfzellen sind vorhanden und lesbar (Farbe `oklch(0.145 0 0)` auf weiß). Die leeren Köpfe sind also sehr wahrscheinlich ein Aufnahmeartefakt: sticky `table-head` (`ui/svelte/views/views.css:25`) zusammen mit der vorherigen Element-Aufnahme und dem Scrollen. Ein Produktfehler ist es nach meiner Prüfung nicht.
- Auswirkung: Die abgelegte Evidenz belegt die Lesbarkeit der Tabellenköpfe nicht. Trotzdem wurde sie unabhängig als „approved“ gezeichnet. Bei 390 px ist die Spalte „Bid / month“ nur per horizontalem Scrollen erreichbar, ohne sichtbaren Hinweis.
- Vorschlag: Housing und Air-Noise frisch von oben aufnehmen, ohne vorheriges Element-Scrollen. Die Review-Texte auf das korrigieren, was die Bilder tatsächlich zeigen. Optional: Tabellen in der Desktop-Ansicht über die volle Ergebnisbreite laufen lassen.

### M3 (Mittel) – Widersprüchlicher Abnahmestatus und nur selbstberichteter „Freeze“

- 23 Dateien unter `models/city-*/README.md|contract.md` sagen weiterhin, Browser- bzw. unabhängige Abnahme sei **pending**. Beispiele:
  - `models/city-population/contract.md` (letzter Absatz)
  - `models/city-daily-activities/README.md:26`
  - `models/city-stormwater/README.md:24`
  - `models/city-land-use/contract.md` („Independent review and browser acceptance are separate pending gates“)

  Dagegen erklären `docs/development/city-simulation-models.md` („Independent acceptance completed“), `PLAN.md` (neuer Absatz) und `ui/agent-lab/acceptance/city-models/README.md` („All fifteen models are accepted“) die Abnahme für erledigt.
- „Frozen before runtime implementation“: Alles ist untracked, es gibt keinen Freeze-Commit. Für 14 von 15 Modellen stimmen die in Contract, Evidence oder `SHA256SUMS` notierten SHA-256 mit den aktuellen Skripten überein (selbst geprüft). Für **Air-Noise sind gar keine Hashes notiert**. Für Materials 04 gibt es die dokumentierte Ausnahme mit der Getter-Annotation. Notierte Hashes belegen nur die heutige Gleichheit, nicht die zeitliche Reihenfolge Beispiel → Implementierung.
- Auswirkung: Leser finden in den Modellseiten das Gegenteil des Gesamtstatus. Das Example-First-Gate ist nicht unabhängig belegbar.
- Vorschlag: Statussätze in den Modelldateien auf einen Verweis auf den zentralen Abnahmebericht vereinheitlichen. Air-Noise-Hashes ergänzen. Den Freeze ehrlich als selbstberichtet kennzeichnen, oder künftig Freeze-Commits verwenden.

### L1 (Niedrig–Mittel) – Inkonsistente Semantik bei explizitem `undefined` in Live-Aktionen; teils stiller Reset auf Defaults

Trigger (selbst ausgeführt, `probe1.ts`):

| Modell / Aktion | Ergebnis von `undefined` |
| --- | --- |
| materials `setPolicy({reuseFraction: undefined})` nach 0,9 | **0,25 (Default)** |
| land-use `setDemand({residentialDemand: undefined})` nach 2 | **6 (Default)** |
| mobility `setCarPenalty(undefined)` nach 5 | **0** |
| stormwater `setRain(undefined)` nach 50 | **20** |
| services `setMaxDistanceKm(undefined)` nach 5 | **1,5** |
| air-noise `setTraffic(undefined)` nach 600 | **60** |
| biodiversity `setPermeability(undefined)` nach 0,2 | **1** (im Contract dokumentiert) |
| finance / energy | behalten den aktuellen Wert |
| heat / population | werfen `TypeError` |

- Ursache: `{ ...parameters, ...changes }` mit nachfolgendem `parseParameters`, der `undefined` als Default interpretiert (`models/parameters.ts:31`). Zum Beispiel `models/city-materials/model.ts:91`, `models/city-land-use/model.ts:113`, `models/city-mobility/model.ts:155`.
- Auswirkung: Bei den `Partial<…>`-Policy-Records (materials, land-use) akzeptiert TypeScript `{x: undefined}`, weil `exactOptionalPropertyTypes` nicht gesetzt ist. Ein typisierter Aufrufer kann eine Live-Einstellung also unbemerkt zurücksetzen. Der Land-Use-Contract verspricht „preserves unspecified values“. Für 15 Geschwistermodelle sind drei verschiedene Semantiken ein Lesbarkeits- und Vertragsproblem.
- Vorschlag: Eine Regel für alle festlegen. Empfohlen: `undefined` wirft `TypeError` (wie heat/population), oder `undefined` bedeutet „unverändert“ (wie finance/energy). Dafür einen kleinen gemeinsamen Hilfsweg in `models/parameters.ts` nutzen, nur wenn er die Duplikation wirklich reduziert.

### L2 (Niedrig) – Mobility: Kantenbreite ohne Obergrenze zerstört den Netzgraphen (im Browser reproduziert)

- Code: `models/city-mobility/ui.ts:28` (`width: 1 + link.used`). Fußweg-Kapazität 1000 in `model.ts:61`; `ui/views/network.ts` begrenzt die Breite nicht.
- Trigger: Setup, Car penalty = 5, dann 30× „Dispatch 4 trips“ (pausiert). 121 laufende Fußwege ergeben eine ~121 px breite blaue Kante, die Home, Jobs und die Pfeile überdeckt. Eigene Aufnahme: `/tmp/claude-1000/-home-david--t3-worktrees-city-library-t3-ad043594-efa84c79fbccafc6/fe07ffb3-30d6-4990-b492-0a3f692ab5eb/scratchpad/mobility-wide-walk-edge.png`.
- Vorschlag: Breite relativ zur Kapazität skalieren und begrenzen, z. B. `1 + 5 * Math.min(1, used / capacity)`. Die Belegungszahl gibt es ohnehin im Inspector.

### L3 (Niedrig) – Heat: Der Kartenvergleich ist im Default unsichtbar

- Code: `models/city-heat/ui.ts:49` (drei feste Klassen <30 / 30–40 / >40 °C).
- Visuell (`city-heat-{narrow,desktop}-{light,dark}.png`): Nach 11 h liegen die Blöcke bei 46,5 / 43,3 / 40,1 °C. Alle drei sind **gleich rot**, ohne Zelltrennung, und erscheinen als ein einziger roter Balken. Die Kernaussage „versiegelt heißer als bepflanzt“ steht nur im Text. Gleichgewicht nach 48 h: 48,0 / 44,5 / 41,0 °C, also dauerhaft gleiche Farbe.
- Vorschlag: Eine sequenzielle indexierte Skala über einen festen Bereich (z. B. 20–50 °C) und sichtbare Zellabstände verwenden.

### L4 (Niedrig) – Housing: Das „Diagramm“ ignoriert die definierten Statusfarben

- Code: `models/city-housing/ui.ts:43-53` nutzt `kind: "count"`. `ui/views/collections.ts:140ff` zeichnet für `count` keine Glyphen, nur Text.
- Visuell: Ein ~460 px hohes dunkles Feld zeigt nur „home-1: 1 … Displaced: 0“. Die in `ui.ts` gesetzten Farben für housed, vacant, unhoused und displaced erscheinen nie. Die Beschriftung „home-4: 0“ sagt nicht „vacant“.
- Vorschlag: `items`-Zeilen (ein Glyph pro Haushalt bzw. Wohnung mit Statusfarbe) oder `capacity`-Zeilen verwenden. Alternativ ehrlich eine Tabelle zeigen.

### L5 (Niedrig) – Flussgrößen-Zeitreihen beginnen mit einem künstlichen Anstieg ab 0

- Betroffen: energy (`ui.ts` Hourly electricity/heat), water (Daily supply), materials (Daily flows), economy (Payroll/Sales), services (Daily access, Mean distance).
- Das Setup-Sample (Tick 0) enthält Flüsse = 0 und wird als Punkt geplottet. Beispiel `city-water-narrow-light.png`: Supplied steigt scheinbar von 0 auf 200 m³/Tag. Der Mechanismus hat diesen Anstieg nicht, und er wirkt wie ein Hochfahren.
- Vorschlag: Für Intervallflüsse das Setup-Sample in der Serie weglassen (`history.filter(s => s.tick > 0)`) oder Intervallende-Achsen konsequent beschriften (Energy macht das teilweise schon).

### L6 (Niedrig) – Water-Netzwerk verspricht Mengen, die es nicht zeigt

- `models/city-water/ui.ts:24`: Label „Daily water transfers (m³) · schematic“, aber `waterNodes()` hat keine Werte in den Beschriftungen (vgl. Materials, das sie zeigt). Vorschlag: Mengen in die Knotenlabels schreiben oder „(m³)“ aus dem Titel entfernen.

### L7 (Niedrig, kosmetisch)

- Heat: Monitor „Budget residual (J)“ zeigt `-0.000000` (negative Null); „Stored heat (J) 1431481624“ ohne Gruppierung.
- Materials: Serienlabels in Kleinbuchstaben (`generated`, `collected` …) im Gegensatz zu allen anderen Legenden.
- Stormwater: Labels „80% sealed“/„20% sealed“ überlappen bei 390 px Rechteckrand und Zuleitung (`city-stormwater-narrow-dark.png`).
- Land use: Commercial- und Green-Linie liegen ab Jahr 2 übereinander (3 ha), Commercial ist nicht sichtbar.

Kein Finding, aber erwähnenswert: Spatial-Canvases sind auch im Light-Theme dunkel. Das ist beabsichtigtes gemeinsames Design (`--view-background: #151515` in `ui/agent-lab/app.css:24`), kein Fehler dieser Änderung.

---

## 2. Architektur- und Produktfeedback

- **Domain/UI-Grenze:** Eingehalten. Alle Bilanzen und Messgrößen liegen in `model.ts`. `ui.ts` projiziert und formatiert nur; die einzige Klassifikation in der UI sind die Heat-Farbschwellen. Schreibzugriffe laufen über definierte Aktionen bzw. `change`.
- **Bibliotheksnutzung:** World/run, storage.history, measurements, Grid, Graph (`allDistances`), Resource, twoPhase, continuous.linear und geometry.distance werden sinnvoll genutzt. Bei `services` dient Resource nur als Tageszähler (anlegen, beanspruchen, sofort freigeben). Das ist vertretbar, aber eher Demonstrations-Reuse als Mehrwert. Mit 41 µs/Tag ist Services das langsamste Modell (100k Schritte in 4,1 s); unkritisch.
- **Bilanzgrößen:** `accountingError`, `balanceErrorM3`, `electricityBalanceKwh` usw. sind größtenteils algebraische Identitäten der eigenen Schrittformeln. Sie prüfen Gleitkomma-Drift, nicht die Mechanik. Das ist in Ordnung, sollte aber nicht als unabhängige Validierung verkauft werden.
- **Einheitlichkeit der Observations:** daily-activities, mobility, services, stormwater und heat liefern detachte, aber **nicht eingefrorene** Objekte (vertragsgemäß „detached“). Die übrigen frieren ein. Für spätere Kopplung lohnt sich eine einheitliche Regel. Ebenso fehlt `done` bei mehreren Modellen.
- **Dynamik:** Mehrere Modelle laufen in 1–2 Schritten in einen stationären Zustand (housing ab Monat 2, economy ab Monat 2, services ab Tag 1, land-use ab Jahr 2, biodiversity konvergiert zu 0,5). Für Lehrzwecke ist das legitim. Die Beispiele zeigen dann aber eher Bilanzarithmetik als Systemverhalten. Sinnvolle nächste Schritte ohne Kalibrierung: Tagesgang für Heat und Energy, Netz-Rückkopplung in der Mobility-Moduswahl (der Bypass existiert, wird aber nie genutzt; das ist dokumentiert), patch-spezifische Vegetationsqualität in Biodiversity, Zinsen bzw. Kreditlimit in Finance.
- **Anschlussfähigkeit für Kopplung:** Gut vorbereitet durch klare Einheiten in Feldnamen (`…M3`, `…Kwh`, `…Wm2`), `read()`-Snapshots und Aktionen statt Zustandszugriff. Für eine spätere Kopplung fehlen ein gemeinsamer Zeitschritt-Vertrag (Stunden, Tage, Monate und Jahre gemischt) und eine einheitliche Undefined/Policy-Semantik (siehe L1).
- **Beispiele (4 pro Modell):** Größtenteils sinnvoll. Sie decken Setup, handgerechnete erste Schritte bzw. Bilanz, eine Intervention sowie Validierung und Isolation ab. Population (M1) und teilweise Services (immer 6/6, statisch) friere eher Implementierungsdetails ein, als einen Mechanismus zu zeigen.

## 3. Evidenzbasierte Stärken

- Alle 60 öffentlichen Skripte liefen bei mir einzeln mit Exit 0. 60 fokussierte Tests in 15 Dateien bestanden (61 724 Expectations). `bun run typecheck`: 1851 Dateien, 0 Fehler, 0 Warnungen.
- Langlauf mit Defaults (100 000 Schritte je Modell): keine Exceptions, keine nicht-endlichen Werte, History korrekt begrenzt. Population mit Überlauf-Szenario (1e6, birthRate 0,2, deathRate 0) wirft in Jahr 507 sauber `RangeError` vor dem Commit; Tick und History bleiben konsistent.
- Massen- und Volumenbilanzen exakt im geprüften Umfang: water (Rest 0 nach 10 Tagen), materials (0 nach 365 Tagen), heat (Residuum 2,4e-7 J nach 48 h). Air-noise-Transport ist algebraisch massenerhaltend (selbst nachgerechnet).
- Heat: Der explizite Euler-Schritt ist stabil (λ·Δt = 20·3600/360000 = 0,2).
- Validierung über die kanonischen Deskriptoren ist atomar (Parse vor Zuweisung) in allen gelesenen Aktionen.
- Lesbarkeit: Dateien sind 107–186 bzw. 38–69 Zeilen lang, mit benannten Konstanten und sichtbarer Schrittreihenfolge und ohne neue APIs oder Abhängigkeiten.

## 4. Einschätzung pro Modell

| Modell | Einschätzung |
| --- | --- |
| Population | Sauber implementiert, aber das Default-Szenario ist ein Rundungsartefakt (M1); undefined wirft korrekt. |
| Housing | Korrekt und klar; trivial schnelle Konvergenz; das Diagramm zeigt keine Statusfarben (L4); Screenshot-Tabellenkopf leer (M2). |
| Land Use | Korrekt, Bilanz 12 ha; undefined setzt den Default zurück (L1); kleine Legendenüberdeckung. |
| Daily Activities | Korrekte Personenstunden-Buchhaltung (48 = 2×24); grober 1-h-Reiseschritt ist dokumentiert. |
| Mobility | FIFO-Queues korrekt; Moduswahl ignoriert Staus (dokumentiert); Kantenbreite unbegrenzt (L2); undefined-Reset (L1). |
| Economy | Geldfluss konsistent (Gesamtkasse wächst um externalDemand/Monat); Firmen-Überziehung unbegrenzt (dokumentiert). |
| Services | Korrekt, aber statisch (jeden Tag identisch); Resource nur als Zähler; langsamstes Modell. |
| Energy | Stunden-Dispatch korrekt; Bilanzzeilen sind Identitäten; Tabelle scrollt intern (ok); Flüsse beginnen bei 0 (L5). |
| Water | Bilanz exakt; Netzwerktitel verspricht m³-Werte (L6); Spill vor Entnahme dokumentiert. |
| Stormwater | Bilanz exakt; Infiltration ohne Sättigung (dokumentiert); Labelüberlappung bei 390 px. |
| Heat | Physikalisch konsistentes, stabiles Budget; konstanter Antrieb ohne Nacht (dokumentiert); Karte uniform rot (L3). |
| Air & Noise | Massenbilanz und dB-Addition korrekt; Desktop-Tabelle abgeschnitten, Narrow-Kopf leer im Screenshot (M2); Freeze-Hashes fehlen (M3). |
| Biodiversity | Rekurrenz analytisch beschränkt, twoPhase korrekt; Qualität global, daher räumlich wenig aussagekräftig. |
| Materials | Bilanz exakt; undefined-Reset (L1); Legenden-Kleinschreibung. |
| Finance | Einfach und korrekt; keine Zinsen und keine Bilanzgröße; undefined behält den aktuellen Wert. |

## 5. Geprüft / nicht geprüft

**Geprüft:**
- AGENTS.md, CODING_STANDARDS, NAMING_CONVENTIONS (relevante Teile), `models/parameters.ts`, `models/definition.ts`, `library/world/run.ts`, `library/storage/history.ts`, `ui/views/collections.ts` (collectionDiagram), `ui/svelte/views/views.css`, `theme.ts`, Netzwerk-Kantenbreite.
- Alle 15 `model.ts` und `ui.ts` vollständig.
- Contracts für population, housing, land-use und daily-activities vollständig; für mobility, services, air-noise, biodiversity und materials gezielt; READMEs teilweise.
- Der zentrale Doku- und Abnahme-README sowie `final-independent-review.md` (Anfang).
- Screenshots visuell geöffnet:
  - narrow: heat (light+dark), population (dark), housing (light+dark), air-noise (light), services (light), energy (dark), mobility (light), economy (dark), water (light), daily-activities (light), materials (dark), stormwater (dark), biodiversity (light), finance (light), land-use (dark)
  - desktop: housing (light), land-use (light), air-noise (dark)
  - Zusatzaufnahmen: `air-noise-table-left`, `mobility-walking-policy`
- Eigene Browserprüfung (Preview-Tab, `localhost:3101` aus diesem Worktree):
  - Housing 390 px light: Tabellenköpfe live vorhanden, Dokument-Breite 390 (kein Seitenüberlauf), Tabellen-Container 463/366 scrollt intern.
  - Mobility 1366 px: Kantenbreiten-Randfall reproduziert.

**Nicht geprüft:**
- Nicht jede der 60 Aufnahmen einzeln geöffnet. Nicht geöffnet wurden u. a. die meisten Desktop-Dark/Light-Paare außer den genannten sowie population/finance/water/economy desktop.
- Dark-Theme live im Browser.
- Tastatur- und Assistive-Technologie-Abläufe.
- Alle Contract-Texte Wort für Wort.
- `/tmp/city-models-report.html` und `city-models-report/index.html` (local capture, not tracked) nicht geöffnet. Deren Aussagen zu Screenshots und Codeauszügen sind ungeprüft.
- Vollständiges `bun run check` (Migration, Library-Build, Consumer) nicht ausgeführt. `bun tests/public-contracts.ts` lief separat: **352 Skripte bestanden**, Exit 0.

## 6. Ausgeführte Befehle (Auszug)

- `git status --short`, `git diff` (PLAN.md, models/README.md)
- `bun <scratchpad>/probe1.ts`: undefined-Semantik in 11 Live-Aktionen
- `bun <scratchpad>/probe2.ts`: Population-Langlauf/Überlauf, Finance, Materials, Heat, Housing, Economy, Biodiversity, Water sowie 100 000 Schritte je Modell
- `bun <scratchpad>/p3.ts`: Freeze-Status der Observations
- `bun <scratchpad>/hash.ts`: SHA-256 aller 60 Skripte gegen Contract, Evidence und SHA256SUMS; `sha256sum -c` für 4 SHA256SUMS (alle OK)
- `for f in tests/public-contracts/city-*/0*.ts; bun $f`: alle 60 mit Exit 0
- `bun test models/city-* tests/public-contracts/city-*`: 60 pass, 0 fail
- `bun run typecheck`: 0 Fehler, 0 Warnungen
- `bun tests/public-contracts.ts`: 352 öffentliche Skripte bestanden, Exit 0
- Browser: Preview-Tab auf `localhost:3101` (Housing 390×844 light; Mobility 1366×768), danach geschlossen.

## 7. Unabhängige Empfehlung

**Änderungen nötig, mit offenen Prüfgrenzen.**

Vor einer Abnahme bzw. einem Merge empfehle ich:

1. **M1:** Population-Rundung und Defaults bewusst entscheiden, inklusive dokumentierter Vertragsänderung, oder den Effekt mindestens quantitativ dokumentieren.
2. **M2:** Housing- und Air-Noise-Screenshots neu aufnehmen und die Review-Aussagen korrigieren.
3. **M3:** Statussätze in den Modell-READMEs und Contracts vereinheitlichen und die Air-Noise-Hashes ergänzen.
4. **L1:** Eine einheitliche undefined-Semantik festlegen.
5. **L2–L6:** Kleine UI-Korrekturen; jede bekommt eine echte Browserprüfung mit frisch aufgenommenen Screenshots.

Die Domänenimplementierungen selbst sind solide und brauchen keine Neuarchitektur.
