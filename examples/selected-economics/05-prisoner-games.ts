import assert from "node:assert/strict";
import { create as basic } from "../../models/prisoners-dilemma-basic/model.ts";
import { create as iterated } from "../../models/prisoners-dilemma-two-person-iterated/model.ts";
for (const [youSilent, partnerSilent, years] of [[true,true,1],[false,true,0],[true,false,5],[false,false,3]] as const) {
  const p = basic({ youSilent, partnerSilent, partnerSilenceKnown: true, seed: 1 });
  p.answer(); assert.equal(p.read().years, years); assert.equal(p.read().partnerIsSilent, partnerSilent);
  p.answer(); assert.equal(p.read().years, years); // answer starts a fresh setup
}
const i = iterated({ humanStrategy: "cooperate", computerStrategy: "defect", selectComputerStrategy: true, seed: 1 });
assert.equal(i.read().human.score, 3); assert.equal(i.read().computer.score, 3);
i.advance(); let s = i.read(); assert.equal(s.tick, 1);
assert.equal(s.human.score, 3); assert.equal(s.computer.score, 8);
assert.equal(s.human.averageScore, 1.5); assert.equal(s.computer.averageScore, 4);
assert.equal(s.human.partnerDefected, true); assert.equal(s.computer.partnerDefected, false);
i.advance(); s = i.read(); assert.equal(s.tick, 2);
assert.equal(s.human.score, 3); assert.equal(s.computer.score, 13);
const t = iterated({ humanStrategy: "defect", computerStrategy: "tit-for-tat", selectComputerStrategy: true });
t.advance(); assert.equal(t.read().human.score, 8); assert.equal(t.read().computer.score, 3);
t.advance(); assert.equal(t.read().human.score, 9); assert.equal(t.read().computer.score, 4);
console.log("prisoner-games: four sentences, pseudo-round average and delayed tit-for-tat retaliation");
