import { POINTS, type Answer, CATEGORIES, type DifficultyMode, type Category, type Prompt } from './types';
export function normalise(value:string):string {const clean=value.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase('en-GB').trim();if(/^(a|b|ab|o)[+-]$/.test(clean))return clean;return clean.replace(/[’‘`]/g,"'").replace(/['.,:;!?()\-–—]/g,'').trim().replace(/\s+/g,' ');}
export function parseDifficulty(raw:unknown):DifficultyMode {if(raw===undefined)return 'easy';if(raw==='easy'||raw==='mixed'||raw==='hard')return raw;throw new Error('Choose Easy, Mixed or Hard.');}
export function parseTopics(raw:unknown):Category[]{if(raw===undefined)return [...CATEGORIES];if(!Array.isArray(raw)||!raw.length)throw new Error('Select at least one topic.');const topics=raw.flatMap(c=>c==='Film & books'?['Films','Books']:[c]);if(topics.some(c=>!CATEGORIES.includes(c)))throw new Error('Select recognised topics.');return [...new Set(topics)] as Category[];}
export function eligiblePrompts(bank:Prompt[],topics:Category[],mode:DifficultyMode):Prompt[]{const expanded=topics.flatMap(c=>c==='Film & books'?['Films','Books']:[c]);return bank.filter(p=>p.reviewed&&p.coverage!=='flagged'&&expanded.includes(p.category)&&(mode==='mixed'||(p.difficulty??'medium')===mode));}
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
export function validateContent(bank:Prompt[]):string[]{
 const errors:string[]=[],ids=new Set<string>(),questions=new Set<string>(),sets=new Map<string,string>();
 for(const p of bank){
  if(ids.has(p.id))errors.push('Duplicate prompt '+p.id);ids.add(p.id);
  const question=normalise(p.text);if(questions.has(question))errors.push('Duplicate question '+p.id);questions.add(question);
  if(!p.id||p.version<1||!p.text||!p.qualificationNotes||!CATEGORIES.includes(p.category)||!['easy','medium','hard'].includes(p.difficulty??'')||!p.coverageNotes||!p.scoringVersion||!['broad','complete','flagged'].includes(p.coverage??'')||!p.sources.length||p.sources.some(s=>!s.title||!/^https:\/\//.test(s.url)||!/^\d{4}-\d{2}-\d{2}$/.test(s.checkedOn)))errors.push('Metadata '+p.id);
  if(p.coverage==='flagged'&&p.reviewed)errors.push('Flagged question enters play '+p.id);
  if(p.reviewed&&p.coverage==='broad'&&p.answers.length<30)errors.push('Incomplete open list '+p.id);
  if(p.answers.filter(a=>a.tier==='gem').length!==1)errors.push('Gem count '+p.id);
  const aliases=new Map<string,string>(),answerIds=new Set<string>(),canonical=new Set<string>();
  for(const a of p.answers){
   if(answerIds.has(a.id))errors.push('Answer ID '+p.id+'/'+a.id);answerIds.add(a.id);
   if(!a.canonical||a.canonical.length>120||canonical.has(normalise(a.canonical)))errors.push('Invalid or duplicate answer '+p.id+'/'+a.canonical);canonical.add(normalise(a.canonical));
   if(!(a.tier in POINTS)||!a.explanation||!a.rarityRationale)errors.push('Answer metadata '+p.id+'/'+a.id);
   for(const value of [a.canonical,...a.aliases]){const key=normalise(value);if(!key||value.length>120)errors.push('Invalid alias '+p.id);if(aliases.has(key)&&aliases.get(key)!==a.id)errors.push('Alias collision '+p.id+': '+value);aliases.set(key,a.id);}
  }
  if(p.answers.length<3)errors.push('Insufficient choices '+p.id);
  if(p.reviewed){const fingerprint=[...canonical].sort().join('|');if(sets.has(fingerprint))errors.push('Duplicate answer set '+p.id+' / '+sets.get(fingerprint));sets.set(fingerprint,p.id);}
 }return errors;
}
export function selectPrompts(bank:Prompt[],count:number,recent:string[]=[],random:()=>number=Math.random,mode?:DifficultyMode):{prompts:Prompt[];cycled:boolean}{if(bank.length<count)throw new Error('Choose more categories or a different difficulty: seven distinct questions are needed.');const seen=new Set(recent);const fresh=bank.filter(p=>!seen.has(p.id));const cycled=fresh.length<count;const pool=[...fresh,...bank.filter(p=>seen.has(p.id))];const selected:Prompt[]=[];const counts=new Map<string,number>();while(selected.length<count){const unused=pool.filter(p=>!selected.includes(p));const freshUnused=unused.filter(p=>!seen.has(p.id));const candidates=freshUnused.length?freshUnused:unused;const least=Math.min(...candidates.map(p=>counts.get(p.category)??0));const balanced=candidates.filter(p=>(counts.get(p.category)??0)===least);const wanted=['easy','easy','medium','easy','medium','easy','hard'][selected.length%7];const suitable=mode==='mixed'?balanced.filter(p=>p.difficulty===wanted):[];const choices=suitable.length?suitable:balanced;const p=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];selected.push(p);counts.set(p.category,(counts.get(p.category)??0)+1);}return {prompts:selected,cycled};}
export function phase(now:number,readingUntil:number,deadline:number|null){return now<readingUntil?'reading':deadline!==null&&now>deadline+250?'timeout':'answering';}
export function depth(points:number){return points*10;}
export function stagePoints(points:number[]){return points.slice(Math.floor(Math.max(0,points.length-1)/7)*7).reduce((a,b)=>a+b,0);}
