import test from 'node:test';
import assert from 'node:assert/strict';
import {bank} from '../server/content';
import {normalise,matchAnswer,suggestAnswer,validateContent,selectPrompts,phase} from '../src/shared/core';
import {POINTS} from '../src/shared/types';
test('spelling suggestions tolerate several edits with exact matches taking priority',()=>{
 const p=structuredClone(bank[0]);p.answers=p.answers.slice(0,2);p.answers[0].canonical='banana';p.answers[0].aliases=['yellow banana'];p.answers[1].canonical='bandana';p.answers[1].aliases=[];
 assert.equal(matchAnswer(p,'banana')?.id,p.answers[0].id);
 assert.equal(suggestAnswer(p,'banxana'),null); // one edit from both identities
 assert.equal(suggestAnswer(p,'bnaana')?.id,p.answers[0].id);
 assert.equal(suggestAnswer(p,'yellow banan')?.id,p.answers[0].id);
 assert.equal(suggestAnswer(p,'baxxxna'),null);
 const africa=bank.find(p=>p.id==='africa')!;
 assert.equal(suggestAnswer(africa,'Nigeira')?.canonical,'Nigeria');
 assert.equal(matchAnswer(africa,'Niger')?.canonical,'Niger');
 assert.equal(suggestAnswer(africa,'Nigera'),null);
 assert.equal(matchAnswer(africa,'Keny'),null);
 p.answers[0].canonical='strawberry';p.answers[0].aliases=[];
 assert.equal(suggestAnswer(p,'strowbarri')?.canonical,'strawberry');
 assert.equal(matchAnswer(p,'strowbarri'),null);
 assert.equal(suggestAnswer(p,'zzzzzzzzzz'),null);
});
test('normalisation accepts accents, curated aliases and harmless punctuation without fuzzy guessing',()=>{const p=bank.find(p=>p.id==='africa')!;assert.equal(matchAnswer(p,'  SAO   TOME AND PRINCIPE  ')?.canonical,'São Tomé and Príncipe');assert.equal(matchAnswer(p,'Ivory Coast')?.canonical,'Côte d’Ivoire');assert.equal(matchAnswer(p,'Keny'),null);assert.equal(matchAnswer(p,'Congo'),null);assert.equal(matchAnswer(p,'x'.repeat(121)),null);assert.equal(matchAnswer(bank.find(p=>p.id==='shakespeare')!,'a midsummer nights dream')?.canonical,'A Midsummer Night’s Dream');assert.equal(normalise('ＲＯＳＥ'),normalise('rose'));});
test('all content matches itself and is internally consistent; ambiguous aliases fail validation',()=>{assert.deepEqual(validateContent(bank),[]);for(const p of bank)for(const a of p.answers){assert.equal(matchAnswer(p,a.canonical)?.id,a.id);for(const alias of a.aliases)assert.equal(matchAnswer(p,alias)?.id,a.id);}const p=structuredClone(bank[0]);p.answers[0].aliases.push(p.answers[1].canonical);assert.ok(validateContent([p]).some(e=>e.includes('collision')));});
test('selection balances categories, never duplicates within a run, and exhausts unseen before reuse',()=>{const picked=selectPrompts(bank,7,[],()=>.4);assert.equal(new Set(picked.prompts.map(p=>p.id)).size,7);assert.equal(new Set(picked.prompts.map(p=>p.category)).size,7);const seen=bank.slice(0,-2).map(p=>p.id);const next=selectPrompts(bank,7,seen,()=>0);assert.ok(bank.slice(-2).every(p=>next.prompts.some(v=>v.id===p.id)));assert.equal(next.cycled,true);assert.throws(()=>selectPrompts(bank.slice(0,6),7),/more categories/);});
test('deadline boundaries preserve reading and the documented 250ms transport tolerance',()=>{assert.equal(phase(2999,3000,28000),'reading');assert.equal(phase(3000,3000,28000),'answering');assert.equal(phase(28250,3000,28000),'answering');assert.equal(phase(28251,3000,28000),'timeout');assert.equal(phase(999999,3000,null),'answering');assert.equal(POINTS.gem*7*10,7000);});
