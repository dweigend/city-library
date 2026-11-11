# Unabhängige visuelle Prüfung – Revision 2 der fünfzehn Stadtmodelle (Opus 5.5)

Prüfer: frische Claude-Opus-5.5-Instanz, nicht der Implementierer. Datum 2026-11-10. Nur Prüfung: keine Repository-Änderungen, keine Commits, keine Kind-Agenten.
Scope: repository worktree (local, not tracked), Branch `t3/city-simulation-models` (neue Dateien nicht versioniert).

Gelesen: `docs/DESIGN.md`, `docs/development/city-simulation-models.md`, `docs/development/city-model-research.md`, `ui/agent-lab/acceptance/city-models/README.md` (Abschnitt Revision 2), `revision-2-author-responses.md`, `revision-2-host-enter.md`, `revision-2-host-enter-results.json`, `git diff ui/svelte/Workbench.svelte` sowie die betroffenen `models/city-*/ui.ts`-Stellen (gezielt, nicht vollständig). Die genannten Skills (frontend-design, shadcn-svelte, web-design-guidelines) sind in dieser Sitzung **nicht** als aufrufbare Skills verfügbar. Ich habe stattdessen DESIGN.md und die allgemeinen Grundsätze für Diagramme und Web-Interfaces angewandt; ein Fetch der Guidelines fand nicht statt.

Revision-1-Freigaben und `opus-5-5-review.md` habe ich als historisch behandelt. Sie gelten nicht als Freigabe dieses Codes.

## Bildinventar und tatsächlich angesehene Bilder

`ls ui/agent-lab/acceptance/screenshots/city-models/` ergibt 147 Dateien: 143 Modellbilder und 4 Host-Bilder. **Alle 147 habe ich als Pixelbild geöffnet** (Read-Bildwerkzeug, keine OCR):

- 60 Viewport-Kernaufnahmen: je Modell `default-desktop-light`, `default-narrow-dark`, `intervention-desktop-dark` und `intervention-narrow-light`.
- 75 Element-Aufnahmen: je Modell `default-desktop-light-element-0`, `default-narrow-dark-element-0`, `intervention-desktop-dark-element-0/1` und `intervention-narrow-light-element-0`.
- 8 Sonderaufnahmen: `air-noise-table-narrow-light-figure-4`, `finance-table-desktop-light-figure-3`, `stormwater-table-narrow-dark-figure-3`, `materials-large-desktop-light-element-0` und `-figure-2`, `mobility-1000-trips-narrow-dark-element-0` und `-figure-3`, `population-million-desktop-dark`.
- 4 Host-Aufnahmen: `host-live-enter-{desktop,narrow}-{light,dark}.png`.

**Was die Aufnahmen nicht zeigen (nicht geprüft):** Mehrere Begleitdiagramme sind nur angeschnitten oder fehlen ganz, weil Element-Aufnahmen nur Figur 0 und meist eine weitere Figur abdecken:

- Population „Anonymous households by size“
- Housing „Housed households by income group“ und „Posted rent“
- Land Use „Built area“, „Urban edge“ und den Inspector
- Daily Activities „Person-hours today by activity“
- Mobility „Cars waiting in queues“ und „Completed trip times“ mit Daten
- Economy „Orders, sales and lost orders“
- Services „Daily requests by outcome“
- Energy „Battery stored energy“
- Water „Daily demand and who carries the deficit“
- Heat „Cooling water used“
- Biodiversity „Occupancy by patch“
- Materials „Where collected waste went“
- Finance „Mean asset condition“ (nur in der Tabellenaufnahme)

Inspektoren und Tastaturauswahl sind ebenfalls nicht abgebildet.

## Eigene Browserprüfung (eigener Tab, localhost:3101)

- `preview_status` meldete vor dem Start keinen Tab. Ich habe einen eigenen Hintergrund-Tab geöffnet (1280×800, hell) und am Ende geschlossen.
- **Urban Employment / Host-Enter:** Setup per Klick, dann 10 steps → Monat 10. Danach echte Tastaturaktionen: „Outside orders“ geleert, `30` getippt, `Enter`. Ergebnis: Monat **bleibt 10**, Fokus bleibt auf `…externalDemand`, Wert 30, `input.form === null`, kein horizontaler Überlauf. 1 step → Monat 11, Employed 9, Orders/month 90. Damit ist der Coordinator-Befund unabhängig reproduziert.
- Setup-Feld „Household Count“ auf `31` gesetzt, `Enter` → Monat 0, Employed 15. **Setup-Enter startet weiterhin neu.** Der Live-Wert blieb danach im Feld 30. Ob der Neustart ihn übernimmt, habe ich nicht weiter geprüft.
- **Daily Activities, Standard:** Ablauf in Schritten zu je 20 Viertelstunden, ohne Screenshots. Um 05:00, 10:00 und 15:00 sind 0 Besorgungen erledigt und 0 verpasst; um 20:00 sind es 6 erledigt und 0 verpasst. Das stützt Befund D1 unten.
- Nicht geprüft: Household Energy Demand (nur die Coordinator-Angabe), ungültiger Live-Wert −1, Dark/Narrow im eigenen Tab und Screenreader. Ich beanspruche keine vollständige Prüfung der Barrierefreiheit oder Physik.

---

## Befunde (nach Schwere sortiert)

Schweregrade: **Hoch** = Kernaussage falsch oder unsichtbar; **Mittel** = Mechanismus oder Größe schwer ablesbar bzw. Beleg fehlt; **Niedrig** = Kosmetik oder Lesbarkeit.

### Mittel

**M-FIN1 – Finance: Rote Kontur verdeckt „repariert in diesem Jahr“.** `models/city-finance/ui.ts:70` setzt `stroke: asset.isPoor ? poorColor : asset.repairedThisYear > 0 ? repairedColor : …`.
- Auslöser: `worst-first`, Jahr 20 (`city-finance-default-*`). Alle 12 Anlagen sind rot umrandet. Laut `model.ts:100-109` gehen 500 CU pro Jahr in die schlechteste Anlage, doch keine Kontur ist amber.
- Folge: Wohin das Instandhaltungsgeld fließt – die Kernaussage des Experiments „Reihenfolge zählt“ – ist im Szenenbild genau im Standardfall unsichtbar.
- Fix: einen eigenen Kanal für „repariert“ verwenden, etwa eine Amber-Markierung bzw. einen Balkenzuwachs in Amber oder ein Label „+500 CU“, unabhängig von der roten Kontur für „poor“.

**M-MOB1 – Mobility: Warteschlange läuft aus der Szene; Autosymbole sind unsichtbar.**
- Teil 1, `models/city-mobility/ui.ts:85-87`: Bis zu 12 Queue-Quadrate liegen bei `path[0] + (index+2)*queueStep` und verlassen die Leinwand links. `city-mobility-intervention-desktop-dark(-element-0).png` zeigt „12 queued“, aber nur etwa 5–6 sichtbare Quadrate, die am linken Rand abgeschnitten sind. Narrow ist ebenso betroffen, auch bei 1000 Fahrten.
- Teil 2: Autos sind orange Dreiecke auf der orangen Hauptstraße und gelbe auf dem gelben Bypass. Im Bild ist praktisch kein Auto erkennbar; „10 driving“ steht nur als Text.
- Fix: Die Warteschlange innerhalb der Szene falten oder als Säule bzw. Zähler mit „+n“ zeichnen. Fahrzeuge in neutraler oder heller Farbe mit dunkler Kontur über der Routenfarbe darstellen.

**M-ENE1 – Energy: Die Szene bilanziert nicht.** `models/city-energy/ui.ts:89`: Die Batteriebox zeigt den **Bestand** (`Battery 0.0/8.0`), nicht den Fluss der letzten Stunde.
- Default 18–19 Uhr: Demand 12 = Solar 2 + Import 5 + Unmet 1 + **Batterie 4**. Die 4 kWh stehen nirgends, obwohl die grüne Linie dick ist. Der Titel verspricht „Energy flows … (kWh)“, also rechnet ein Leser 2+5+1 ≠ 12.
- Fix: Fluss und Bestand trennen, z. B. „Battery −4.0 → (0.0/8.0 kWh)“ oder ein Flusslabel an der Linie.

**M-ENE2 – Energy narrow: Labels sprengen die Boxen.**
- `city-energy-default-narrow-dark(-element-0)` und `intervention-narrow-light(-element-0)`: „Solar+wind 2.0“, „Battery 0.0/8.0“, „Demand 12.0“ und „Heat 4.0 · short 1.0“ ragen über die Boxrahmen und werden von Linien gekreuzt. „Heat net 3.0“ liegt teilweise auf der Linie.
- Auch auf dem Desktop ragt „Heat 4.0 · short 1.0“ über die orange Box hinaus.
- Fix: Labels unter oder über die Box setzen bzw. kürzer fassen, oder die Boxbreite aus der Textlänge ableiten.

**M-DAY1 – Daily Activities: Das Ergebnis der Fragestellung ist in keiner Aufnahme zu sehen.**
- Default: Tag 1 um 07:30. Intervention: Tag 2 um 16:00.
- In beiden Aufnahmen gilt „Errands done 0 / missed 0“. Meine Browserprüfung zeigt: Erledigt wird erst nach 15:00, verpasst wurde im Standard bis 20:00 nichts.
- Die Frage „Which errands still fit into a day?“ wird also visuell nicht beantwortet. Außerdem sind die beiden Zeitpunkte nicht vergleichbar.
- Fix: Beide Zustände zum selben Tagesende aufnehmen (z. B. 20:00). Zusätzlich ein Szenario mit früher Schließzeit, in dem `missed > 0` ist, und den verpassten Zustand im Bild markieren.

**M-DAY2 – Daily Activities narrow: Überlagerungen.**
- `city-daily-activities-*-narrow-*`: Ortsboxen sind etwa 30 px groß.
- Das Label „Middle“ wird von den Kästen „Local shops“ und von Reisenden (magenta) überdeckt. „Work“ und „Services“ stoßen aneinander.
- Desktop 16:00 (`intervention-desktop-dark-element-0`): Magenta-Punkte liegen auf dem Text „Middle“.
- Fix: Labels oberhalb der Boxen setzen, „Local shops“ versetzen und Reisende nicht auf Labelhöhe zeichnen.

**M-EVD1 – Beleglücke: Default und Intervention zu ungleichen Zeitpunkten.**
- Heat: 16:00 gegen 04:00. Stormwater: Stunde 3 gegen Stunde 10. Daily Activities: siehe oben.
- Für „wann helfen Schatten/Bewässerung – tags und nachts“ fehlt der gleichzeitige Vergleich (Heat ohne Schatten um 04:00, mit Schatten um 16:00).
- Fix: Paare zum selben Zeitpunkt aufnehmen.

**M-ECO1 – Economy: „Desired jobs“ übermalt „Employed“.**
- `models/city-economy/ui.ts:29-30`: „Desired“ wird nach „Employed“ gezeichnet.
- `city-economy-intervention-desktop-dark-element-1` zeigt ab Monat 1 nur Orange; die blaue Linie für Beschäftigte ist verschwunden. Das wirkt, als fehle die Serie.
- Fix: „Desired“ gestrichelt oder dünner und zuerst zeichnen, oder als Stufenlinie darstellen.

### Niedrig

- **L-POP1 Population:** Der y-Bereich von „Annual flows“ beginnt bei 10. Die konstante Nettomigration (10) liegt dadurch exakt auf der x-Achse und ist kaum sichtbar (`city-population-default-*`). Fix: y-Achse ab 0.
- **L-HOU1 Housing:** Die y-Achsenbeschriftung „Bid or rent (currency/mon…“ ist abgeschnitten (`intervention-desktop-dark-element-1`, narrow; `models/city-housing/ui.ts:38`). Fix: kürzere Einheit, z. B. „CU/month“, oder Label „Bid or rent“ mit Einheit im Titel.
- **L-HOU2 Housing:** Die Legende „amber building“ und „diamond displaced“ kommt in keiner Aufnahme vor (0 building, 0 displaced). Die Aktion „Commission 3 public homes“ ist nicht belegt. Zusätzlich bleibt der Desktop-Canvas zu etwa einem Drittel leer.
- **L-LAN1 Land Use:** Die Kontur „changed this year“ verwendet Amber `#fbbf24` und liegt auf Orange (Wohnen). Das kontrastiert schwach (`ui.ts:84`) und ist in keiner Aufnahme sichtbar, weil in Jahr 16 0 umgewandelt wurde. Die Linie „Urban edge“ nutzt dasselbe Amber auf weißem Diagrammhintergrund (`ui.ts:60`), was hell schwach kontrastiert; das Bild selbst ist nicht aufgenommen. Außerdem ändert die Intervention zwei Faktoren gleichzeitig (dispersed + Korridor).
- **L-SER1 Services:** Narrow – die Hub-Labels „8/12“ und „6/6“ liegen auf dem weißen Hub-Quadrat und sind teils weiß auf weiß. Das Balkendiagramm „Households by services received“ färbt Kategorie 0 grün, obwohl die Szene 0 = rot definiert. Fix: Label unter das Quadrat setzen und Balken nach der Zugangsfarbe einfärben.
- **L-WAT1 Water:** Die Baseline ist als Auslöser = 1 und Kürzung = 0 kodiert. Die Monitore zeigen deshalb „Below savings trigger: Yes, Saving days 80“, obwohl nichts gespart wird; die Amber-Linie liegt unsichtbar am Beckenrand. Fix: Sparregel ausdrücklich „aus“ schalten oder die Monitore nur bei einer Kürzung > 0 zählen lassen. Narrow: „Inflow 40 (dry)“ stößt an den linken Rand, „City 170/200 Sewage 136“ berühren sich. Die Desktop-Intervention ist um etwa 22 px gescrollt (Aufnahmeartefakt).
- **L-LBL1 Energy/Water/Heat:** Automatisch erzeugte Setup-Labels mit falscher Einheitenschreibweise: „Solar Capacity Kw“, „Battery Capacity Kwh“, „Reservoir Capacity M3“, „Dry Inflow M3Per Day“, „Air Temperature C“, „Solar Flux Wm2“ (`setup:` in `models/city-{energy,water,heat}/ui.ts`). Fix: explizite Labels wie bei den Live-Feldern (kW, kWh, m³/day, °C, W/m²).
- **L-STO1 Stormwater:** Narrow – „60/60 m³“ ragt über das Becken. Die Abflusslinie der ersten Fläche kreuzt den Bodenbalken der zweiten. Die Intervention prüft nur Einzel- gegen Doppelsturm, nicht Infiltration gegen Retention. Der Doppelsturm ist im Hydrographen jedoch sehr klar.
- **L-HEA1 Heat:** 41.3, 39.7 und 38.1 °C liegen im festen 15–50-°C-Maßstab fast in derselben Farbstufe; die Unterschiede tragen nur die Zahlen. Das ist bewusst ehrlich, doch für „Blöcke unterscheiden sich“ schwach. Das Schattenband (dunkelgrün auf Anthrazit) ist kontrastarm. Fix: ein heller Rand für das Band; optional eine Δ-Anzeige pro Block.
- **L-AIR1 Air/Noise:** Die Narrow-Tabelle schneidet die Kopfzeile „Sound (dB“ am Containerrand ab. Ein rechts gescrolltes Bild fehlt (nur `figure-4`), und kein sichtbarer Scroll-Hinweis existiert. Die 0,0-µg-Box ist auf dem Anthrazit-Canvas fast unsichtbar.
- **L-BIO1 Biodiversity:** Der Titel endet mit „gray lines = dispersal links · km“, aber es gibt keine km-Beschriftung; die Zahlen sind Belegungswahrscheinlichkeiten (`models/city-biodiversity/ui.ts:36`). Die blaue Kontur der Ost-Patches ist nirgends erklärt. Die Intervention ändert zwei Faktoren gleichzeitig (Stepping Stone + Brücke entfernt).
- **L-MAT1 Materials narrow:** „Recycled 43/58“ und „Disposed 65/86“ laufen über Boxrahmen bzw. den Canvasrand, „Waste 250“ stößt links an. Bei einer großen Menge (`materials-large-*`) zeigt der Behälter „scale 5000000 kg“ bei 9 998 800 kg Bestand. Die Sättigung ist zwar beschriftet, aber visuell nicht von „genau voll“ zu unterscheiden. Fix: ein Überlaufzeichen oder „>scale“ anzeigen.
- **L-FIN2 Finance:** Narrow – Wert-Labels berühren die Boxkanten, der Titel berührt die Canvas-Oberkante.
- **L-GEN1 Allgemein, Aufnahmeartefakte:** In den Sonderaufnahmen `mobility-1000…figure-3`, `air-noise-table…figure-4`, `finance-table…figure-3` und `materials-large…figure-2` überdeckt die klebende Transportleiste den Kopf der jeweiligen Figur. Den Inhalt beeinträchtigt das nicht, es sind aber keine reinen Figurenbilder. `mobility-1000…figure-3` zeigt ein leeres Histogramm („Completed trip times“ mit 0 Fahrten nach Minute 4); die Verteilung ist damit nicht belegt.
- **L-GEN2 Allgemein:** Serien mit dem Wert 0 liegen auf der x-Achse (Energy „Unmet“, Population Migration, Materials-large) und verschwinden. Formatierungen wie `0.0e+0` und `-4.8e-7` sind für Laien sperrig. Vorschlag: bei |x| < 1e-6 „0“ ausgeben.

---

## Ergebnis je Modell

Einheitliche Fragen: Zeigt die Szene den Kausalmechanismus? Sind Zustände, Größen und Einheiten ablesbar? Ist der Unterschied zwischen Default und Intervention sinnvoll? Sind Skalen und Legenden lesbar? Gibt es Artefakte? Ist die Farbwahl zweckmäßig?

| Modell | Urteil | Begründung |
| --- | --- | --- |
| Population | **Bestanden mit Auflage (L-POP1)** | Die Alterspyramide mit Pulsspitze bei 30–34 nach 10 Jahren zeigt die Kohortenwanderung klar. Die Flussserien beginnen am ersten abgeschlossenen Jahr. Die Million-Aufnahme ist lesbar (Achsen in K/M). Das Haushaltsgrößen-Diagramm ist nicht aufgenommen. |
| Housing | **Bestanden mit Auflagen (L-HOU1/2)** | Gute Einsicht: Zuschuss 400 → Miete 731→900, Niedrigeinkommen kommen unter, zwei Mittelschicht-Haushalte suchen nun (Verdrängungseffekt über den Preis). Der Gebotsknick bei etwa 2500 im Diagramm zeigt die Zuschussgrenze. Bau und Verdrängung sind visuell unbelegt. |
| Land Use | **Bestanden mit Auflagen (L-LAN1)** | Kompakt gegen dispers und der geschützte Korridor sind sofort lesbar (2 gegen 7 Patches, Kante 1.8 gegen 4.4 km). Die Linie „Largest patch“ gegen „All green“ zeigt die Fragmentierung gut. |
| Daily Activities | **Nachbesserung nötig (M-DAY1, M-DAY2, M-EVD1)** | Das Mechanismusbild (Orte, Wege, Reisende) ist verständlich, und die Abwahl der Services bei „local“ ist gut gelöst. Das Ergebnis (erledigt oder verpasst) ist aber nicht zu sehen, die Zeitpunkte sind nicht vergleichbar, und narrow überlagert sich. |
| Mobility | **Nachbesserung nötig (M-MOB1)** | Starke Einsicht: Kapazität 10 → Autoanteil 57→100 %, 0 Fußgänger, Warteschlange 5→12, Wartezeit nahezu unverändert. Die Liniensymbolik ist bei 1000 Fahrten beschränkt und lesbar. Die Warteschlange ist jedoch abgeschnitten, Autos sind unsichtbar, und die Verteilung der Reisezeiten ist nicht belegt. |
| Economy | **Bestanden mit Auflage (M-ECO1)** | Firmenslots, Vakanzen und Arbeitgeberfarben sind klar; die Gleichung „Outside + local = next orders“ erklärt die Rückkopplung hervorragend. Hiring 1 gegen 10 ergibt 46 gegen 8 verlorene Aufträge. Im Diagramm ist die Beschäftigtenlinie verdeckt. |
| Services | **Bestanden mit Auflagen (L-SER1)** | Zentral: 8/12 genutzt, 16 Haushalte zu weit (Dreiecke). Verteilt: 6/6 voll, 4 Haushalte voll abgewiesen (Rauten). Zu weit gegen voll wird per Form unterschieden – genau die geforderte Einsicht. |
| Energy | **Nachbesserung nötig (M-ENE1, M-ENE2)** | Die Lastverschiebung halbiert die Kürzung auf 0 und die Abregelung von 39.2 auf 15.2 kWh; das überlagerte Stundendiagramm zeigt die Zeitlücke gut. Die Szene bilanziert jedoch nicht, und narrow überlaufen die Labels. |
| Water | **Bestanden mit Auflagen (L-WAT1)** | Früh und wenig sparen: Fehlmenge 1200 → 0, schlimmster Tag 80 % → 15 %. Die Nebenwirkung „Untreated 16“ ist sichtbar – eine schöne Zweitordnungseinsicht. Die Baseline-Monitore sind irreführend, narrow ist eng. |
| Stormwater | **Bestanden mit Auflagen (L-STO1, M-EVD1)** | Der Hydrograph zeigt deutlich: Der zweite Sturm trifft ein volles Becken, der Überlauf steigt von 20 auf 29.5. Becken, Boden und Abflüsse samt Einheiten sind klar. Infiltration gegen Retention ist nicht belegt. |
| Heat | **Bestanden mit Auflagen (L-HEA1, M-EVD1)** | Es gibt eine feste Farbskala mit Farbbalken; der Tag-Nacht-Verlauf und das Nachhängen der Oberflächen hinter der Luft (Wärmespeicher) sind im Diagramm klar. ET pro Block zeigt den Wasserpreis. Der Vergleich zur selben Uhrzeit fehlt, die Farbunterschiede sind subtil. |
| Air and Noise | **Bestanden (L-AIR1 kosmetisch)** | Die beste Szene des Satzes: Box-Schattierung entlang der Windrichtung. Mehr Lüftung verschiebt den Hotspot von 250 auf 350 m und erhöht das ferne Ende von 2.0 auf 3.5, während der Lärm unverändert bleibt. Die Größen trennen sich klar, Einheiten sind korrekt. |
| Habitat | **Bestanden mit Auflagen (L-BIO1)** | Netzwerk, Belegungsschattierung, entfernte Brücke („removed“) und Regionsverläufe sind gut lesbar. Ost steigt trotz Brückenentfernung durch den Stepping Stone. Die Legende enthält „km“ ohne Inhalt. |
| Materials | **Bestanden mit Auflagen (L-MAT1)** | Behälter-Bestand, Sammelengpass „120/120“ und Verzweigung sind klar. Sammlung 160 ergibt 450 statt 650 kg Rückstand. Narrow-Labels laufen über, und die Sättigung bei großer Menge ist uneindeutig. |
| Finance | **Nachbesserung nötig (M-FIN1)** | Starker Kontrast: preventive bringt Zustand 0.63 gegen 0.16 und Rückstand 7000 gegen 20100 bei gleicher Kasse 2100. Die Einsicht „Kasse wirkt gesund, Infrastruktur verfällt“ wird gut transportiert. Die Reparaturen sind im Standardfall jedoch unsichtbar. |

Keine Szene ist dekorativer Realismus; alle sind schematisch und an den Mechanismus gebunden. Die wissenschaftlichen Farben sind überwiegend zweckmäßig: fester Temperaturmaßstab, Luftschattierung entlang des Korridors, Formkodierung für „zu weit“ und „voll“. Ausnahmen sind Fahrzeuge in Routenfarbe (Mobility), Amber auf Orange (Land Use) und Amber-Linien auf hellem Diagrammhintergrund.

## Host-Enter-Korrektur (`ui/svelte/Workbench.svelte`)

- Quelle: Die Live-Gruppen liegen jetzt in einem eigenen `Field.Group` nach `</form>`, innerhalb von `<aside class="lab-parameters">`. Es gibt keinen neuen Handler und keine Änderung an `ParameterField`. Der Setup-Button bleibt `type="submit" form={formId}`. Das ist korrekt und minimal.
- Pixel: Alle 4 Host-Bilder habe ich angesehen. Alle zeigen Monat 11, Employed 9 und Orders 90, das Live-Feld mit 30 und Szene „Outside 30 + local 36 = next orders 66“. Hell und dunkel sind konsistent, ohne sichtbaren Layoutbruch.
  - Narrow-Bilder zeigen das geöffnete Parameter-Panel; die Szene liegt unterhalb.
  - Die Bilder zeigen den Zustand **nach** dem Folgeschritt, nicht unmittelbar nach Enter (Monat 10). Der Unmittelbar-Beleg steht nur in der JSON-Datei und in meiner Reproduktion.
- Eigene Reproduktion: siehe oben. Live-Enter behält den Takt (10) und übernimmt den Wert; Setup-Enter startet neu (Monat 0).
- Kleine Hinweise ohne Blocker:
  1. Ohne Live-Felder entsteht ein leeres `Field.Group`, also eine zusätzliche Grid-Lücke.
  2. Die Live-Steuerelemente haben keine gemeinsame benannte Gruppe mehr. Ein `aria-label="Live parameters"` wäre gut, ist aber nicht nötig.
  3. Die Zeile in `README.md` (Revision 2) „Shared host: pressing Enter … Recorded as an open finding … not changed here“ ist nach der Korrektur veraltet und sollte auf `revision-2-host-enter.md` verweisen.
- **Urteil Host-Fix: Freigabe** für den geprüften Umfang: Urban Employment, Desktop hell im eigenen Tab plus 4 Bilder. Household Energy Demand und Dark/Narrow im eigenen Tab habe ich nicht selbst reproduziert. `bun run check` und `build:ui` nach der Korrektur sind laut Dokument offen; ich habe sie nicht ausgeführt.

## Gesamturteil

**Keine uneingeschränkte Freigabe der Revision 2.**

- **Bedingt freigegeben** (kosmetische bzw. niedrige Auflagen): Population, Housing, Land Use, Economy (nach M-ECO1), Services, Water, Stormwater, Heat, Air and Noise, Habitat, Materials, also 11 Modelle.
- **Nachbesserung vor Freigabe:** Mobility (M-MOB1), Energy (M-ENE1/2), Finance (M-FIN1), Daily Activities (M-DAY1/2).
- Zusätzlich fehlen Belege zum selben Zeitpunkt (M-EVD1) sowie Aufnahmen der oben genannten Begleitdiagramme.
- Host-Enter-Fix: freigegeben im geprüften Umfang.

Nach den Korrekturen müssen die betroffenen Aufnahmen neu erstellt und von einem unabhängigen Prüfer erneut angesehen werden. Dieses Urteil betrifft nur die visuelle Wirksamkeit. Die wissenschaftlichen Mechanismen und Verträge prüft die separate Gemini-Review; Physik, Kalibrierung und vollständige Barrierefreiheit sind hier nicht geprüft.
