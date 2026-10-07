import {bank} from '../server/content';
import {validateContent} from '../src/shared/core';
const errors=validateContent(bank);const reviewed=bank.filter(p=>p.reviewed);console.log(JSON.stringify({prompts:bank.length,reviewed:reviewed.length,answers:reviewed.reduce((n,p)=>n+p.answers.length,0),atLeast25:reviewed.filter(p=>p.answers.length>=25).length,categories:[...new Set(reviewed.map(p=>p.category))],targetMet:reviewed.length>=120,errors},null,2));if(errors.length)process.exitCode=1;if(process.argv.includes('--strict-target')&&reviewed.length<120)process.exitCode=1;
