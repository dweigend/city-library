/** Additional acceptance probes, run unchanged in Bun and actual loaded T3 Chromium modules. */
export function probe(create, slug) {
  let assertions = 0;
  const check = (condition, message) => { assertions++; if (!condition) throw new Error(message); };
  const equal = (actual, expected, message) => check(JSON.stringify(actual) === JSON.stringify(expected), message + ': ' + JSON.stringify(actual));
  const near = (a, b, message) => check(Math.abs(a-b) < 1e-10, message);
  let evidence = {};
  if (slug === 'consumer-choice') {
    const m=create({numConsumers:10,avgConnections:0,initialOrangePercent:100,qualityOrange:0,qualityBlue:0,exploration:1,normInfluence:0,informationExchange:0});
    m.advance();equal(m.read().orangeCount,0,'certain exploration switches all');m.setParameters({qualityOrange:1});m.advance();m.advance(3);
    equal(m.read().orangeCount,10,'updated satisfaction locks choice');check(m.read().consumers.every(a=>a.utilities[0]===.5&&a.satisfaction[0]===1),'experience enters after consume');
    evidence={tick:m.read().tick,orange:m.read().orangeCount,utility:m.read().consumers[0].utilities};
  } else if(slug==='rebellion') {
    const m=create({initialCopDensity:0,initialAgentDensity:1,movement:false,governmentLegitimacy:0});const before=m.read();m.advance();
    check(m.read().agents.every(a=>a.active===(a.hardship>.1)),'grievance threshold without police');equal(m.read().agents.map(a=>[a.x,a.y]),before.agents.map(a=>[a.x,a.y]),'movement false');
    m.setParameters({governmentLegitimacy:1});m.advance();equal(m.read().activeCount,0,'legitimacy intervention');m.watchOne();equal(m.read().parameters.visualization,'3D','watch mode');
    evidence={tick:m.read().tick,quiet:m.read().quietCount,watched:m.read().watchedId!==null};
  } else if(slug==='language-change') {
    const m=create({numNodes:10,percentGrammar1:0,updateAlgorithm:'threshold',thresholdVal:0,sinkState1:false});const links=m.read().links;m.advance();check(m.read().nodes.every(a=>a.state===1),'threshold zero');
    m.resetNodes();check(m.read().nodes.every(a=>a.state===0),'restore original grammar');equal(m.read().links,links,'reset retains topology');m.setParameters({percentGrammar1:100,updateAlgorithm:'individual'});m.redistributeGrammars();m.advance(3);check(m.read().nodes.every(a=>a.state===1),'individual all-one copies');
    evidence={tick:m.read().tick,nodes:m.read().nodes.length,links:m.read().links.length};
  } else if(slug==='party') {
    const m=create({number:0,numGroups:5,tolerance:0});m.setGroups([['male','female'],[],[],[],[]]);m.advance();check(m.read().people.every(a=>!a.happy&&a.group!==0),'happiness precedes migration');m.setParameters({tolerance:99});m.advance();equal(m.read().happyCount,2,'recompute after tolerance');const tick=m.read().tick;m.advance(50);equal(m.read().tick,tick,'preflight stops stale happy');
    evidence={tick,groups:m.read().groups.map(g=>g.count),stopped:m.read().stopped};
  } else if(slug==='ethnocentrism') {
    const m=create({setup:'full',immigrantsPerDay:0,initialPtr:0,costOfGiving:0,gainOfReceiving:0,mutationRate:0,deathRate:0,immigrantChanceCooperateWithSame:1,immigrantChanceCooperateWithDifferent:1});m.advance();equal(m.read().turn.meet,10404,'directed torus interactions');equal(m.read().turn.coopOwn+m.read().turn.coopOther,10404,'all donors cooperate');m.setParameters({deathRate:1});m.advance();equal(m.read().agents.length,0,'death includes population');
    evidence={tick:m.read().tick,agents:m.read().agents.length,encounters:m.read().cumulative.meet};
  } else if(slug==='minority-game') {
    const m=create({number:11,memory:2,strategiesPerAgent:3});const b=m.read();m.advance();const a=m.read();equal(a.history,(2*b.history+b.minority)%4,'old minority appended');
    for(const p of a.agents){const q=b.agents.find(q=>q.id===p.id);equal(p.score,Number(q.choice===b.minority),'old choice reward');equal(p.strategyScores,q.strategies.map(s=>Number(s[b.history]===b.minority)),'virtual old-history reward');equal(p.choice,p.strategies[p.currentStrategy][a.history],'new history choice');}
    const single=create({number:1,memory:2,strategiesPerAgent:1});equal(single.read().stdevScore,null,'single sample adaptation');single.advance();check(!!single.read().diagnostic,'zero mean movement diagnostic');
    evidence={tick:a.tick,history:a.history,minority:a.minority,singleDiagnostic:single.read().diagnostic};
  } else if(slug==='rumor-mill') {
    const m=create();m.advance();equal(m.read().clique,2,'only one source transmits');equal(m.read().totalHeard,2,'one directed exposure');m.hearAt({x:50,y:50});equal(m.read().cells.find(c=>c.x===50&&c.y===50).firstHeard,2,'intervention first heard next tick');let b=m.read();m.setColorMode('times-heard');equal(m.read().randomState,b.randomState,'color purity');m.advance();equal(m.read().totalHeard,b.totalHeard+b.clique,'snapshot activation');
    for(let y=-50;y<=50;y++)for(let x=-50;x<=50;x++)m.hearAt({x,y});b=m.read();m.advance(10);equal(m.read().tick,b.tick,'all informed preflight');equal(m.read().randomState,b.randomState,'stop no draw');evidence={tick:m.read().tick,clique:m.read().clique,stopped:m.read().stopped};
  } else if(slug==='signaling-game') {
    const m=create({numberOfStates:2,numberOfSignals:3,printProbabilities:false});equal(m.read().probabilityOfSuccess,.5,'rectangular initial urns');
    for(let i=0;i<100;i++){const b=m.read();m.advance();const a=m.read();equal(a.timesCorrect-b.timesCorrect,Number(a.lastRound.correct),'success-only reinforcement');equal(a.senderUrns.flat().reduce((s,n)=>s+n,0),6+a.timesCorrect,'sender mass');equal(a.receiverUrns.flat().reduce((s,n)=>s+n,0),6+a.timesCorrect,'receiver mass');}
    const b=m.read();m.printProbabilities();equal(m.read().randomState,b.randomState,'printing pure');const terminal=create({printProbabilities:false});terminal.advance(100000);check(terminal.read().probabilityOfSuccess>.99,'learned threshold');equal(terminal.read().tick,4373,'target deterministic horizon');evidence={tick:m.read().tick,correct:m.read().timesCorrect,terminalTick:terminal.read().tick,terminalProbability:terminal.read().probabilityOfSuccess};
  } else if(slug==='piaget-vygotsky-game') {
    const m=create({numberOfPlayers:10,strategy:'Piagetian',randomizeStrategyEachRun:false,moveError:0,attemptsPerRun:2,stopAfterEachRun:true});m.advance();const first=m.read();equal(first.results.Piagetian,[first.meanScore],'midpoint sample');m.advance(20);equal(m.read().tick,2,'completed run stops batch');equal(m.read().players.map(a=>a.score),first.players.map(a=>a.score),'individual memory retained');m.advance();equal(m.read().attempts,1,'next call new run');
    const fractional=create({numberOfPlayers:10,strategy:'Vygotskiian',randomizeStrategyEachRun:false});fractional.advance();const moves=fractional.read().players.map(a=>Math.ceil(a.maxMoves));fractional.advance();for(const p of fractional.read().players){const n=moves[p.who];near(p.score,Math.abs(n<119?-60+n:176-n),'unit step fractional throw and right bounce');}
    evidence={tick:m.read().tick,attempt:m.read().attempts,fractionalScores:fractional.read().players.map(a=>a.score)};
  } else if(slug==='heroes-and-cowards') {
    const m=create({number:3});const rows=[{x:0,y:0,personality:'cowardly',friend:1,enemy:2},{x:1,y:0,personality:'brave',friend:2,enemy:2},{x:5,y:0,personality:'brave',friend:0,enemy:1}];m.setActors(rows);m.advance();near(m.read().agents[0].x,-.1,'coward extrapolation');m.setActors(rows.map((a,i)=>i===0?{...a,personality:'brave'}:a));m.advance();near(m.read().agents[0].x,.1,'brave midpoint');
    const natural=create();natural.advance(100);equal(natural.read().tick,100,'blocked forward retains completed ticks');equal(natural.read().diagnostic,null,'blocked forward is not an error');const edge=[{x:16.49,y:0,personality:'cowardly',friend:1,enemy:2},{x:16.4,y:0,personality:'brave',friend:2,enemy:2},{x:-16,y:0,personality:'brave',friend:1,enemy:1}];m.setActors(edge);m.advance();near(m.read().agents[0].x,16.49,'blocked actor retains x');equal(m.read().tick,1,'remaining phase and tick continue');m.preset(1086013561);equal(m.read().agents.length,68,'preset population');evidence={tick:m.read().tick,presetAgents:m.read().agents.length,naturalTick:natural.read().tick,diagnostic:natural.read().diagnostic};
  }
  return {slug,assertions,evidence};
}
