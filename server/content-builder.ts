import type {Prompt,Category,Tier} from '../src/shared/types';
import {gemNotes} from './gem-notes';
// Original prompts and explanations. ^ separates explicitly curated aliases.
// Ordering encodes editorial tiers, never measured player popularity.
const tiers:Tier[]=['familiar','uncommon','rare','deep'];
export function p(id:string,category:Category,text:string,notes:string,url:string,items:string,gem:string,options:{version?:number;reviewed?:boolean}={}):Prompt {
 const values=items.split('|');return {id,version:options.version??1,category,text,qualificationNotes:notes,reviewed:options.reviewed??true,sources:[{title:new URL(url).hostname+' — category reference',url,checkedOn:'2026-10-07'}],answers:values.map((value,i)=>{const [canonical,...rawAliases]=value.split('^');const aliases=id==='si-units'&&canonical==='Siemens'?[]:rawAliases;const tier:Tier=canonical===gem?'gem':tiers[Math.min(3,Math.floor(i/Math.max(1,values.length/4)))];return {id:`${id}-${i+1}`,canonical,aliases,tier,explanation:canonical===gem?gemNotes[id]:`${canonical} is an accepted example for “${text.replace(/^(Name|Give) /,'').replace(/\.$/,'')}”. ${notes}`,rarityRationale:tier==='gem'?`Editorial Hidden gem: chosen for the discovery in this note: ${gemNotes[id]}`:`Editorial ${tier} tier, assigned for expected general-audience familiarity; no player-frequency measurement is claimed.`};})};
}
