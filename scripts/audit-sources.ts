import {bank} from '../server/content';
const urls=[...new Set(bank.flatMap(p=>p.sources.map(s=>s.url)))];
for(let i=0;i<urls.length;i+=5){const results=await Promise.all(urls.slice(i,i+5).map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(10000),headers:{'User-Agent':'DeepTriviaContentReview/1.0'}});await r.body?.cancel();return {url,status:r.status};}catch(e){return {url,status:'unreachable',reason:(e as Error).message};}}));for(const result of results)console.log(JSON.stringify(result));}
