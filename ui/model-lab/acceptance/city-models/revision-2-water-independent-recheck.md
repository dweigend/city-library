# Unabhängiger Recheck: City-Water Substantial Contract & Visual-Fix Follow-up (Revision 2)

**Datum:** 2026-11-10  
**Reviewer:** Unabhängiger Sub-Agent (Antigravity / `gemini-3.8-flash`)  
**Gegenstand:** Nachträgliche Vertrags- und Modelländerung in `models/city-water/model.ts` (`isSaving` erfordert `conservationShare > 0`), Validierung der Randbedingungen, historische Evidenz-Integrität sowie Überprüfung der Koordinator-Präzisierungen (F1 Services, F2 Economy, Heat Shade-Night).  
**Worktree:** `/home/david/.t3/worktrees/city-library/t3-ad043594-efa84c79fbccafc6` (`t3/city-simulation-models`)  
**Modus:** READ-ONLY Review (Keine Änderungen am Repository, keine Commits, keine Subagenten).

---

## 1. Gesamtfazit & Freigabestatus

### Urteil: **FREIGEGEBEN (APPROVED)**

Die gezielte substantielle Vertragsänderung in `city-water` (L-WAT1) sowie die begleitenden redaktionellen Präzisierungen aus dem vorangegangenen Revisionsreview (F1, F2, Heat-README) sind **vollumfänglich freigegeben**.

- **Keine physikalische Verhaltensänderung:** Die Anpassung in `models/city-water/model.ts` (`isSaving()` verlangt `conservationShare > 0`) ist eine reine Status- und Indikatorkorrektur. Sie berührt weder Wasserflüsse, Bedarfe, Speicherstände noch Defizite.
- **Didaktische und semantische Stimmigkeit:** Tage ohne Sparquote (`conservationShare = 0`) werden im Default nicht mehr fälschlicherweise als "Saving days" ausgewiesen. Dies steht im Einklang mit dem didaktischen Zweck des Modells (Hedging nach Draper & Lund 2004 als aktives Vorziehen von moderatem Verzicht zur Vermeidung von extremem Notstand).
- **Robuste Randbedingungen:** Exakte Trigger-Gleichheit (strikte Ungleichung `<`), leere/volle Speicherstände und atomare Fehlschläge bei invaliden Parametern wurden per unabhängiger Gegenprobe fehlerfrei nachgewiesen.
- **Evidenz-Ehrlichkeit:** Die Hash-Chronologie in `models/city-water/evidence/checks.md` ist transparent und korrekt dokumentiert; keine bestehenden Assertionen wurden geschwächt.
- **Koordinator-Präzisierungen F1, F2 und Heat-Nachtkorrektur:** Alle drei Textanpassungen wurden gegengeprüft und spiegeln die mathematischen und physikalischen Mechanismen der jeweiligen Modelle präzise wider.

---

## 2. Detaillierte Prüfpfade & Evidenz (City-Water)

### 2.1 Baseline-Verhalten (`conservationShare = 0`)
Im bisherigen Code führte die reine Schwellenwertabfrage (`storedM3 / reservoirCapacityM3 < conservationTrigger`) dazu, dass bei Default-Einstellungen (`conservationTrigger = 1.0`, `conservationShare = 0.0`) an allen Tagen unter Vollfüllung `isSaving()` als `true` ausgewertet wurde. Dadurch wurden nach 120 Tagen 120 Spartage (bzw. 80 Spartage am Tag 80) und `isSavingTomorrow = true` gemeldet, obwohl kein einziger Tropfen Wasser eingespart wurde (`totalConservedM3 = 0`).

**Unabhängige Gegenprobe (`/tmp/water_recheck_probe.ts`):**
- Setup: Speicher 8000 m³, Kapazität 10000 m³, Trigger 1.0, Sparanteil 0.0.
- Tag 0: `conservationDayCount = 0`, `isSavingTomorrow = false`.
- Tag 80 (nach 60-tägiger Dürre): Speicher 0 m³, `conservationDayCount = 0`, `isSavingTomorrow = false`, `totalConservedM3 = 0`.
- Tag 120: Speicher 800 m³, `conservationDayCount = 0`, `isSavingTomorrow = false`, `totalConservedM3 = 0`, `totalShortageM3 = 1200 m³`, `worstDayCutShare = 0.8` (80 % Ausfall an 8 Tagen).
- Massenbilanzfehler: `|balanceErrorM3| < 1e-12` (erfüllt `< 1e-6`).

### 2.2 Äquivalenz bei aktiver Einsparung (`conservationShare > 0`)
Sobald `conservationShare > 0` gesetzt ist, ist die zusätzliche Bedingung `parameters.conservationShare > 0` stets wahr. Die Logik reduziert sich exakt auf die vor dem Visual-Fix genehmigte Revision-2-Mechanik.

**Unabhängige Verifikation der Experimente:**
1. **Experiment A (Frühes, moderates Sparen – Trigger 0.6, Quote 0.15):**
   - Gesamtdefizit (`totalShortageM3`): `0 m³` (identisch)
   - Spartage (`conservationDayCount`): `84` (identisch)
   - Eingespartes Wasser (`totalConservedM3`): `2520 m³` (identisch)
   - Tiefster Speicherstand (`lowest`): `120 m³` (identisch)
   - Endspeicher Tag 120 (`storedM3`): `2120 m³` (identisch)
   - Schlimmster Einschnitt (`worstDayCutShare`): `0.15` (identisch)
2. **Experiment B (Spätes, hartes Rationieren – Trigger 0.25, Quote 0.40):**
   - Gesamtdefizit (`totalShortageM3`): `0 m³` (identisch)
   - Spartage (`conservationDayCount`): `42` (identisch)
   - Eingespartes Wasser (`totalConservedM3`): `3360 m³` (identisch)
   - Tiefster Speicherstand (`lowest`): `640 m³` (identisch)
   - Endspeicher Tag 120 (`storedM3`): `2960 m³` (identisch)
   - Schlimmster Einschnitt (`worstDayCutShare`): `0.40` (identisch)

Keine Wasserflüsse, Zuteilungen oder Speicherstände weichen im Vergleich zur vorherigen Fassung ab.

### 2.3 Randwert- und Grenzwertprüfungen (Boundaries)
- **Gleichheitstrigger (`storageFraction == conservationTrigger`):**
  - Implementiert als strikte Ungleichung: `state.storedM3 / parameters.reservoirCapacityM3 < parameters.conservationTrigger`.
  - Gegenprobe: Speicher 5000 m³, Kapazität 10000 m³ (Quote 0.5), Trigger 0.5, Quote 0.2 $\rightarrow$ `isSavingTomorrow = false`.
  - Bei 4999 m³ (Quote 0.4999 < 0.5) $\rightarrow$ `isSavingTomorrow = true`.
- **Voller Speicher (`storedM3 == reservoirCapacityM3`):**
  - Bei Füllstand 10000 / 10000 (1.0) und Trigger 1.0 ist $1.0 < 1.0$ falsch $\rightarrow$ `isSavingTomorrow = false`, Tag 1 startet ohne Drosselung. Nach Abfluss (9800 m³) greift die Drosselung ab Tag 2 wie beabsichtigt.
- **Leerer Speicher (`storedM3 = 0`):**
  - Gegenprobe: Speicher 0, Zufluss 50 m³/Tag, Bedarf 200 m³/Tag, Trigger 0.5, Sparanteil 0.2.
  - Tag 1: Bedarf 200 m³, Sparvorgabe 40 m³, Anforderung 160 m³.
  - Zufluss 50 m³ wird voll zugeteilt (`suppliedM3 = 50`), Defizit 110 m³, Endspeicher 0 m³.
  - Massenbilanz bleibt exakt erhalten (`balanceErrorM3 = 0.0`), keine Unterläufe oder NaN.
- **Atomare Validierung und ungültige Politiken:**
  - `setConservationRule`:
    - `conservationShare > 0.6` wirft `RangeError`; alter Wert bleibt unverändert.
    - Kombination aus gültigem Trigger (0.8) und ungültigem Share (0.9) wirft `RangeError`; **weder** Trigger noch Share werden mutiert (vollständige Atomizität gesichert).
    - Trigger `< 0` oder `> 1` wirft `RangeError`.
    - Nicht-numerische Typen (`"0.2"`, `undefined`, `null`) werfen `TypeError`.
  - `setInflow` und `setTreatmentCapacity`: Negative Werte werfen `RangeError`, ungültige Typen `TypeError`.

### 2.4 Forschungsbezug und didaktischer Zweck (Research Brief)
Im Research Brief (`docs/development/city-model-research.md`, Abschnitt 9) ist das Modell als vereinfachte Adaption des Hedging-Problems nach Draper & Lund (2004) definiert: Die Stadt entscheidet, ob sie bei einsetzender Trockenheit frühzeitig maßvoll spart, um später katastrophale Ausfälle zu verhindern.
- Ein Schwellenwert-Indikator, der bei Sparquote 0 % "Spartage" zählt, widerspricht der Begrifflichkeit und stiftet didaktische Verwirrung (der Nutzer sieht Einsparungsstatus trotz Dürre-Katastrophe).
- Die Bedingung `conservationShare > 0` ist daher kein "neues physikalisches Gesetz", sondern die notwendige und korrekte Definition eines Zustands- und Zählerindikators ("Es wird nur dann gespart, wenn eine reale Drosselung angefordert wird").

---

## 3. Vertrags- und Chronologie-Integrität

### 3.1 Hash-Integrität der Testskripte
Die Prüfsummen in `models/city-water/evidence/checks.md` wurden unabhängig via `sha256sum tests/public-contracts/city-water/*.ts` verifiziert:

| Skript | Erwarteter SHA-256 (checks.md) | Unabhängig berechneter SHA-256 | Status |
| --- | --- | --- | --- |
| `01-setup.ts` | `3ef30ae0c3ffc7f1b904da4dc0099e10d3b0fba5ec576b1b36ae3bfe4444018b` | `3ef30ae0c3ffc7f1b904da4dc0099e10d3b0fba5ec576b1b36ae3bfe4444018b` | Übereinstimmend |
| `02-balance.ts` | `7f1bad40ce89bcc0d8914a71e03492ad6f1120646c63ad99ca09dcfeff6c072c` | `7f1bad40ce89bcc0d8914a71e03492ad6f1120646c63ad99ca09dcfeff6c072c` | Übereinstimmend |
| `03-policy.ts` (aktuell) | `206cfefe48934cdeddaeff81941ec7a5b55bbb39fb27681fef10daacfe93c081` | `206cfefe48934cdeddaeff81941ec7a5b55bbb39fb27681fef10daacfe93c081` | Übereinstimmend |
| `04-validation-snapshots.ts` | `c6ee908cd9805d8b9c9356c8fb3db44a4eff31a30e801880a9ced04190badf0f` | `c6ee908cd9805d8b9c9356c8fb3db44a4eff31a30e801880a9ced04190badf0f` | Übereinstimmend |

### 3.2 Keine Aufweichung bestehender Zusicherungen
In `03-policy.ts` wurden ausschließlich die Baseline-Assertionen (Zeilen 14–19) vorangestellt:
```ts
const baseline = season(1, 0);
assert.equal(baseline.state.totalConservedM3, 0);
assert.equal(baseline.state.conservationDayCount, 0);
assert.equal(baseline.state.isSavingTomorrow, false);
assert.equal(baseline.state.totalShortageM3, 1200);
```
Alle nachfolgenden Zusicherungen zu Experiment A (84 Spartage, 2520 m³ conserved, lowest 120 m³), Experiment B (42 Spartage, 3360 m³ conserved, lowest 640 m³) und zur Abwasserbehandlung blieben Zeichen für Zeichen unangetastet.

### 3.3 Chronologie und Selbstausweisung
Der Autor hat in `models/city-water/evidence/checks.md` und `ui/agent-lab/acceptance/city-models/revision-2-visual-fixes.md` wahrheitsgemäß festgehalten:
- Dass der Test `03-policy.ts` vor der Modelländerung scheiterte (`conservationDayCount: 120` statt `0`).
- Dass kein separater Freeze-Commit vorliegt, sondern die Hashes und Zeitstempel die tatsächliche Arbeitsreihenfolge dokumentieren.
- Dass die Änderung nach dem ursprünglichen Gemini-Review vorgenommen wurde und dieses separate Recheck erforderte.

---

## 4. Koordinator-Präzisierungen (F1, F2, Heat-README)

### 4.1 F1: Services Distanzreferenz (`models/city-services/README.md`)
- **Vorher:** *"keep the central hub and raise the trip limit to 3.5 km ... average trip grows from 1.35 to 1.99 km"* (unklar, worauf sich 1.35 km bezog).
- **Präzisierung (Zeilen 27–28):**
  > *"The average trip for served requests is 1.99 km, compared with 1.35 km in the distributed layout; the central default serves only 24 requests at an average of 1.46 km."*
- **Bewertung:** Vollständig präzise und mathematisch exakt aufgeschlüsselt.

### 4.2 F2: Economy Erholungs- und Gesamtschock-Aufträge (`models/city-economy/README.md`)
- **Vorher:** Diskrepanz zwischen Code (`cumulativeLostOrders: 52`) und Fließtext (*"48 orders go unserved"*).
- **Präzisierung (Zeilen 27–28):**
  > *"With one hire per firm and month, the recovery takes five months and 48 orders go unserved during recovery. Including the four lost during the shock, the cumulative total is 52."*
- **Bewertung:** Vollständig präzise aufgelöst; differenziert sauber zwischen den 4 verlorenen Aufträgen in Monat 4 des Schocks und den 48 Aufträgen der Erholungsmonate 7–11.

### 4.3 Heat-README: Nachtabkühlung unter Schatten (`models/city-heat/README.md`)
- **Vorherige Autor-Fehlinterpretation:** Schatten wirke "nach Sonnenuntergang kaum".
- **Korrektur (Zeilen 27 & 39–40):**
  > *"The sealed block drops about 6 °C at 15:00 and about 2 °C at night, because less heat was stored."*  
  > *"With shade 0.4 on day 2, the sealed block is 35.4 instead of 41.3 °C at 16:00 and still 28.1 instead of 30.4 °C at 04:00: there is no sun at night, so the night difference is heat the shaded surfaces did not store during the day."*
- **Mechanismus-Check:** `models/city-heat/model.ts` integriert die thermische Bilanz kontinuierlich über die Wärmekapazität (`heatCapacityJm2K`). Eine geringere solare Einstrahlung am Nachmittag führt zu einer niedrigeren Ausgangstemperatur bei Sonnenuntergang. Der nächtliche Wärmeverlust startet auf einem tieferen Niveau, sodass die Fläche auch um 04:00 Uhr kühler bleibt. Die Formulierung ist thermisch und mechanistisch exakt.

---

## 5. Grenzen des Rechecks

- **Keine visuelle Re-Evaluation:** Die Bildanalyse der aktualisierten UI-Screenshots erfolgt parallel durch den Visual-Reviewer (Opus).
- **Keine empirische Kalibrierung:** Bestätigt wird die mathematische und konzeptionelle Konsistenz des Modells als synthetisches Lehrmodell, nicht die hydrologische Validität eines realen Wasserversorgungsnetzes.
- **READ-ONLY Mandat:** Es wurden keinerlei Dateien im Projektverzeichnis modifiziert, committet oder gepusht. Alle Testartefakte wurden ausschließlich in `/tmp` ausgeführt.

---

## 6. Fazit

Die substantielle Vertragsanpassung in `city-water` löst den Befund L-WAT1 fehlerfrei, elegant und ohne Nebeneffekte auf bestehende Verträge. Alle Begleitdokumente sind konsistent und präzise. Die Freigabe wird ohne Vorbehalte erteilt.
