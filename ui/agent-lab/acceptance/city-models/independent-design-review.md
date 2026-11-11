# Unabhängiger Design- und Implementierungs-Review: 15 City-Library-Modelle

**Prüfdatum:** 10. November 2026  
**Prüfer:** Unabhängiger Review-Subagent (Antigravity `gemini-3.8-flash`)  
**Basis-Revision:** `42a289785ee3c9879800d2dd7e8532d04032a7ab` (Branch `t3/city-simulation-models`)  
**Prüfungsart:** Read-only Design-, Architektur-, Code- und Screenshot-Review (keine Code-Edits, keine delegierten Subagents)  
**Zugehörige Dokumente:** `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/CODING_STANDARDS.md`, `PLAN.md`, `CROSS-TRACK-CONTRACTS.md`

---

## 1. Prüfumfang und Methodik

Gegenstand dieser unabhängigen Begutachtung sind die 15 neuen City-Library-Modelle inklusive ihrer zugehörigen öffentlichen Vertragstests und Benutzeroberflächen:

1. `city-population` (Bevölkerung & Haushalte)
2. `city-housing` (Wohnungsmarkt & Mietanpassung)
3. `city-land-use` (Flächennutzung & Flächenschutz)
4. `city-daily-activities` (Tagesaktivitäten & Wegeketten)
5. `city-mobility` (Städtische Mobilität & Routenwahl)
6. `city-economy` (Beschäftigung, Löhne & Geldkreislauf)
7. `city-services` (Daseinsvorsorge & Einzugsbereiche)
8. `city-energy` (Strom- und Fernwärmeversorgung)
9. `city-water` (Wasserversorgung & Abwasserreinigung)
10. `city-stormwater` (Regenwasserbewirtschaftung & Rückhaltebecken)
11. `city-heat` (Oberflächenwärmebilanz)
12. `city-air-noise` (Luftschadstoffe & Lärmbelastung)
13. `city-biodiversity` (Habitatvernetzung & Inselbiogeographie)
14. `city-materials` (Urbane Stoffströme & Abfallverwertung)
15. `city-finance` (Kommunalfinanzen & Infrastrukturunterhalt)

Für jedes Modell wurden geprüft:
- `models/<slug>/model.ts` (Headless Domain-Logik)
- `models/<slug>/ui.ts` (Deklarative UI-Definition)
- `models/<slug>/contract.md` und `README.md` (Spezifikation und Grenzen)
- `tests/public-contracts/<slug>/01-04*.ts` (Gefrorene Vertragstests)
- Reale Screenshots unter `/tmp/city-{housing,mobility,economy,air-noise}-{desktop,narrow}-{light,dark}-settled.png` (16 Bilddateien mit OCR- und Metadaten-Analyse)

---

## 2. Kriterienprüfung

### 2.1 Wiederverwendung der öffentlichen Bibliothek (Public Library Reuse)
- **Befund:** Konsequent und vorbildlich umgesetzt.
- **Details:** Alle Modelle nutzen kanonische Primitiven der `city-library`:
  - `World` und `run` als einzige Simulations- und Taktsteuerung.
  - `storage.history` für die Zeitreihenerfassung (überall mit definierter Kapazität).
  - `Resource` aus der Salabim-Integration für Kapazitätsreservierungen (`city-mobility`, `city-services`). Es wurde kein paralleler Zähler oder Schattenmechanismus erfunden.
  - `Grid` für räumliche diskrete Zellen (`city-air-noise`, `city-heat`, `city-land-use`, `city-stormwater`).
  - `Graph` für Netzwerkstrukturen (`city-mobility`, `city-biodiversity`).
  - `Agent` für diskrete ökonomische Akteure mit Identität (`city-economy`).
  - `geometry` für metrische Abstandsbestimmung (`city-services`).
  - `measurements` für zustandslose Beobachtungsaggregationen (`city-housing`, `city-population`, `city-water`).
  - `continuous.linear` für kontinuierliche Zustandsübergänge (`city-heat`).
  - `twoPhase` für entkoppelte Recurrence-Schritte (`city-biodiversity`).
- **Bewertung:** Vollständig konform mit `docs/ARCHITECTURE.md` und `CROSS-TRACK-CONTRACTS.md`.

### 2.2 Headless Single-State-Owner (Architektur & Entkopplung)
- **Befund:** Vollständig erfüllt.
- **Details:**
  - Jedes `model.ts` ist framework-unabhängig und frei von Browser-/DOM-Abhängigkeiten. Alle 15 Modelle sind vollständig headless unter Bun/Node ausführbar.
  - Jedes Modell besitzt seinen eigenen Zustand. Zustandsänderungen erfolgen ausschließlich über definierte Aktionen (`advance()`, typsichere Setter wie `setPolicy()`, `setTraffic()`).
  - Beobachterfunktionen (`read()`) liefern unveränderliche, freistehende Momentaufnahmen (`Object.freeze(...)`), wodurch ein Durchgreifen von UI oder Tests in interne Referenzen verhindert wird.
- **Bewertung:** Vollständig genehmigt.

### 2.3 Numerische Korrektheit und Erhaltungssätze (Accounting & Balances)
- **Befund:** Mathematisch und buchhalterisch exakt.
- **Details:**
  - **Massenbilanz:** `city-air-noise` (emittiert = zerfallen + ausgetreten + retiniert); `city-materials` (Abfall_Start + Summe(Erzeugt) = Unabgeholt + Summe(Wiederverwendet) + Summe(Recycelt) + Summe(Deponiert)).
  - **Wasserbilanz:** `city-water` (Startspeicher + Zufluss = Endspeicher + Überlauf + Verbraucht + Gereinigt + Ungereinigt); `city-stormwater` (Regen = Infiltriert + Abfluss; Beckenbilanz schließt exakt).
  - **Energiebilanz:** `city-energy` (Erneuerbar + Batterieentladung + Netzimport + Ungedeckt = Bedarf + Batterieladung + Abregelung); `city-heat` (abgespeicherte Energie entspricht exakt dem Integral der Netto-Wärmeströme).
  - **Finanz- und Geldkreislauf:** `city-economy` (Gesamtkassenguthaben = 360 + Monat * 40 exakt entsprechend der externen Nachfrage); `city-finance` (Kassenbestand und Investitionsstau schließen jahresgenau).
  - **Bevölkerungs- und Haushaltsbilanz:** `city-population` (Einwohner = Start + Geburten - Todesfälle + Wanderungssaldo; Kohortenverschiebung und Haushaltsbildung ganzzahlig konsistent).
  - **Flächenerhaltung:** `city-land-use` (Wohnen + Gewerbe + Grün = 12 ha konstant).
- **Bewertung:** Keine Rundungs- oder Akkumulationslecks. Bilanzen schließen exakt.

### 2.4 Eingabevalidierung und Typsicherheit
- **Befund:** Strikt und defensiv implementiert.
- **Details:**
  - Initialisierungsparameter werden über `parseParameters(inputs, options)` typisiert und gegen Min/Max/Integer/Step geprüft.
  - Unbekannte Optionen, Nicht-Objekte oder Accessor-Getter werden strikt mit `TypeError` abgewiesen.
  - Schrittweiten in `advance(stepCount)` werden durchgängig mittels `validateStepCount(stepCount)` validiert (Ganzzahl 0 bis 1.000.000).
  - Live-Setter (z. B. `setPolicy`) validieren Records gegen Prototyp-Pollution und ungültige Schlüssel.
- **Bewertung:** Hervorragend.

### 2.5 Wissenschaftliche Annahmen vs. README-Aussagen
- **Befund:** Vorbildliche wissenschaftliche Redlichkeit.
- **Details:**
  - Alle 15 READMEs stellen klar, dass es sich um **synthetische, didaktisch abgegrenzte Lehrmodelle** handelt.
  - Es werden keine empirischen Kalibrierungsansprüche erhoben.
  - Vereinfachungen (z. B. keine dynamische Routenwahl mit Stauantizipation in `city-mobility`, vereinfachte Alterskohorten ohne ethnische/geografische Differenzierung in `city-population`, idealisierte 3-Box-Mischung in `city-air-noise`) werden transparent und explizit offengelegt.
- **Bewertung:** Volle Übereinstimmung zwischen Code und Dokumentation.

### 2.6 Gefrorene Vertragstests (Frozen Assertion Coverage)
- **Befund:** Vollständig vorhanden und unverändert.
- **Details:**
  - Jedes der 15 Modelle verfügt über exakt 4 nummerierte Vertragstests (`01-setup.ts`, `02-*.ts`, `03-policy.ts`, `04-validation-*.ts`).
  - Die SHA-256-Prüfsummen entsprechen den vor Implementierungsbeginn eingefrorenen Gate-Hashes.
  - Die Tests sichern exakte Handrechnungen, langfristige Erhaltungssätze (bis zu 300 Zeitschritte), fehlerhafte Eingaben und die deterministische Reproduzierbarkeit ab.
- **Bewertung:** Testabdeckung erfüllt das Example-First-Gate uneingeschränkt.

---

## 3. Befunde nach Schweregrad, Pfad und Zeile

### 3.1 Mittlerer Schweregrad (Medium Severity) — Visuelle Defekte & Inkonsistenzen

#### Befund 1: Fehlende Zahlenformatierung in Expositionstabelle führt zu Spaltenüberlauf
- **Pfad:** `models/city-air-noise/ui.ts`
- **Zeilen:** 24–30
- **Problem:** In der Tabellendefinition `Receptor exposure · concentration integral and sound energy` werden rohe Gleitkommazahlen ohne Formatierungsanweisung übergeben:
  ```ts
  { type: "table", label: "Receptor exposure · concentration integral and sound energy", rows: state => state.receptors.map(receptor => ({
    "Distance (m)": receptor.xMeters,
    "Air (µg/m³)": receptor.concentrationMicrogramsPerCubicMeter,
    "Air exposure (µg·min/m³)": receptor.concentrationExposureMicrogramMinutesPerCubicMeter,
    "Sound (dB)": receptor.noiseDecibels,
    "Sound exposure (J/m²)": receptor.noiseExposureJoulesPerSquareMeter,
  })) }
  ```
- **Visuelle Evidenz (Screenshots):** In allen vier Screenshots (`/tmp/city-air-noise-desktop-light-settled.png`, `dark`, `/tmp/city-air-noise-narrow-light-settled.png`, `dark`) werden Werte wie `1.1999752528499812`, `18.81621084571816` und `63.03196...` ausgegeben. Auf dem schmalen Viewport (390 px) führt dies zu einem horizontalen Überlauf: Die Spaltenköpfe und Zellinhalte werden bei `Air exposure (ic` und `Sound (dl` unleserlich abgeschnitten; die fünfte Spalte verschwindet komplett.
- **Korrekturempfehlung:** Zahlen in den Tabellenzeilen mit `.toFixed(2)` bzw. wissenschaftlicher Notation formatieren (z. B. `.toExponential(2)` für Schallenergie).

#### Befund 2: Fußgängerroute im Mobilitäts-Netzwerkgraphen ausgeblendet
- **Pfad:** `models/city-mobility/ui.ts`
- **Zeile:** 22
- **Problem:** Die Netzwerkansicht filtert ausschließlich Autoverbindungen:
  ```ts
  edges: state => state.links.filter(link => link.mode === "car").map(link => ({ ... }))
  ```
- **Visuelle Evidenz (Screenshots):** Im Screenshot (`/tmp/city-mobility-desktop-light-settled.png`) werden zwar die Haltestellen `Home`, `Junction`, `Jobs` gezeigt, aber die Fußgängerverbindung (`walking-path`) existiert visuell nicht. Wenn der Nutzer die Strafzeit `carPenalty` erhöht und alle Fahrten als Gehwege disponiert werden, zeigt das Netzwerk keinerlei Kanten oder aktive Wege.
- **Korrekturempfehlung:** Fußgängerverbindungen mit eigenem visuellen Stil (z. B. gestrichelt oder mit separater Farbcodierung) im Graphen mitführen oder die Beschriftung und das Modell explizit darauf ausrichten.

---

### 3.2 Geringer Schweregrad (Low Severity) — UI-Layout & Beschriftungen

#### Befund 3: Haushaltsknoten überlappen auf schmalen Bildschirmen
- **Pfad:** `models/city-economy/ui.ts`
- **Zeilen:** 44–48
- **Problem:** Die Positionierung der Haushalte im Beschäftigungsnetzwerk ist fest auf `x: (index % 2 - 0.5) * 220` und `y: Math.floor(index / 2) * 100` gesetzt.
- **Visuelle Evidenz (Screenshots):** In den Screenshots `/tmp/city-economy-narrow-light-settled.png` und `dark` (390 px Breite) stoßen die Knotenbezeichnungen (`H1 employed`, `H2 employed` etc.) horizontal und vertikal aneinander und überlappen sich teilweise mit den Knotenkreisen.
- **Korrekturempfehlung:** Den horizontalen Offset für schmale Viewports skalieren oder die Labels im Graphen kompakter gestalten (z. B. `H1` im Knoten, Status im Tooltip/Inspector).

#### Befund 4: Unnötige `(unordered)`-Annotation in der Collection-Ansicht
- **Pfad:** `models/city-housing/ui.ts`
- **Zeilen:** 42–53
- **Problem:** In `housingDiagram` wird für die Zeilen kein `order: "supplied"` deklariert. Dadurch fällt `ui/views/collections.ts` auf den Default `order: "unordered"` zurück.
- **Visuelle Evidenz (Screenshots):** In den Screenshots `/tmp/city-housing-desktop-light-settled.png` und `narrow` wird an jeder einzelnen Zeile der Text `(unordered)` gerendert (z. B. `home-1: 1 item (unordered)`, `Never housed: 1 item (unordered)`), was visuelles Rauschen erzeugt.
- **Korrekturempfehlung:** In `models/city-housing/ui.ts` für die Zeilen explizit `order: "supplied"` angeben, um das Label sauber zu halten.

---

## 4. Differenzierung: Implementierungskorrekturen vs. Genehmigungsstatus

### 4.1 Erforderliche Implementierungskorrekturen (Vor endgültiger UI-Freigabe)
1. **`models/city-air-noise/ui.ts` (Zeilen 24–30):** Formatierung aller Tabellenwerte mit `.toFixed(2)` bzw. `.toExponential(2)` zur Vermeidung von Spaltenüberlauf und Textabschneidung.
2. **`models/city-mobility/ui.ts` (Zeile 22):** Einbindung des Fußwegs in die Netzwerkansicht oder Anpassung der Ansichtssemantik.
3. **`models/city-economy/ui.ts` (Zeilen 44–48):** Entzerrung der Knotenkoordinaten für schmale Viewports.
4. **`models/city-housing/ui.ts` (Zeilen 42–53):** Bereinigung der `(unordered)`-Kennzeichnung durch Angabe von `order: "supplied"`.

### 4.2 Unabhängiger Genehmigungsstatus (Independent Approval State)

| Bereich / Komponente | Status | Begründung |
| :--- | :--- | :--- |
| **Domain-Modelle (`models/city-*/model.ts`)** | **GENEHMIGT (APPROVED)** | Vollständige Headless-Entkopplung, einwandfreie Erhaltungssätze (Masse, Wasser, Energie, Geld, Fläche, Bevölkerung), strikte Parameter- und Schrittvalidierung, saubere Nutzung der Bibliotheksfunktionen. |
| **Vertragstests (`tests/public-contracts/city-*`)** | **GENEHMIGT (APPROVED)** | Alle 15 Modelle verfügen über 4 unveränderte, gefrorene Vertragstests mit exakter mathematischer Abdeckung und deterministischer Isolation. |
| **Wissenschaftliche Dokumentation (`README.md`)** | **GENEHMIGT (APPROVED)** | Klare und ehrliche Deklaration der synthetischen Modellgrenzen; keine ungedeckten empirischen Kalibrierungsversprechen. |
| **Benutzeroberflächen (`models/city-*/ui.ts`)** | **VORBEHALTLICH (CONDITIONAL)** | Freigabe für 11 Modelle erteilt. Für die 4 Modelle mit visuellen Mängeln (`city-air-noise`, `city-mobility`, `city-economy`, `city-housing`) ist die UI-Freigabe **vorbehaltlich der Behebung der Befunde 1 bis 4** und einer anschließenden Screenshot-Wiederholungsprüfung. |

---
*Dieser Bericht wurde unabhängig erstellt und trennt verifizierte Testergebnisse und reale Bildbefunde strikt von Entwurfsvorschlägen.*
