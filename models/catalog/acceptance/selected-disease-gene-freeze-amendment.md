# Explicitly approved B09 script05 freeze amendment

On6November2026 the user explicitly answered: “Ja, genau diese zwei Korrekturen erlauben.” This satisfies PLAN's required agreement for substantive frozen expectations. The correction was applied only after that answer; all earlier failure reports remain historical evidence.

Exactly two source lines changed in examples/selected-disease-gene/05-control-and-protein-synthesis.ts:

```diff
-const controls = travel({ seed: 51, initialPeople: 100, initialAmbulance: 2, infectionChance: 0, recoveryChance: 100, averageRecoveryTime: 1, inoculationChance: 100 });
+const controls = travel({ seed: 51, initialPeople: 100, initialAmbulance: 2, infectionChance: 0, recoveryChance: 100, averageRecoveryTime: 1, inoculationChance: 50 });
-assert.ok(controls.read().agents.filter(agent => !agent.ambulance && !agent.infected).every(agent => agent.inoculated));
+assert.ok(controls.read().agents.filter(agent => !agent.ambulance && !agent.infected).some(agent => agent.inoculated));
```

No other syntax, input, assertion, expected result or model/UI implementation changed. Original05 SHA256 `4933b5be866390a2ca4a62de35a494a5540066a1d384e09f65900846c85754d1`; approved05 SHA256 `45abcf470381a256b0bc34e3206e942411f11fcfc2de241ccc69b4c4e6f4a850`. Scripts01–04 retain their original hashes. [Original five-hash freeze](selected-disease-gene-evidence/frozen-original.sha256) and [current approved freeze](selected-disease-gene-examples.sha256) are both retained.

All five complete public scripts were rerun after the change and passed with assertions enabled. All four repository TypeScript projects, standalone TypeScript for all five examples and the current five-hash verification also passed. [Approved run records](selected-disease-gene-evidence/approved-frozen-example-runs.json), [repository types](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-disease-gene-evidence/typecheck-approved.log), [standalone types](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-disease-gene-evidence/standalone-approved-types.log), [approved hashes](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-disease-gene-evidence/approved-frozen-hashes.log). The original failed05 run is preserved separately.

The actual original100%-inoculated ln0 remains a preserved, tested error scenario. Actual native50% and final immutable target50% observations were already retained before approval as proposal-only checks; they are not relabeled as execution of the amended script. The new shell records establish the actual approved script run. Runtime and UI files/bundle hashes are unchanged by this amendment, so existing final-code Chromium captures remain applicable. Both owned tabs/server remain closed.

The local five-script gate is now complete. Root alone may register the five scripts and update global counts after its current combined check. Required independent Argon8194e842 approval remains quota-pending; no new review/retry/substitution or author approval occurred.
