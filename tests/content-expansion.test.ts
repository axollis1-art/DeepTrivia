import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {bank} from '../server/content';
import {eligiblePrompts,selectPrompts,parseTopics,parseDifficulty,matchAnswer,validateContent} from '../src/shared/core';
import {CATEGORIES,SCORING_VERSION} from '../src/shared/types';
import {openDatabase} from '../server/database';
import {Game} from '../server/game';
import {CloudGame} from '../cloud/game';
import {LocalDatabase} from '../cloud/local-db';
test('at least 200 new playable questions, broad coverage, varied topics and approximately 60/30/10 difficulty',()=>{
 const newBank=bank.filter(p=>p.sources[0].checkedOn==='2026-10-09');assert.ok(newBank.filter(p=>p.reviewed).length>=200);
 assert.deepEqual(validateContent(bank),[]);const playable=bank.filter(p=>p.reviewed);
 for(const [d,ratio] of [['easy',.6],['medium',.3],['hard',.1]] as const)assert.ok(Math.abs(playable.filter(p=>p.difficulty===d).length/playable.length-ratio)<.07,d);
 assert.equal(new Set(playable.map(p=>p.category)).size,18);assert.ok(playable.every(p=>p.coverage==='complete'||p.answers.length>=30));assert.ok(bank.filter(p=>!p.reviewed).every(p=>p.coverage==='flagged'));
});
test('topic and difficulty filtering, balanced selection, fresh-before-repeat and old topic names',()=>{
 assert.equal(parseDifficulty(undefined),'easy');assert.throws(()=>parseDifficulty('extreme'));assert.deepEqual(parseTopics(['Film & books']),['Films','Books']);assert.throws(()=>parseTopics([]));
 for(const difficulty of ['easy','hard'] as const){const pool=eligiblePrompts(bank,['Food','Science'],difficulty);assert.ok(pool.length>=7);assert.ok(pool.every(p=>p.difficulty===difficulty));const a=selectPrompts(pool,7,[],()=>.1,difficulty).prompts,b=selectPrompts(pool,7,a.map(p=>p.id),()=>.1,difficulty).prompts;if(pool.length>=14)assert.equal(new Set([...a,...b].map(p=>p.id)).size,14);}
 const pool=eligiblePrompts(bank,['Food','Pets'],'easy');const picked=selectPrompts(pool,7,[],()=>.1,'easy').prompts;assert.ok(Math.abs(picked.filter(p=>p.category==='Food').length-picked.filter(p=>p.category==='Pets').length)<=1);
 const mixed=selectPrompts(eligiblePrompts(bank,CATEGORIES,'mixed'),7,[],()=>.1,'mixed').prompts;assert.equal(mixed.filter(p=>p.difficulty==='easy').length,4);assert.equal(mixed.filter(p=>p.difficulty==='medium').length,2);assert.equal(mixed.filter(p=>p.difficulty==='hard').length,1);
});
test('expanded aliases, UK/US spellings, plurals and complete small sets match',()=>{
 const blood=bank.find(p=>p.id==='blood-groups')!;assert.equal(matchAnswer(blood,'O-')?.canonical,'O negative');assert.equal(matchAnswer(blood,'O+')?.canonical,'O positive');assert.equal(matchAnswer(blood,'O'),null);
 const cities=bank.find(p=>p.id==='uk-cities')!;assert.equal(cities.answers.length,76);for(const city of ['Ely','Gloucester','Westminster'])assert.ok(matchAnswer(cities,city));assert.equal(matchAnswer(bank.find(p=>p.id==='occupations')!,'Midwives')?.canonical,'Midwife');
 for(const [id,input,name] of [['dog-breeds','Alsatian','German shepherd'],['cat-breeds','Colourpoint shorthair','Colorpoint shorthair'],['mammal-groups','mice','Mouse'],['vegetables','carrots','Carrot'],['months','Sep','September'],['card-suits','clubs','Clubs'],['us-cities','NYC','New York'],['ice-cream-flavours','vanilla','Vanilla']] as const)assert.equal(matchAnswer(bank.find(p=>p.id===id)!,input)?.canonical,name);
 const bad=structuredClone(bank[0]);bad.answers[1].aliases.push(bad.answers[0].canonical);assert.ok(validateContent([bad]).some(e=>e.includes('collision')));bad.coverage='broad';bad.answers=bad.answers.slice(0,5);assert.ok(validateContent([bad]).some(e=>e.includes('Incomplete')));
});
test('SQLite migration opens genuine pre-expansion runs without rewriting snapshots or scoring',()=>{
 const folder=mkdtempSync(join(tmpdir(),'deep-content-old-')),path=join(folder,'save.sqlite');let db:DatabaseSync|undefined;
 try{db=new DatabaseSync(path);db.exec(readFileSync(new URL('../migrations/001.sql',import.meta.url),'utf8'));db.prepare('INSERT INTO sessions VALUES(?,?,?)').run('old-player','csrf',1);
 const snapshot=structuredClone(bank.filter(p=>p.category==='Books').slice(0,7));for(const p of snapshot){delete p.difficulty;delete p.coverage;delete p.coverageNotes;delete p.scoringVersion;p.category='Film & books';}
 db.prepare('INSERT INTO runs(id,session_id,mode,relaxed,snapshot,categories,recent,cycled,created) VALUES(?,?,?,?,?,?,?,?,?)').run('old-run','old-player','solo',0,JSON.stringify(snapshot),'["Film & books"]','[]',0,1);db.close();db=openDatabase(path);const game=new Game(db,bank,()=>10000,0);const view=game.begin('old-run','old-player');assert.equal(view.difficulty,'mixed');assert.equal(view.scoringVersion,'editorial-v1');assert.deepEqual(JSON.parse(game.owned('old-run','old-player').snapshot),snapshot);const result=game.submit('old-run','old-player',{index:0,answer:snapshot[0].answers.find(a=>a.tier==='gem')!.canonical,requestId:'old-score'});assert.equal(result.total,100);
 }finally{db?.close();rmSync(folder,{recursive:true,force:true});}
});
test('both backends default Easy, pin challenge difficulty/topics/scoring and retain old cloud documents',async()=>{
 const db=openDatabase(':memory:'),game=new Game(db,structuredClone(bank),()=>10000,0);for(const s of ['a','b'])game.write('INSERT INTO sessions VALUES(?,?,?)',s,'csrf',1);
 const cloudDb=new LocalDatabase(':memory:'),cloud=new CloudGame(cloudDb,structuredClone(bank),()=>10000,0);for(const s of ['a','b'])await cloudDb.prepare('INSERT INTO cloud_sessions VALUES(?,?,?)').bind(s,'csrf',1).run();
 try{const run=game.createRun('a',{});assert.equal(game.begin(run,'a').difficulty,'easy');const cr=await cloud.createRun('a',{});assert.equal((await cloud.begin(cr,'a')).difficulty,'easy');
 const cid=game.createChallenge('a',{difficulty:'hard',categories:['Science','Animals']});const own=game.summary(cid,'a');const frozen=JSON.parse(game.owned(own.runId,'a').snapshot);game.bank=[];const friend=game.claim(cid,'b','Bob');assert.deepEqual(JSON.parse(game.owned(friend,'b').snapshot),frozen);assert.equal(game.state(friend,'b').difficulty,'hard');assert.equal(game.state(friend,'b').scoringVersion,SCORING_VERSION);assert.deepEqual(game.state(friend,'b').topics,['Science','Animals']);
 const ccid=await cloud.createChallenge('a',{difficulty:'hard',categories:['Science','Animals']});const c=await cloud.challenge(ccid);cloud.bank=[];const cf=await cloud.claim(ccid,'b','Bob');const saved=(await cloud.storedRun(cf,'b')).run;assert.deepEqual(saved.snapshot,c.snapshot);assert.equal(saved.rules.difficulty,'hard');assert.equal(saved.rules.scoringVersion,SCORING_VERSION);assert.deepEqual(saved.rules.topics,['Science','Animals']);
 const legacy=cloud.makeRun('a','solo',false,CATEGORIES,[],c.snapshot,{readingMs:0,answerMs:25000,toleranceMs:250,points:{familiar:10,uncommon:30,rare:60,deep:85,gem:100}});await(await cloud.insertRun(legacy)).run();assert.equal((await cloud.state(legacy.id,'a')).difficulty,'mixed');assert.equal((await cloud.state(legacy.id,'a')).scoringVersion,'editorial-v1');
 }finally{db.close();cloudDb.db.close();}
});
