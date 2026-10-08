export type Tier = 'familiar'|'uncommon'|'rare'|'deep'|'gem';
export type Category = 'Geography'|'Nature'|'Food'|'Science'|'Language'|'Culture'|'Film & books'|'Sport';
export interface Answer {id:string;canonical:string;aliases:string[];tier:Tier;explanation:string;rarityRationale:string}
export interface Prompt {id:string;version:number;category:Category;text:string;qualificationNotes:string;reviewed:boolean;sources:{title:string;url:string;checkedOn:string}[];answers:Answer[]}
export interface Outcome {index:number;promptId:string;promptVersion:number;prompt:string;submitted:string;canonical:string|null;tier:Tier|null;points:number;status:'accepted'|'invalid'|'timeout';explanation:string;examples?:string[]}
export interface RunView {id:string;mode:'solo'|'endless'|'challenge';relaxed:boolean;state:'reading'|'answering'|'result'|'complete';serverNow:number;readingUntil:number|null;deadline:number|null;round:number;total:number;depth:number;stageDepth:number;stage:number;answered:number;prompt?:{id:string;version:number;category:Category;text:string;notes:string};feedback?:string;outcome?:Outcome;recap?:Outcome[];cycled:boolean;challengeId?:string}
export interface Settings {sound:boolean;reducedMotion:boolean;scanlines:boolean;relaxed:boolean;categories:Category[]}
export const CATEGORIES:Category[]=['Geography','Nature','Food','Science','Language','Culture','Film & books','Sport'];
export const POINTS:Record<Tier,number>={familiar:10,uncommon:30,rare:60,deep:85,gem:100};
export const TIER_NAMES:Record<Tier,string>={familiar:'Familiar',uncommon:'Uncommon',rare:'Rare',deep:'Deep discovery',gem:'Hidden gem'};
