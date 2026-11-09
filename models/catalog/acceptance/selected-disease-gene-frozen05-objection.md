# Historical frozen script05 source contradiction — amendment explicitly approved

The original frozen file/hash from d73b344 is preserved historically. The [explicitly approved amendment](selected-disease-gene-freeze-amendment.md) now applies exactly the two corrections below. Source: exact selected epiDEM Travel and Control, SHA-256 7bde08421020920d17631b85cbef80c945a6a97857040a079c8aacbc3a35ac07.

Actual T3 Chromium source execution used `random-seed 51 set initial-people 100 set initial-ambulance 2 set infection-chance 0 set recovery-chance 100 set average-recovery-time 1 set inoculation-chance 100 setup`, then `go`. Setup: ticks0, five infected, zero susceptible. GO raises “Can't take logarithm of 0. error while running LN / called by command CALCULATE-R0 / called by command GO”; tick remains0. Screenshot: [native error](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-disease-gene-evidence/epidem-travel-frozen05-source-error.png). This is source arithmetic, not a missing general capability. Target must expose the failure visibly and preserve partial state/tick.

Exact patch (applied only after the user explicitly approved these two corrections):

```diff
-const controls = travel({ seed: 51, initialPeople: 100, initialAmbulance: 2, infectionChance: 0, recoveryChance: 100, averageRecoveryTime: 1, inoculationChance: 100 });
+const controls = travel({ seed: 51, initialPeople: 100, initialAmbulance: 2, infectionChance: 0, recoveryChance: 100, averageRecoveryTime: 1, inoculationChance: 50 });
-assert.ok(controls.read().agents.filter(agent => !agent.ambulance && !agent.infected).every(agent => agent.inoculated));
+assert.ok(controls.read().agents.filter(agent => !agent.ambulance && !agent.infected).some(agent => agent.inoculated));
```

All other assertions would remain unchanged. PLAN requires explicit agreement for substantive frozen expectations. That agreement has now been received; all five amended/current scripts pass. Implementations and remaining browser scenarios continue; no global registration/count update is authorized here. The declared diagnostic range extension for inoculation100 remains a valid expected-error scenario, not a reason to remove the model.

Separate native validation of the DNA half of script05 completed at tick43: original gene code `["ATGTGG"]`, proteins `["-Met-Trp"]`, count1, no recorded runtime error.

The exact proposed50% scenario was also executed separately, without changing the frozen file: native seed51 reached tick1,102 agents,zero infected,five cured,52 inoculated and43 initial susceptibility markers; final target seed51 reached tick2,102 agents,zero infected,11 cured with `.some(inoculated)` true. [Native proposal-only evidence](selected-disease-gene-evidence/travel-original-proposed50.json), [target proposal-only evidence](selected-disease-gene-evidence/travel-target-proposed50.json). Different initial RNG outcomes are explicit; neither result claims cross-seed trajectory agreement. Explicit agreement was subsequently received and is recorded in the amendment report.
