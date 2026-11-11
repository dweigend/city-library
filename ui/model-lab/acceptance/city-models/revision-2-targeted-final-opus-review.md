# Revision 2: unabhängige, gezielte Schlussprüfung (Opus, nur lesend)

Datum: 2026-11-10. Worktree `t3-ad043594-efa84c79fbccafc6`, Branch `t3/city-simulation-models`. Ich habe nichts am Repository geändert, keine Commits erstellt und keine Agenten gestartet. Dieser Bericht ist eine unabhängige Prüfung und kein Autorenbeleg.

## Grundlage

- Gelesen habe ich `AGENTS.md`, `docs/DESIGN.md` und die Skills `frontend-design`, `frontend-design-shadcn-svelte`, `shadcn-svelte` und `web-design-guidelines` aus `/home/david/.codex/skills/`.
- Die Vercel-Richtlinien habe ich frisch von `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` geladen (191 Zeilen). Geprüft habe ich nur die betroffenen Punkte: Fokus, Lesbarkeit, Kontrast der Themes, Einheiten und Inhalte, die in schmalen Layouts eingeschlossen bleiben. Das ist kein vollständiger Accessibility-Audit.
- Gelesen habe ich außerdem:
  - `revision-2-final-rest-fixes.md` und das Manifest `revision-2-final-rest-fixes-manifest.json` (60 Einträge),
  - die vorherige Prüfung `revision-2-final-opus-visual-review.md` mit 276 Bildern,
  - die Freigabe von L-WAT1 durch Gemini (`revision-2-water-independent-recheck.md`).
- Folgende Code-Änderungen habe ich geprüft:
  - der Diff von `ui/views/canvas.ts` und `docs/ui/api-reference.md`,
  - `models/city-water/ui.ts` (Label-Koordinaten),
  - `models/city-mobility/ui.ts` (`linkSummary`),
  - die Formatierung mit drei Dezimalstellen in `models/city-finance/ui.ts`.
  - Den Diff von `ui/svelte/Workbench.svelte` (Live-Gruppen außerhalb der Setup-Form) und `models/parameters.ts` (`updateParameters`) habe ich gesehen, aber nicht tief geprüft. Beide liegen außerhalb dieses Auftrags.
- Die Recherchegrundlage `docs/development/city-model-research.md` ist nicht Teil dieser Änderung. Ich habe sie nicht erneut fachlich bewertet.

## Shell-Logs (nur gelesen, nicht erneut ausgeführt)

- `/tmp/city-final-small-fixes-typecheck.log`: svelte-check meldet 0 Fehler und 0 Warnungen.
- `/tmp/city-final-rest-fixes-build-ui.log`: der Build ist erfolgreich, mit der bekannten Warnung zur Chunk-Größe.
- `/tmp/city-final-rest-fixes-check.log`: der Lauf ist abgeschlossen. Ein laufender Prozess `bun run check` oder `tijuana` war nicht vorhanden. Die Kette `typecheck && test && check:migration && contracts && build && consumer` lief bis zum letzten Schritt. Das Log zeigt:
  - 848 bestandene und 0 fehlgeschlagene Tests in 107 Dateien,
  - die Tijuana-Tests als bestanden,
  - „Public contracts passed (352 scripts)“,
  - als letzte Zeile „packed consumer: Bun, Node ESM and ambient-free TypeScript passed“.

## Code: Auswahlrahmen (X-SEL)

`canvas.ts` zeichnet jetzt nach Füllung und semantischem Stroke ein zusätzliches Rechteck mit Abstand: einen Halo in der Hintergrundfarbe mit 4 px und darauf eine gestrichelte Linie in der Vordergrundfarbe mit 1,5 px. Die Farbe aus `theme.selected` wird nicht mehr verwendet. Der semantische Stroke bleibt unverändert. Es gibt keine neue öffentliche API, und Identität, Picking und Domänenregeln sind unverändert. Die Dokumentation in `api-reference.md` beschreibt das korrekt. Für Kreise und Dreiecke ist der Rahmen ebenfalls ein Rechteck. Als neutrales Auswahlsignal ist das akzeptabel.

Neue Nebenwirkung: Der Rahmen hat 4 px Abstand und mehr. Die Annotationen (`data.labels`) werden ohne Halo gezeichnet. Deshalb schneiden die gestrichelten Linien in dichten schmalen Szenen benachbarte Texte (siehe N-SEL1).

## Bildprüfung: alle 60 neuen PNGs als Pixel

Ich habe alle 60 Dateien aus `screenshots/city-models/revision-2-final-rest-fixes/` geöffnet:

- 2732×1536 bzw. 780×1688 Pixel (DPR 2),
- die schmalen Bilder paarweise in nativer Auflösung,
- die Desktop-Bilder einzeln oder als Paar mit 50 % (entspricht CSS 1×),
- kritische Stellen zusätzlich als Ausschnitte mit 2,2- bis 3-facher Vergrößerung.

| Zustand (je 4 Bilder) | Befund |
| --- | --- |
| finance-selected | Gestrichelter neutraler Rahmen um asset-1. Der rote Umriss „unter 0,4“ bleibt bei allen 12 Assets erhalten. Amber erscheint nur als Reparaturbalken „+500“. Kein Eindruck von Reparatur. Mittelwert 0,162 = 1,95/12 ✓. **Schmal:** Die untere Rahmenkante berührt bzw. schneidet die Oberkante von „0.300“ (N-SEL1, gering). |
| housing-selected | „0 building“, kein amberfarbener Umriss, der Rahmen ist klar als Auswahl lesbar. Kein Eindruck von Bau oder Leerstand. **Schmal:** Die obere Rahmenkante schneidet den Titel „16 occupied“ (N-SEL1). **Belegqualität:** Desktop hell und schmal zeigen einen Zwischenzustand mit gedimmten bzw. deaktivierten Bedienelementen (E-CAP1). |
| economy-selected | Firm 1 behält ihren orangen Arbeitgeber-Umriss, kein Eindruck von Leerstand. **Schmal (hell und dunkel):** Die obere gestrichelte Kante läuft mitten durch „Firm 1 · 5/5“ (N-SEL1, die deutlichste Stelle). Alle 4 Bilder zeigen gedimmte Bedienelemente (E-CAP1). |
| mobility-default / -overflow | Drei Zusammenfassungen stehen in eigenen Zeilen unter allen Routen und überschneiden nichts, auch nicht bei 390 px und in beiden Themes. Überlauf: 12 Quadrate (4×3) und „+3“ an der Hauptstraße, 3 an der Umgehung, 15+3 = 18 = Monitor ✓. Default: 4+1 = 5 ✓. N-MOB2 ist behoben. |
| energy-charging / -discharge | Laden: „4.0“ steht über „Battery“ neben der Vertikalen, keine Kollision (Ausschnitt geprüft). 11,5 = 6 + 4 + 1,5 ✓. Entladen: 12 = 2 + 4 + 5 + 1 ✓, „Battery“ und „4.0“ sind getrennt. Beide sind schmal in beiden Themes erfasst. N-ENE3 ist behoben. Die Beschriftungen „6.0“, „4.0“ und „Battery“ stehen dicht beieinander, bleiben aber eindeutig. Charging-Desktop beide und schmal dunkel: Zwischenzustand (E-CAP1, die Tabelle ist im schmalen dunklen Bild verblasst). |
| materials-default / -capacity160 | „120“ bzw. „160“ stehen im Kasten, „capacity …“ in einer eigenen Zeile darunter, und kein Text überquert einen Kasten. 12+43+65 = 120 und 16+58+86 = 160 ✓. Rückstand 650 bzw. 450 ✓. **Schmal:** Die rote Entsorgungslinie berührt die letzte Ziffer von „capacity 160“ (gering, lesbar). L-MAT1 ist behoben. |
| water-default / -saving | „Sewage 136/32“ steht jetzt über der Anlage und ist frei. **Aber:** „Untreated 16“ steht bei x = 3,5 / y = −1,6 auf der grünen Leitung **für behandeltes Wasser** (x = 3,3, y von −0,9 bis −1,9). Diese Leitung schneidet das Wort sichtbar (Ausschnitt geprüft). Die orange Leitung für unbehandeltes Wasser endet bei (4,5 / −1,2) ohne Beschriftung. Das betrifft alle 8 Bilder, Desktop und schmal (**N-WAT3**). Schmal stoßen außerdem „City 170/200“ und „Sewage 136“ ohne Abstand aneinander (gering). |
| daily-cannot-fit-0230 / -2000 | Monitor, Legende, Szene, Balken und Inspector sagen durchgängig „cannot fit today“, sowohl um 02:30 als auch um 20:00. Der Titel erklärt jetzt die Überlagerung. N-DAY3 und N-DAY4 sind erledigt. Die Balkenverschiebung an den Rand und der von der Schul-Linie geschnittene Text „Middle“ bestanden schon vorher (gering). |
| city-population-units | „Initial residents (people)“, „Count“, „Residents / year“ und „Age band (years)“ sind korrekt, 20 × 50 = 1000 ✓. „Annual migration bound“ und „Maximum household size“ haben noch keine Einheit (gering). Die schmalen Bilder zeigen die Setup-Labels nicht, weil der Bereich „Parameters“ zugeklappt ist. N-POP2 besteht unverändert. |
| city-biodiversity-units | „(share)“, „(per year)“, „Occupied area (ha, expected)“ und „Occupied share (0–1)“ sind vorhanden, 3/7 = 0,429 ✓. „Habitat quality“ hat keine Einheit (gering). Schmale Annotationen werden von Linien gekreuzt; das ist ein bekanntes, geringes Problem. |

## Eigene Browserprüfung (eigener T3-Tab, danach geschlossen)

Dev-Server auf Port 3101 aus diesem Worktree (über das cwd des Prozesses geprüft). Ich habe echte Klicks auf Setup, „10 steps“ und „1 step“ verwendet, im Mobility-Feld getippt, danach Tab gedrückt, und die Taste Home benutzt. Für das Setzen des Fokus und das Scrollen habe ich JavaScript verwendet.

1. **Finance, 1366×768, hell, Jahr 20:** Die Rotpixel im eigenen Canvas-Puffer (1575×922) betragen **41.280 vor und 41.280 nach Home**. Die Zahl unterscheidet sich vom Autorenwert 47.216 nur wegen der anderen Puffergröße. Die Invarianz ist bestätigt. Inspector: asset-1, 0.300, „Late repair: Yes, double cost“. Der Rahmen ist sichtbar, und die amberfarbenen Pixel stammen nur vom Reparaturbalken. Die Bedienelemente sind im Ruhezustand normal.
2. **Economy, 390×844, dunkel, Monat 20, Home:** firm:1 ist ausgewählt. **Live bestätigt:** Die gestrichelte Kante schneidet „Firm 1 · 5/5“ (N-SEL1). Die Bedienelemente sind normal, die gedimmten Captures waren also Zwischenzustände (E-CAP1).
3. **Energy, 390×844, hell, Tag 2 09:00–10:00:** „4.0“ und „Battery“ sind getrennt. Die Tabelle stimmt: In − Out = 0,0.
4. **Mobility, 390×844, hell:** Walking 30 getippt, Tab, Minute 12. Queued 18, 12 Quadrate + „+3“ und 3 Quadrate, alle drei Zusammenfassungen unter den Routen. Das entspricht dem Capture.
5. **Altmodell Anisogamy (nicht City), 1366×768, hell:** Home und ein Klick auf ein Agent zeichnen den neutralen Rahmen korrekt (ca. 645 dunkle Strichpixel auf der hellen Zellfläche). **Ungeklärt:** Ein Klick auf eine leere Stelle in der Canvas-Mitte meldet zweimal reproduzierbar „Selected cl_3x594huhwt6sbpy“, aber ich fand keine Rahmenpixel. Ob dieser Agent außerhalb der sichtbaren Fläche liegt oder nicht gezeichnet wird, habe ich nicht geklärt. Mit der alten amberfarbenen Kontur wäre er vermutlich ebenso unsichtbar gewesen. Ich bewerte das nicht als Regression dieser Änderung, sondern als offenen, geringen Punkt.

## Befunde

**Mittel**

- **N-WAT3 Water:** Das Label „Untreated“ sitzt auf der Leitung für behandeltes Wasser. Die R1-Korrektur hat „Untreated“ nicht an das Ende des unbehandelten Abflusses gesetzt, wie im Autorenbericht beschrieben, sondern auf die vertikale grüne Treated-Leitung (`models/city-water/ui.ts`, Label `{ x: 3.5, y: -1.6 }` gegenüber dem Segment `plant.x = 3.3` bis y = −1,9). Das betrifft alle 8 Water-Bilder und den Live-Code. Die Werte bleiben lesbar und sind durch den Text eindeutig. Die Zuordnung zur wichtigsten Nebenwirkung, dem unbehandelten Abwasser, ist aber visuell falsch, und die orange Linie bleibt ohne Beschriftung. Der Fix ist begrenzt: das Label hinter das Ende der orangen Linie setzen, etwa x ≈ 4,7 und y ≈ −1,5, sodass es die Treated-Linie nicht schneidet. Danach die Water-Bilder in schmal und Desktop neu erfassen.

**Gering**

- **N-SEL1:** Der neue Auswahlrahmen schneidet Annotationen in schmalen Szenen. Bei Economy läuft er mitten durch „Firm 1 · 5/5“ (live bestätigt), bei Housing durch den Titel und bei Finance berührt er „0.300“. Ursache: 4 px Abstand und mehr, und `data.labels` werden ohne Halo gezeichnet. Das tritt nur im Auswahlzustand auf, und der Text bleibt lesbar. Es ist kein Rückfall in eine falsche Semantik. Empfehlung: zentral in `canvas.ts` einen Halo in der Hintergrundfarbe für Annotationen ergänzen, wie bei Agent-Labels, oder den Abstand bei kleinen Symbolen verringern. Das ist kein Blocker.
- **E-CAP1 Belegqualität:** Rund 10 der 60 Captures zeigen einen Zwischenzustand mit gedimmten oder deaktivierten Bedienelementen und verblasster Tabelle: Housing Desktop hell und schmal, alle 4 Economy-Bilder, Energy-Charging Desktop beide und schmal dunkel, Daily 20:00 schmal hell, Mobility-Default Desktop hell. Der Canvas-Inhalt ist in diesen Bildern gültig. Für die Bedienelemente taugen sie nicht als Beleg, und die Angabe im Manifest „frames settled“ trifft auf sie nicht zu. Live sind die Zustände normal (Finance, Economy, Energy, Mobility geprüft). Ein Produktfehler liegt nicht vor.
- Materials schmal: Die rote Linie berührt „capacity 160“. Water schmal: „City …“ und „Sewage …“ stoßen aneinander.
- Fehlende Einheiten: „Annual migration bound“, „Maximum household size“ und „Habitat quality“. L-LBL1 ist damit weitgehend, aber nicht vollständig erledigt.
- Mobility: Die Zusammenfassung „Main: 10 min“ (Fahrzeit der Strecke) steht neben dem Monitor „Main road now 27.0“. Das ist schon länger potenziell missverständlich und nicht neu.
- Anisogamy: Klick ins Leere wählt einen Agenten ohne sichtbaren Rahmen (siehe oben, ungeklärt).

Weiter bestehende, akzeptierte geringe Grenzen: Nullserien auf der Achse und versetzte gruppierte Balken im Renderer, N-POP2-Abstand, Dezimaltrennzeichen je nach Locale, rohe Inspector-Schlüssel (`employees`, `vacancies`, `balance`), kleine Habitat- und Stormwater-Annotationen. Keine davon begründe ich als neuen Blocker.

## Urteil je betroffenem Modell

| Modell | Urteil |
| --- | --- |
| Finance | **Freigegeben.** X-SEL ist behoben (rote Pixel invariant, live gemessen). N-FIN3 ist mit drei Dezimalstellen erledigt. Rest: N-SEL1 schmal (gering). |
| Housing | **Freigegeben.** Kein falsches Signal „under construction“ mehr. Rest: N-SEL1 schneidet den Titel schmal (gering), E-CAP1. |
| Economy | **Freigegeben mit geringer Auflage.** Kein falsches Signal „vacancy“ mehr. N-SEL1 ist hier am deutlichsten (Label durchgestrichen); ein zentraler Halo-Fix wird empfohlen, ist aber kein Blocker. |
| Mobility | **Freigegeben.** N-MOB2 ist behoben (Pixel und live). |
| Energy | **Freigegeben.** N-ENE3 und M-ENE2 sind behoben; Laden und Entladen sind schmal in beiden Themes erfasst und live bestätigt. |
| Materials | **Freigegeben.** L-MAT1 ist behoben, N-MAT2 hat eine Titelnotiz. Rest: Linie berührt Text schmal (gering). |
| Water | **Bedingt freigegeben.** Der Mechanismus L-WAT1 ist durch Gemini freigegeben. Visuell muss N-WAT3 (mittel) vor einer uneingeschränkten Abnahme korrigiert werden: eine Label-Koordinate und eine erneute Erfassung. |
| Daily Activities | **Freigegeben.** N-DAY3 ist als Planungslabel umgesetzt, ohne neue Domänenregel. N-DAY4 hat eine Titelnotiz. |
| Population | **Freigegeben** (gering: zwei Einheiten fehlen, N-POP2). |
| Habitat | **Freigegeben** (gering: „Habitat quality“ ohne Einheit). |

## Deckung aller 15 Modelle

Die Basisfreigaben der vorigen Prüfung mit 276 Bildern bleiben gültig für Land Use, Services, Stormwater, Heat und Air and Noise. Population, Habitat und Daily waren dort freigegeben oder mit geringen Auflagen freigegeben. Zusammen mit dieser gezielten Prüfung sind **14 von 15 Modellen visuell freigegeben**, mit den genannten geringen Grenzen. **Water bleibt bis N-WAT3 bedingt.** Das ist ein enger Fix in `ui.ts` ohne Änderung an der Headless-Logik. Danach genügt eine kurze Nachprüfung der 4 bis 8 Water-Bilder. Für eine saubere Belegakte wäre außerdem eine erneute Erfassung der von E-CAP1 betroffenen Bilder im Ruhezustand sinnvoll. Für die Abnahme halte ich sie nicht für zwingend, weil meine Live-Prüfung den Ruhezustand belegt.

## Grenzen dieser Prüfung

- Nur visuelle Wirksamkeit und Lesbarkeit. Keine wissenschaftliche Kalibrierungsprüfung, kein vollständiger WCAG- oder Vercel-Audit, Kontraste nur visuell beurteilt.
- Der Viewport wurde nur per CSS verkleinert, nicht mit einem mobilen User-Agent. Fokus und Scrollen habe ich teils per JavaScript gesetzt; Schritte, Eingaben und Home waren echte Aktionen.
- Die vollständige Suite habe ich nicht erneut ausgeführt; das Ergebnis stammt aus dem Log.
- Housing-Selektion habe ich nicht live nachgestellt, sondern nur aus den Pixeln beurteilt. Gleiches gilt für Materials, Water und Daily.
- Nicht geprüft habe ich die Änderungen an Workbench und `updateParameters` über den Diff-Blick hinaus.
