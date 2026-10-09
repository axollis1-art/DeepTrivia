import {bank} from '../server/content';
import {normalise} from '../src/shared/core';
import {mkdirSync,writeFileSync} from 'node:fs';
const prompts=bank.filter(p=>p.sources.some(s=>s.checkedOn==='2026-10-09'));
const urls=[...new Set(prompts.flatMap(p=>p.sources.filter(s=>s.checkedOn==='2026-10-09').map(s=>s.url)))];
const results:any[]=[];
for(let index=0;index<urls.length;index+=8){
 const batch=await Promise.all(urls.slice(index,index+8).map(async url=>{const questions=prompts.filter(p=>p.sources.some(s=>s.url===url));try{const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Mozilla/5.0 (DeepTrivia source verification)'}});const html=await response.text();const text=normalise(html.replace(/<[^>]*>/g,' ').replace(/&[^;]+;/g,' '));return {url,status:response.status,finalUrl:response.url,questions:questions.map(p=>({id:p.id,answers:p.answers.length,namesVisible:p.answers.filter(a=>[a.canonical,...a.aliases].some(name=>name.length>=4&&text.includes(normalise(name)))).length})),contentReadable:response.ok&&text.length>200};}catch(error){return {url,status:'unreachable',error:(error as Error).message,questions:questions.map(p=>({id:p.id}))};}}));results.push(...batch);console.log(JSON.stringify({checked:results.length,total:urls.length,readable:results.filter(r=>r.contentReadable).length}));
}
mkdirSync('test-results',{recursive:true});writeFileSync('test-results/content-source-audit.json',JSON.stringify({checkedOn:'2026-10-09',note:'Name visibility is a source-triage aid, not proof of factual validity. Dynamic sites or bot blocking can hide correct entries. Category and closed-set boundaries also require editorial review.',results},null,2));
