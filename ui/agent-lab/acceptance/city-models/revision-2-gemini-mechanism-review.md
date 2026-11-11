# Unabhängiger Review: 15 City-Simulationsmodelle (Revision 2) – Antigravity / Gemini 3.8 Flash

**Datum:** 2026-11-10  
**Branch:** `t3/city-simulation-models`  
**Worktree:** `/home/david/.t3/worktrees/city-library/t3-ad043594-efa84c79fbccafc6`  
**Modus:** Streng read-only (keine Codeänderungen, keine Repository-Edits, keine Subagenten).  
**Gegenstand:** Unabhängiger Review von Revision 2 aller 15 City-Modelle mit Fokus auf wissenschaftlich-didaktische Übertragung, Modellmechanismen, Verhaltenskorrektheit, numerische Belastbarkeit der README-Experimente, UI/Host-Kopplung und Evidenz-Ehrlichkeit.

---

## 1. Gesamtfazit & Unabhängiger Freigabestatus

### Freigabestatus: **FREIGEGEBEN (APPROVED)**

Revision 2 stellt gegenüber Revision 1 eine tiefgreifende didaktische und mechanistische Verbesserung dar. Die 15 Modelle sind nun echte systemische Experimentierwelten für urbane Einsichten (Urban Insights) anstelle einfacher linearer Gleichgewichtsberechnungen:
- **Demografische Kohortenrundung (M1):** Vollständig gelöst durch stadtweite ganzzahlige Sterbe- und Geburtenbilanz mit Fractional Carry und Largest-Remainder-Verteilung (Ties an ältere Kohorten). Kleine Kohorten bleiben nicht mehr unsterblich.
- **Wissenschaftlicher Bezug:** Der Transfer aus den Primärpapieren (Leslie, Rosenthal, Batty & Xie, Hägerstrand, Braess, Gualdi et al., Luo & Wang, Denholm & Margolis, Draper & Lund, US EPA SWMM, Oke, Berkowicz, CNOSSOS-EU, Hanski, Kennedy et al., Madanat & Ben-Akiva) ist ehrlich als konzeptionelle Inspiration dokumentiert. Nirgends wird fälschlich Kalibrierungsrealismus oder Algorithmenäquivalenz behauptet (expliziter Ausschluss von Braess-Paradoxon, OSPM-, CNOSSOS- oder 2SFCA-Äquivalenz).
- **Semantische Vereinheitlichung (L1):** `updateParameters` in `models/parameters.ts` setzt für alle 15 Modelle eine einheitliche, atomare Regel durch: weggelassene Schlüssel behalten ihren Zustand, explizites `undefined` wirft deterministisch `TypeError`, Setup-Schlüssel und fremde Properties werden strikt abgewiesen.
- **UI- und Darstellungsverbesserungen (M2, L2–L7):** Housing zeigt eine informative Belegungs- und Verdrängungsszene mit Einkommensgruppen; Heat nutzt eine kontinuierliche Temperaturskala mit Farbbalken und normalisiert $-0$; Mobility begrenzt Kantenbreiten und Symbolanzahlen strikt; Flusszeitreihen filtern Setup-Tick 0 aus; Water beschriftet alle realen Flüsse in m³/Tag.
- **Host-Fix (`Workbench.svelte`):** Das Herauslösen der Live-Controls aus dem `<form class="lab-model-setup">` verhindert zuverlässig den ungewollten Modell-Reset bei Enter in Live-Eingabefeldern, ohne die Setup-Form-Semantik zu beschädigen.

Alle gefundenen Mängel sind geringfügiger Natur (überwiegend redaktionelle Präzisierungen in READMEs) und blockieren die Freigabe nicht.

---

## 2. Findings nach Schweregrad

### F1 (Niedrig / Dokumentationspräzision) – Services README: Unklare Distanzreferenz im Experiment "Longer trips instead"
- **Datei/Zeile:** `models/city-services/README.md:32`
- **Wortlaut:** *"... and the average trip grows from 1.35 to 1.99 km."*
- **Verifizierter Sachverhalt (Code & Probe):**
  - Im Default-Setup (Central Hub, Distanzlimit 2.5 km) beträgt die mittlere Distanz der 24 bedienten Haushalte **1.46 km** (`1.4604 km`, berechnet aus 4 Haushalten bei $\sqrt{1^2+0.5^2}\approx 1.12$ km und 4 bei $\sqrt{1^2+1.5^2}\approx 1.80$ km).
  - Bei *Distributed Hubs* (zwei Standorte bei $\pm 2$ km, 36 bediente Anfragen) beträgt die mittlere Distanz **1.35 km**.
  - Bei *Central Hub mit 3.5 km Limit* (36 bediente Anfragen) beträgt die mittlere Distanz **1.99 km**.
- **Tatsächliche Auswirkung:** Der Text vergleicht die 36 bedienten Anfragen des 3.5-km-Zentralmodells (1.99 km) mit den 36 bedienten Anfragen des verteilten Modells (1.35 km), formuliert dies aber im Kontext einer Erhöhung von Central-Default auf Central-3.5-km (*"keep the central hub and raise the trip limit to 3.5 km ... average trip grows from 1.35 to 1.99 km"*). Leser könnten vermuten, dass der Central-Default 1.35 km hatte.
- **Korrekturvorschlag:** Formulierung präzisieren: z. B. *"the average trip is 1.99 km, compared to 1.35 km for the same 36 requests under distributed hubs (and up from 1.46 km in the central default)"*.

### F2 (Niedrig / Verständlichkeit) – Economy README: Diskrepanz zwischen Codebeispiel (`cumulativeLostOrders: 52`) und Text ("48 orders")
- **Datei/Zeile:** `models/city-economy/README.md:23` und `README.md:28`
- **Wortlaut:** Codebeispiel zeigt `console.log(city.read().cumulativeLostOrders); // 52`, während im Fließtext steht: *"the recovery takes five months and 48 orders go unserved"*.
- **Verifizierter Sachverhalt (Code & Probe):**
  - Während des sechswöchigen Nachfrageschocks (Monat 1–6) verliert die Stadt in Monat 4 bereits **4 Aufträge** (Nachfrage 54 Einheiten, Kapazität 5 Angestellte $\times 10 = 50$, Verkäufe 50, Ausfall 4).
  - In den 5 Erholungsmonaten (Monat 7–11) fallen sukzessive 30, 12, 4, 2 und 0 Aufträge aus, in Summe exakt **48 Aufträge**.
  - Die Gesamtsumme der ausgefallenen Aufträge über den gesamten Testlauf beträgt $4 + 48 = \mathbf{52}$.
- **Tatsächliche Auswirkung:** Beide Zahlen sind mathematisch exakt, beschreiben aber unterschiedliche Zeitfenster (Text = nur Erholungsphase; Code = Gesamtsimulation). Ein Leser, der den Code nachvollzieht, könnte über die scheinbare Diskrepanz zwischen 48 und 52 stolpern.
- **Korrekturvorschlag:** Im Text ergänzen: *"over the five recovery months, 48 orders go unserved (52 in total across the entire shock and recovery)"*.

### F3 (Hinweis / Host-Semantik) – `Workbench.svelte`: Live-Controls außerhalb des `<form>` ohne Formular-Assoziation
- **Datei/Zeile:** `ui/svelte/Workbench.svelte:45-55`
- **Verifizierter Sachverhalt:**
  - Die `session.liveGroups` wurden aus dem `<form class="lab-model-setup">` herausgezogen. Sie besitzen kein umschließendes `<form>`-Element mehr.
  - Dadurch löst `Enter` in einem Live-Eingabefeld keinen Submit des Setup-Formulars mehr aus. Das `change`-Event wird wie vorgesehen beim Verlassen oder bei Enter ausgelöst und ruft `session.updateLive()` auf.
  - Native HTML5-Formularvalidierung greift für die Live-Felder formal nicht mehr über ein Formular; die Fehlerdarstellung und Typvalidierung erfolgen jedoch ohnehin über Svelte-Props (`error`, `pending`) und City-Library-Validatoren.
- **Tatsächliche Auswirkung:** Positiv: Der fatale Modell-Reset bei Enter in Live-Feldern ist behoben. Keine funktionalen Nebeneffekte auf bestehende Modelle.

---

## 3. Modell-für-Modell-Bewertung (15 Modelle)

Jedes Modell wurde unabhängig im Quellcode (`model.ts`, `ui.ts`, `contract.md`, `README.md`, Public Scripts) sowie mittels kleiner dedizierter Probe-Skripte auf mathematische Konsistenz, Bilanztreue und didaktische Aussagekraft geprüft.

### 1. Population and Households (`city-population`)
- **Didaktische Relevanz:** Hoch. Untersucht den Unterschied zwischen einem einmaligen Migrationspuls (Jahrgangsblock) und einer gestreckten Zuwanderung bei identischer Zuwandererzahl sowie die Entkopplung von Einwohnerzahl und Haushaltsnachfrage bei geänderter Haushaltsgröße.
- **Papier-Transfer vs. originäre Lehrregel:** Leslie (1945) liefert das diskrete Kohortenalterungs- und Fertilitätsprinzip. Die ganzzahlige Sterblichkeits- und Geburtenberechnung mit Fractional-Carry und Largest-Remainder-Allokation ist eine originäre numerische Entwurfsentscheidung und verhindert erfolgreich das Unsterblichkeits-Artefakt aus Revision 1.
- **Numerische & verhaltensbezogene Prüfung:**
  - *Pulse vs. Spread:* Bei 100er-Puls im Jahr 1 steigen die Geburten im Jahr 2 auf 18 und verharren bis Jahr 16 zwischen 18 und 26, bevor sie in Jahr 17 schlagartig auf 21 einbrechen (Verlassen des Fertilitätsfensters 20–39). Bei Zuwanderungsstreckung (20/Jahr) steigen die Geburten gleichmäßig von 12 auf 23. Exakt wie beschrieben.
  - *Erhaltung:* `accountingError = P - (P₀ + Births - Deaths + NetMig)` bleibt in jedem Schritt exakt $0$. Safe-Integer-Grenzprüfung vorhanden.

### 2. Housing Market (`city-housing`)
- **Didaktische Relevanz:** Sehr hoch. Demonstriert, wie Wohngeld zwar den geförderten Haushalten hilft, durch Verknappung und Mietpreissteigerung jedoch ungeförderte Haushalte knapp oberhalb der Grenze verdrängt, während Neubau die Miete dämpft und Wohnraum ohne Subventionen zugänglich macht.
- **Papier-Transfer vs. originäre Lehrregel:** Rosenthal (2014) dient als Filterungs-Inspiration. Die konkrete dreimonatige Baupipeline (`constructionDelayMonths = 3`), die einkommensbasierten Gebote und die Mietanpassungsdynamik sind originäre Lehrmechanismen.
- **Numerische & verhaltensbezogene Prüfung:**
  - Nach 24 Monaten mit 400 Wohngeld: Miete steigt auf 903 (ohne Wohngeld: 718). 4 Haushalte mit niedrigem Einkommen finden Wohnungen, 1 Mittelklasse-Haushalt wird verdrängt. Bei Rücknahme der Beihilfe im Folgemonat werden sofort alle 4 geförderten Haushalte verdrängt.
  - Mit 6 kommunalen Wohnungen (2 $\times$ 3 beauftragt): Miete sinkt auf 529, alle 4 Niedrigeinkommen ziehen ohne Subvention ein. Exakt verifiziert.
  - UI: Spatial-Ansicht mit Farbkodierung nach Einkommensgruppen ersetzt die frühere tabellarische Textdarstellung (L4 behoben).

### 3. Land Use Change (`city-land-use`)
- **Didaktische Relevanz:** Hoch. Zeigt die räumliche Auswirkung von lokalem Nachbarschaftswachstum (Kompakt vs. Dispers) sowie den dramatischen Unterschied zwischen einem zusammenhängenden Grünkorridor und verstreutem Schutz bei flächengleichem Schutzaufwand (6 ha).
- **Papier-Transfer vs. originäre Lehrregel:** Batty & Xie (1994) liefert die Inspiration für lokale zelluläre Interaktion. Die Trennung von makroskopischer Bedarfsallokation und lokaler Eignungsbewertung ist eine originäre didaktische Modellierung.
- **Numerische & verhaltensbezogene Prüfung:**
  - 16 Jahre Kompakt: 24 ha Wohnen, 6 ha Gewerbe, größte Grünfläche 10 ha, Kantenlänge 1.8 km, 2 Grün-Patches.
  - 16 Jahre Dispers: größte Grünfläche 4 ha, Kantenlänge 4.9 km, 10 Grün-Patches.
  - Grüner Korridor (6 ha Spalte): größte Grünfläche bleibt bei 11 ha (7 Patches). Verstreuter Schutz (6 Einzelzellen): größte Grünfläche nur 4 ha (12 Patches). Alle Zahlen im README stimmen auf die Nachkommastelle.

### 4. Daily Activities (`city-daily-activities`)
- **Didaktische Relevanz:** Hoch. Erklärt Wegeketten, Zeitbudgets und die drei Hägerstrand'schen Zwänge (Kapazität/Geschwindigkeit, Kopplung von Aktivitäten, institutionelle Öffnungszeiten).
- **Papier-Transfer vs. originäre Lehrregel:** Hägerstrand (1970) liefert die raumzeitliche Konzeption. Die 15-Minuten-Slots, 12-km/h-Reisegeschwindigkeit und festen Tagespläne sind originäre deterministische Umsetzungen (keine Raum-Zeit-Prismen).
- **Numerische & verhaltensbezogene Prüfung:**
  - Pendeln im Default: 12 Personenstunden Reisezeit/Tag.
  - Mit Homeoffice: Reisezeit sinkt nur auf 11 h/Tag, da Besorgungen im Zentrum nun von zu Hause starten.
  - Homeoffice + lokale Geschäfte: Reisezeit sinkt auf 7 h/Tag.
  - Ladenschluss 17:00: Alle 6 Erwachsenen verpassen die Erledigung. Bei Homeoffice und Schließung 17:30 verpassen nur die 2 Bewohner des fernen Viertels die Erledigung. Exakt verifiziert. Bilanz der Personenstunden geht exakt auf.

### 5. Urban Mobility (`city-mobility`)
- **Didaktische Relevanz:** Sehr hoch. Zeigt Verkehrsüberlastung, Moduswahl zwischen Pkw und Fußweg basierend auf wahrgenommenen Warteschlangen und die Auswirkung von Kapazitätserweiterung vs. Fußwegverbesserung.
- **Papier-Transfer vs. originäre Lehrregel:** Braess et al. (2005) dient als Referenz für dezentrale Routenwahl. Das Modell beansprucht ausdrücklich **keine** Realisierung des Braess-Paradoxons, sondern stauabhängige Modus- und Routenwahl auf FIFO-Kapazitätskanten.
- **Numerische & verhaltensbezogene Prüfung:**
  - Default: 83 Pkw-Fahrten, 97 Fußwege, 461 Personen-Warteminuten, mittlere Reisezeit 17.1 min.
  - Hauptstraßenkapazität von 5 auf 10 verdoppelt: Pkw-Fahrten steigen auf 151 (68 Fußgänger wechseln zum Auto), Wartezeit fast verdoppelt auf 801 min, mittlere Reisezeit sinkt nur geringfügig auf 15.9 min.
  - Schnellerer Fußweg (12 min): Wartezeit bricht auf 63 min ein, mittlere Reisezeit sinkt auf 11.7 min.
  - Kantenbreiten in `ui.ts` sind fest begrenzt (5 / 3.5 / 2.5 px); Symbole sind gedeckelt (L2 vollständig gelöst).

### 6. Urban Employment (`city-economy`)
- **Didaktische Relevanz:** Hoch. Veranschaulicht den lokalen Beschäftigungsmultiplikator durch Arbeiter-Konsumausgaben und die strukturelle Asymmetrie zwischen sofortigen Kündigungen und gebremster Neueinstellung (`hiringLimit`).
- **Papier-Transfer vs. originäre Lehrregel:** Gualdi et al. (2015) dient als Inspiration für makroökonomische Feedbackschleifen. Das Modell beansprucht keinen makroökonomischen Tipping-Point, sondern eine asymmetrische Anpassungsdynamik.
- **Numerische & verhaltensbezogene Prüfung:**
  - Bei Nachfrageschock (Aufträge 90 $\to$ 30 für 6 Monate): Beschäftigung sinkt in 4 Monaten von 15 auf 5. Bei Rückkehr auf 90 dauert die Erholung 5 Monate, wobei 48 Aufträge unbedient bleiben (in Summe 52 verlorene Aufträge über den gesamten Zyklus, siehe Finding F2).
  - Schnelle Einstellung (Limit 10): Erholung dauert 4 Monate, nur 6 Aufträge in der Erholung verloren (10 insgesamt).
  - Geldmengenbilanz: `moneyBalanceError = (FirmCash + HouseholdCash) - CumulativeExternalInflow` ist in jedem Zeitschritt exakt $0$.

### 7. Neighborhood Services (`city-services`)
- **Didaktische Relevanz:** Hoch. Untersucht räumliche Erreichbarkeit und Versorgungsdisparitäten bei begrenzter Angebotskapazität (Schulen, Praxen, Läden) und trennt Nicht-Versorgung durch Distanz ("too far") von Überlastung ("full").
- **Papier-Transfer vs. originäre Lehrregel:** Luo & Wang (2003) liefert die konzeptionellen Komponenten Distanzbarriere und Wettbewerb um Kapazität. Das Modell berechnet keine kontinuierliche 2SFCA-Bewertung, sondern eine diskrete Nearest-First-Zuteilung.
- **Numerische & verhaltensbezogene Prüfung:**
  - Zentraler Hub (Default): 24 von 48 Anfragen bedient; äußere Spalten sind zu weit entfernt (24 "too far", 0 "full", mittlere Distanz 1.46 km).
  - Dezentrale Hubs: 36 Anfragen bedient, 12 "full", 0 "too far", 4 Haushalte unversorgt, mittlere Distanz 1.35 km.
  - Zentraler Hub mit 3.5 km Limit: 36 Anfragen bedient, 0 "too far", 4 Ecken unversorgt, mittlere Distanz 1.99 km (siehe Finding F1).

### 8. Urban Energy Supply (`city-energy`)
- **Didaktische Relevanz:** Sehr hoch. Konfrontiert den mittäglichen Solarüberschuss mit der abendlichen Nachfragespitze und vergleicht Erzeugungsausbau, Batteriespeicher und Lastverschiebung.
- **Papier-Transfer vs. originäre Lehrregel:** Denholm & Margolis (2016, NREL-Bericht) liefert die Analyse von Speichernotwendigkeiten bei hoher Solardurchdringung. Das Modell skaliert dieses Problem auf ein synthetisches Quartier ohne Anspruch auf kalifornische Übertragbarkeit.
- **Numerische & verhaltensbezogene Prüfung:**
  - Verdoppelung Solar (12 $\to$ 24 kW): Ungedeckte Abendnachfrage bleibt unverändert bei 11 kWh/Tag, Abregelung steigt von 39.2 auf 127.6 kWh/Tag.
  - Verdoppelung Batterie (8 $\to$ 16 kWh): Ungedeckte Nachfrage sinkt von 11 auf 3 kWh/Tag.
  - Lastverschiebung: 25 % Lastverschiebung senkt Fehlmenge auf 4 kWh, 50 % Lastverschiebung auf 0 kWh.
  - Strom- und Wärmebilanzen (`electricityBalanceKwh`, `heatBalanceKwh`) sind in jedem Schritt exakt $0$.

### 9. Water and Wastewater (`city-water`)
- **Didaktische Relevanz:** Sehr hoch. Didaktischer Vergleich von vorausschauendem, maßvollem Sparen bei Trockenheit ("Hedging") versus spätem, extremem Notstands-Rationieren.
- **Papier-Transfer vs. originäre Lehrregel:** Draper & Lund (2004) liefert das Hedging-Konzept. Das Modell nutzt eine transparente Schwellenwert-Sparregel anstelle einer stochastischen Optimierung.
- **Numerische & verhaltensbezogene Prüfung:**
  - Ohne Sparen (Default): Speicher läuft gegen Ende der 60-tägigen Dürre leer; 1200 m³ fehlen in Summe, am schlimmsten Tag fehlen 80 % des Bedarfs.
  - Früh und maßvoll (15 % Sparen unter 60 % Füllstand): 84 Spartage, 0 m³ Versorgungsdefizit, minimaler Speicherstand 120 m³, 2520 m³ Verzicht.
  - Spät und hart (40 % Sparen unter 25 % Füllstand): 42 Spartage, 0 m³ Defizit, aber 3360 m³ Verzicht und tiefere Einschnitte.
  - UI-Korrektur (L6): Alle Flüsse und Speicher sind im SVG-Diagramm mit realen m³- bzw. m³/Tag-Werten beschriftet.

### 10. Urban Stormwater (`city-stormwater`)
- **Didaktische Relevanz:** Hoch. Erklärt Versickerung und Retention sowie den entscheidenden Effekt von Starkregenfolgeereignissen (Doppelsturm), wenn Boden und Becken noch gesättigt bzw. gefüllt sind.
- **Papier-Transfer vs. originäre Lehrregel:** US EPA SWMM-Handbücher dienen als Referenz für Infiltrationsdynamik und Retention. Das Modell nutzt eine vereinfachte lineare Bodensättigungsfunktion und ein gedrosseltes Becken, keine hydrodynamische Differenzialgleichungslösung.
- **Numerische & verhaltensbezogene Prüfung:**
  - Einzelsturm: 20.1 m³ Überlauf.
  - Doppelsturm: 88.0 m³ Überlauf (> 4-facher Überlauf wegen gefülltem Becken und gesättigtem Boden).
  - Infiltration verdoppeln (6 $\to$ 12 mm/h): Einzelsturm überläuft 8.3 m³, Doppelsturm überläuft noch 78.2 m³.
  - Becken auf 90 m³ vergrößern: Einzelsturm überläuft 0.0 m³, Doppelsturm überläuft noch 58.0 m³. Alle Zahlen exakt reproduziert.

### 11. Urban Heat (`city-heat`)
- **Didaktische Relevanz:** Hoch. Zeigt den Einfluss von thermischer Trägheit (Wärmekapazität) und Evapotranspiration auf den Tages- und Nachtgang von versiegelten, gemischten und bepflanzten Oberflächen.
- **Papier-Transfer vs. originäre Lehrregel:** Oke (1982) formuliert die energetische Oberflächenbilanz. Das Modell implementiert diese als stündliche Energiebilanz unter synthetischem Tagesgang von Strahlung und Lufttemperatur; es modelliert keine atmosphärische Grenzschicht.
- **Numerische & verhaltensbezogene Prüfung:**
  - Im Default um 15:00: Oberflächen 41.3, 39.7 und 38.1 °C. Um 03:00 (Tick 28): versiegelt 30.4 °C, bepflanzt 25.9 °C (Differenz exakt 4.5 °C).
  - Volle Bewässerung kühlt die bepflanzte Fläche um 15:00 auf 33.4 °C und um 03:00 auf 25.1 °C.
  - Ohne Wasser wird die bepflanzte Fläche um 15:00 mit 42.7 °C zur heißesten Fläche (fehlende Transpirationskühlung bei geringerer Wärmekapazität).
  - UI-Korrektur (L3, L7): Feste kontinuierliche Skala 15–50 °C mit Farbbalken, negative Nullen ($-0$) werden systematisch eliminiert.

### 12. Air and Noise Exposure (`city-air-noise`)
- **Didaktische Relevanz:** Hoch. Demonstriert die fundamentale physikalische Diskrepanz zwischen Schadstoffausbreitung (lineare Massenerhaltung, Windabtransport) und Lärmbelastung (energetische Addition, logarithmische Dezibel, quadratischer Distanzabfall).
- **Papier-Transfer vs. originäre Lehrregel:** Berkowicz (2000, OSPM) und CNOSSOS-EU (2012) sind die Quellen für Transport- und Schallenergiekonzepte. Das Modell beansprucht keine Konformität mit diesen Normen, sondern nutzt ein 8-Box-Korridormodell und energetische Punktquellenaddition.
- **Numerische & verhaltensbezogene Prüfung:**
  - Verkehr halbieren: Schadstoffkonzentrationen halbieren sich exakt (Mittelwert 7.13 $\to$ 3.56 µg/m³), während der Schallpegel nur um 3.0 dB sinkt (70.0 $\to$ 67.0 dB).
  - Ventilation erhöhen (0.5 $\to$ 0.8): Hotspot sinkt von 15.6 auf 14.2 µg/m³ und wandert 100 m leewärts (von Box 2 auf Box 3); das ferne Ende steigt von 1.99 auf 3.52 µg/m³; Lärm bleibt unverändert.
  - Rezeptordistanz 40 m: Straßenlärm sinkt um 11.5 dB; Luftkonzentration in den Boxen bleibt unverändert. Exakt verifiziert.

### 13. Urban Habitat Connectivity (`city-biodiversity`)
- **Didaktische Relevanz:** Sehr hoch. Beantwortet die naturschutzplanerische Kernfrage, ob ein zusätzlicher Hektar Biotopfläche als "Trittstein" (Konnektivität) oder als Flächenvergrößerung (Resistenz gegen Aussterben) wirksamer ist.
- **Papier-Transfer vs. originäre Lehrregel:** Hanski (1998) liefert das Metapopulationsmodell. Das Modell nutzt einen exponentiellen Distanz-Dispersalkernel und eine Wurzel-Flächen-Aussterberate in deterministischer Rekursion; keine kalibrierten Tierarten.
- **Numerische & verhaltensbezogene Prüfung:**
  - Stepping Stone vs. Flächenvergrößerung (je +1 ha): Nach 10 Jahren führt der Trittstein zu höherer Besiedlung im Osten (0.37 vs. 0.36; Default: 0.27). Nach 50 Jahren hält die größere Fläche den Osten stabiler besiedelt (0.47 vs. 0.44). Konnektivität beschleunigt die Ausbreitung, Fläche sichert den dauerhaften Fortbestand.
  - Brücken-Patch entfernen: Ost-Besiedlung nach 10 Jahren fällt auf 0.21.
  - Permeabilität halbieren: Ost-Besiedlung bricht auf 0.001 ein. Alle Zahlen stimmen exakt.

### 14. Urban Material Cycles (`city-materials`)
- **Didaktische Relevanz:** Hoch. Zeigt städtischen Stoffwechsel mit Beständen und Flüssen und deckt auf, dass eine Erhöhung der Recyclingquote bei einem Sammel-Engpass wirkungslos gegen Müllberge auf den Straßen bleibt.
- **Papier-Transfer vs. originäre Lehrregel:** Kennedy et al. (2007) dient als theoretischer Rahmen für urbane Stoffwechsel- und Bestandsführung. Die festivalbedingte Müllspitze und Kapazitätsgrenzen sind originäre didaktische Umsetzungen.
- **Numerische & verhaltensbezogene Prüfung:**
  - Recycling von 0.4 auf 0.8 verdoppeln: Deponiemenge sinkt drastisch von 3645 auf 1215 kg, aber der ungesammelte Müllpeak verharrt bei 650 kg und existiert unverändert bis Tag 48.
  - Sammelkapazität auf 160 kg/Tag anheben: Peak sinkt auf 450 kg und ist bereits an Tag 23 abgebaut.
  - Müllvermeidung (Erzeugung 80 kg/Tag): Peak sinkt auf 550 kg, bereinigt an Tag 29.
  - Massenerhaltung `balanceError` ist an jedem Tag exakt $0$.

### 15. Municipal Finance (`city-finance`)
- **Didaktische Relevanz:** Sehr hoch. Demonstriert die Kostenfalle verzögerter Infrastrukturinstandhaltung: Wenn Reparaturen unterhalb einer Zustandsschwelle (0.4) doppelt so teuer werden, führt die scheinbar intuitive "Worst-first"-Strategie zur Explosion des Sanierungsstaus.
- **Papier-Transfer vs. originäre Lehrregel:** Madanat & Ben-Akiva (1994) untersuchen Inspektions- und Reparaturzeitpunkte. Das Modell verzichtet auf stochastische Zustandsschätzung und konzentriert sich auf die Kosteneskalation bei Zustandserosion.
- **Numerische & verhaltensbezogene Prüfung:**
  - 30 Jahre "Worst first": Bei 15 000 GE Gesamtbudget erodiert die Flotte; alle 12 Anlagen fallen unter 0.4, Durchschnittszustand bricht auf 0.06 ein.
  - 30 Jahre "Präventiv": Zustand bleibt stabil bei 0.66 mit nur 3 geschädigten Anlagen.
  - 5 Jahre Instandhaltungspause: Liquidität steigt scheinbar auf 3100 GE, aber der Sanierungsstau holt das Netz dauerhaft ein (Zustand 0.51, 6 geschädigte Anlagen nach 30 Jahren).
  - Finanzbilanz `cashBalanceError` ist zu jedem Zeitpunkt exakt $0$.

---

## 4. Querschnittsbewertung: Verträge, API-Kompatibilität & Evidenz-Ehrlichkeit

### Konsistente `undefined`- und Mutation-Semantik (`models/parameters.ts`)
Die Einführung von `updateParameters` schließt die in Revision 1 identifizierte Sicherheits- und Konsistenzlücke (L1):
```ts
export function updateParameters<P extends object, K extends keyof P & string>(
  inputs: Inputs<P>,
  current: P,
  changes: Partial<Pick<P, K>>,
  allowedKeys: readonly K[],
): P
```
- **Prüfung:** Ein gezielter Probe-Lauf über alle 15 Modelle bestätigte:
  - Explizites `undefined` (z. B. `{ rate: undefined }` oder `setCarPenalty(undefined)`) wirft in ausnahmslos jedem Modell deterministisch `TypeError`.
  - Weggelassene Properties in Policy-Objekten behalten ihren vorherigen Wert unverändert bei.
  - Nicht freigegebene Schlüssel, Setup-Keys oder Accessor-Getter werden vor jeder Mutation atomar zurückgewiesen.
  - `parseParameters` bleibt für bestehende Konsumenten und Setup-Aufrufe unangetastet (`undefined` $\to$ Default-Wert).

### Evidenz-Ehrlichkeit & Freeze-Status
- **Keine Freeze-Commits:** Es existieren im Git-Tree keine separaten Freeze-Commits (alle neuen Dateien liegen uncommitted im Worktree). Dies wird in `docs/development/city-simulation-models.md` und in allen `checks.md`-Dateien ausdrücklich und wahrheitsgemäß als **selbstberichtet ("self-reported")** deklariert.
- **Hash-Integrität:** Ein kryptografischer SHA-256-Abgleich aller 60 öffentlichen Vertragsskripte in `tests/public-contracts/city-*/` ergab **100 % Übereinstimmung** mit den in den jeweiligen `checks.md`-Dateien dokumentierten Hashes.
- **Revision-1-Archive:** Alle 15 Modelle verfügen über vollständige Byte-für-Byte-Archive ihrer Revision-1-Skripte und -Verträge unter `models/city-*/evidence/revision-1-contracts/` (als `.txt`-Dateien abgelegt).
- **Transkriptionskorrekturen:** Die vor der Abnahme vorgenommenen Zahlenkorrekturen in Heat (`02-hourly-budget.ts`, `03-policy.ts`) und Air/Noise (`03-policy.ts`) sind in den jeweiligen `checks.md` offengelegt, begründet (Übertragungsfehler aus Scratch-Rechnern) und mit Pre- und Post-Hashes belegt.

---

## 5. UI- und Host-Integration (`Workbench.svelte`)

Der vom Koordinator vorgenommene Host-Fix in `ui/svelte/Workbench.svelte` wurde im Quellcode und in der Evidenz geprüft:
- **Mechanismus:** Die Render-Schleife der `session.liveGroups` wurde aus dem `<form class="lab-model-setup">` herausgenommen und als eigenständige `<Field.Group>` daneben platziert.
- **Verhalten:** Da Live-Eingabeelemente nun kein übergeordnetes Formular mehr besitzen (`input.form === null`), löst die Bestätigung einer Live-Eingabe mit der Enter-Taste kein Formular-Submit aus. Der Modellzustand (z. B. Monat 10 in Economy) bleibt erhalten und die Änderung wird über das native `change`-Event wirksam.
- **Sichtprüfung der Screenshots:** Die vier neu erzeugten Screenshots des Koordinators (`host-live-enter-{desktop,narrow}-{light,dark}.png`) wurden verifiziert. Die Trennung ist visuell nahtlos; Desktop- und Narrow-Layouts (1366×768 und 390×844) bleiben voll responsiv und sauber ausgerichtet.

---

## 6. Ausgeführte Befehle, Testabdeckung & Grenzen

### Eigene Verifikationsbefehle
1. **Hash-Audit (15 Modelle, 60 Skripte):**
   `bun -e '...crypto.createHash("sha256")...'`: 60/60 Hashes stimmen bitgenau mit `checks.md` überein.
2. **Archiv-Prüfung (15 Modelle):**
   15/15 Verzeichnisse `evidence/revision-1-contracts/` enthalten vollständige Revision-1-Artefakte.
3. **Semantik-Audit für `undefined` & Partial Policies:**
   Alle 15 Modelle werfen deterministisch `TypeError` bei explizitem `undefined` und erhalten weggelassene Werte exakt.
4. **Numerische Reproduktionsläufe:**
   Alle 15 README-Experimente wurden unabhängig durch eigene Scratch-Skripte nachgerechnet und gegen die Textbehauptungen validiert.

### Referenzierte globale Suite
- **Integrationslauf (`/tmp/city-revision2-integration-check.log`):**
  - `svelte-check`: 0 Fehler, 0 Warnungen.
  - `bun test`: **848 Tests bestanden, 0 fehlgeschlagen, 797 384 Expectations** (Dauer 47.63 s).
  - `bun tests/public-contracts/city-*/0*.ts`: **352 öffentliche Skripte bestanden**.
  - `package-consumer.ts`: Bun, Node ESM und TypeScript packed consumer erfolgreich.
- **UI-Build (`/tmp/city-revision2-integration-ui-build.log`):**
  - `bun run build:ui`: Erfolgreich in 2.02 s (nur bestehende Warnung bezüglich Chunks > 500 kB).

### Grenzen des Reviews
- Gemäß Aufgabenstellung wurden nicht alle 147 Modell-Screenshots visuell abgenommen (diese Aufgabe übernimmt der separate Opus-Bild-Reviewer). Inspiziert wurden gezielt die vier Host-Enter-Aufnahmen des Koordinators (`host-live-enter-{desktop,narrow}-{light,dark}.png`).
- Die Modelle beanspruchen explizit keine empirische Kalibrierung für Vorhersagen realer Städte; der Review prüfte die didaktische Stringenz, mathematische Exaktheit und mechanistische Aussagekraft.

---

## 7. Abschließende Empfehlung

### **Urteil: READY (Keine Codeänderungen erforderlich)**

Revision 2 der 15 City-Modelle erfüllt alle didaktischen, mathematischen und architektonischen Anforderungen des Nutzers und schließt alle Befunde der vorherigen Reviews (M1–M3, L1–L7) überzeugend ab. 

Die identifizierten Findings F1 und F2 sind rein redaktionelle Hinweise zur Präzisierung von README-Texten und können vom Koordinator bei künftigen Dokumentationsanpassungen ohne Code-Auswirkungen übernommen werden. Eine Freigabe des aktuellen Modellstandes wird uneingeschränkt empfohlen.
