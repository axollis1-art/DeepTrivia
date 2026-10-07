import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn,type ChildProcess} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {openDatabase} from '../server/database';
import {Game} from '../server/game';
import {bank} from '../server/content';
test('two new production server processes independently retrieve persisted challenge results',{timeout:30000},async()=>{
 const folder=mkdtempSync(join(tmpdir(),'deep-trivia-restart-'));const path=join(folder,'db.sqlite');const db=openDatabase(path);const game=new Game(db,bank,Date.now,0,25000);
 const alice=randomBytes(24).toString('base64url');const bob=randomBytes(24).toString('base64url');for(const s of [alice,bob])game.write('INSERT INTO sessions VALUES(?,?,?)',s,'csrf',Date.now());
 const cid=game.createChallenge(alice,{nickname:'Alice'});const first=game.summary(cid,alice).runId;const second=game.claim(cid,bob,'Bob');for(const [runId,session]of [[first,alice],[second,bob]])for(let i=0;i<7;i++){game.begin(runId,session);const prompt=JSON.parse(game.owned(runId,session).snapshot)[i];game.submit(runId,session,{index:i,answer:prompt.answers.find((a:any)=>a.tier==='gem').canonical,requestId:`restart-${i}`});}db.close();
 let child:ChildProcess|undefined;const origin='http://127.0.0.1:3111';
 async function start(){const env={...process.env,PORT:'3111',PUBLIC_ORIGIN:origin,DATABASE_PATH:path,TEST_FAST_TIMERS:'0'};delete (env as any).NODE_TEST_CONTEXT;child=spawn(process.execPath,['--import','tsx','server/index.ts','--production'],{cwd:process.cwd(),env,stdio:'pipe'});let output='';child.stderr?.on('data',s=>{output+=s.toString();});child.stdout?.on('data',s=>{output+=s.toString();});child.on('error',e=>{output+=e.message;});for(let i=0;i<100;i++){if(child.exitCode!==null)throw new Error(output);try{const r=await fetch(`${origin}/api/session`,{signal:AbortSignal.timeout(500)});if(r.ok)return;}catch{}await delay(100);}throw new Error('Production server did not start: '+output);}
 async function stop(){if(child?.pid&&child.exitCode===null){const closed=new Promise<void>(r=>child!.once('exit',()=>r()));child.kill();await Promise.race([closed,delay(2000)]);}}
 try{for(let n=0;n<2;n++){await start();const r=await fetch(`${origin}/api/challenges/${cid}`,{headers:{Cookie:`deep_session=${bob}`}});assert.equal(r.status,200);const summary=await r.json() as any;assert.equal(summary.results.length,2);assert.deepEqual(summary.results.map((p:any)=>p.total),[700,700]);assert.deepEqual(summary.results.map((p:any)=>p.depth),[7000,7000]);const html=await fetch(`${origin}/challenge/${cid}`);assert.equal(html.status,200);assert.match(await html.text(),/Deep Trivia/);await stop();}}finally{await stop();rmSync(folder,{recursive:true});}
});
