import { POINTS, type Answer, type Prompt } from './types';
export function normalise(value:string):string {return value.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase('en-GB').replace(/[’‘`]/g,"'").replace(/['.,:;!?()\-–—]/g,'').trim().replace(/\s+/g,' ');}
export function matchAnswer(prompt:Prompt,input:string):Answer|null {
 const key=normalise(input);if(!key||input.length>120)return null;
 return prompt.answers.find(a=>[a.canonical,...a.aliases].some(name=>normalise(name)===key))??null;
}
function spellingDistance(a:string,b:string):number {
 const rows=Array.from({length:a.length+1},()=>Array<number>(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)rows[i][0]=i;for(let j=0;j<=b.length;j++)rows[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  rows[i][j]=Math.min(rows[i-1][j]+1,rows[i][j-1]+1,rows[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])rows[i][j]=Math.min(rows[i][j],rows[i-2][j-2]+1);
 }return rows[a.length][b.length];
}
export function suggestAnswer(prompt:Prompt,input:string):Answer|null {
 const key=normalise(input);if(!key||input.length>120||matchAnswer(prompt,input))return null;
 let best=Infinity;let candidate:Answer|null=null;
 for(const answer of prompt.answers){let score=Infinity;
  for(const raw of [answer.canonical,...answer.aliases]){const name=normalise(raw),length=Math.max(key.length,name.length);const limit=length<=4?1:length<=7?2:3;
   if(Math.abs(key.length-name.length)>limit)continue;
   const distance=spellingDistance(key,name);if(distance<=limit&&distance/length<=.4)score=Math.min(score,distance);
  }
  if(score<best){best=score;candidate=answer;}else if(score===best)candidate=null;
 }return candidate;
}
export function validateContent(bank:Prompt[]):string[]{const errors:string[]=[];const ids=new Set<string>();for(const p of bank){if(ids.has(p.id))errors.push(`Duplicate prompt ${p.id}`);ids.add(p.id);if(!p.id||p.version<1||!p.text||!p.qualificationNotes||p.sources.length===0||p.sources.some(s=>!s.title||!/^https:\/\//.test(s.url)||!/^\d{4}-\d{2}-\d{2}$/.test(s.checkedOn)))errors.push(`Metadata ${p.id}`);if(p.answers.filter(a=>a.tier==='gem').length!==1)errors.push(`Gem count ${p.id}`);const aliases=new Map<string,string>();const answerIds=new Set<string>();for(const a of p.answers){if(answerIds.has(a.id))errors.push(`Answer ID ${p.id}/${a.id}`);answerIds.add(a.id);if(!(a.tier in POINTS)||!a.explanation||!a.rarityRationale)errors.push(`Answer metadata ${p.id}/${a.id}`);for(const v of [a.canonical,...a.aliases]){const key=normalise(v);if(!key)errors.push(`Empty alias ${p.id}`);if(aliases.has(key)&&aliases.get(key)!==a.id)errors.push(`Alias collision ${p.id}: ${v}`);aliases.set(key,a.id);}}if(p.answers.length<3)errors.push(`Examples ${p.id}`);}return errors;}
export function selectPrompts(bank:Prompt[],count:number,recent:string[]=[],random:()=>number=Math.random):{prompts:Prompt[];cycled:boolean}{if(bank.length<count)throw new Error('Choose more categories: seven distinct questions are needed.');const seen=new Set(recent);const fresh=bank.filter(p=>!seen.has(p.id));const cycled=fresh.length<count;const pool=[...fresh,...bank.filter(p=>seen.has(p.id))];const selected:Prompt[]=[];const counts=new Map<string,number>();while(selected.length<count){const unused=pool.filter(p=>!selected.includes(p));const freshUnused=unused.filter(p=>!seen.has(p.id));const candidates=freshUnused.length?freshUnused:unused;const least=Math.min(...candidates.map(p=>counts.get(p.category)??0));const balanced=candidates.filter(p=>(counts.get(p.category)??0)===least);const p=balanced[Math.min(balanced.length-1,Math.floor(random()*balanced.length))];selected.push(p);counts.set(p.category,(counts.get(p.category)??0)+1);}return {prompts:selected,cycled};}
export function phase(now:number,readingUntil:number,deadline:number|null){return now<readingUntil?'reading':deadline!==null&&now>deadline+250?'timeout':'answering';}
export function depth(points:number){return points*10;}
export function stagePoints(points:number[]){return points.slice(Math.floor(Math.max(0,points.length-1)/7)*7).reduce((a,b)=>a+b,0);}
