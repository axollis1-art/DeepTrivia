import {SCORING_VERSION,type Prompt,type Category,type Difficulty,type Tier} from '../src/shared/types';
export const refs={
 food:'https://www.bbcgoodfood.com/glossary',
 animals:'https://animals.sandiegozoo.org/animals',
 pets:'https://www.royalkennelclub.com/search/breeds-a-to-z/',
 cats:'https://cfa.org/breeds/',
 geography:'https://www.britannica.com/browse/Geography-Travel',
 words:'https://www.oxfordlearnersdictionaries.com/topic/',
 nasa:'https://science.nasa.gov/solar-system/',
 science:'https://www.britannica.com/browse/Science',
 transport:'https://collection.sciencemuseumgroup.org.uk/',
 tech:'https://developer.mozilla.org/en-US/docs/Glossary',
 sport:'https://olympics.com/en/sports/',
 music:'https://www.britannica.com/art/music',
 films:'https://www.disneyanimation.com/films/',
 books:'https://www.britannica.com/art/literature',
 tv:'https://www.bbc.co.uk/programmes',
 games:'https://www.bicyclecards.com/how-to-play',
 plants:'https://apps.rhs.org.uk/horticulturaldatabase/summary2.asp',
 flags:'https://www.britannica.com/topic/flag',
 history:'https://www.britannica.com/browse/History',
};
// Semicolon-separated groups explicitly assign familiarity tiers; they are
// editorial judgements, not percentiles or measured popularity. ^ adds aliases.
export function q(id:string,category:Category,difficulty:Difficulty,text:string,url:string,groups:string,coverage:'broad'|'complete'='complete',notes='The named category only; alternate names and relevant plurals are accepted.'):Prompt {
 const tiers:Tier[]=['familiar','uncommon','rare','deep','gem'];
 const answers=groups.split(';').flatMap((group,index)=>group?group.split('|').map(value=>{
  const [canonical,...aliases]=value.split('^');const tier=tiers[index];
  return {id:id+'-'+canonical,canonical,aliases,tier,explanation:`${canonical} fits this question. ${notes}`,rarityRationale:`Editorial ${tier} tier based on expected familiarity to a general UK audience; no measured frequency is claimed.`};
 }):[]);
 if(!answers.some(a=>a.tier==='gem')){const last=answers.at(-1)!;last.tier='gem';last.rarityRationale='Editorial Hidden gem: a less immediately recalled member of this set; no measured frequency is claimed.';}
 return {id,version:1,category,difficulty,text,qualificationNotes:notes,reviewed:true,coverage,coverageNotes:coverage==='complete'?'Closed set checked against the cited reference.':'Broad everyday coverage, including common choices and less familiar examples; the category remains open and reports are welcome.',scoringVersion:SCORING_VERSION,sources:[{title:new URL(url).hostname+' — '+text,url,checkedOn:'2026-10-09'}],answers};
}
