import express from 'express';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {Game,GameError} from './game';
export function createApp(game:Game,origin='http://localhost:3000',production=false){
 const app=express();app.disable('x-powered-by');const limits=new Map<string,{count:number;reset:number}>();
 app.use((req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Cache-Control':'no-store'});(req as any).received=game.clock();next();});
 // Vite is used for local development, but must not serve server content or the database.
 app.use((req,res,next)=>{let path=req.path;try{for(let i=0;i<3;i++)path=decodeURIComponent(path);}catch{res.status(400).json({error:'That address could not be read.'});return;}path=path.replaceAll('\\','/');if(/\/(server|data|migrations|scripts|tests)(\/|$)|\/\.env(?:[./]|$)/i.test(path)){res.status(404).json({error:'This resource is not available. Return to the surface.'});return;}next();});
 app.use('/api',express.json({limit:'8kb'}));
 app.use('/api',(req,res,next)=>{const key=req.socket.remoteAddress??'local';const now=Date.now();const entry=limits.get(key);if(!entry||entry.reset<now)limits.set(key,{count:1,reset:now+60000});else if(++entry.count>300){res.status(429).json({error:'Too many requests. Wait a minute and try again.'});return;}if(limits.size>10000)for(const [k,v] of limits)if(v.reset<now)limits.delete(k);let sid=req.headers.cookie?.match(/(?:^|;\s*)deep_session=([A-Za-z0-9_-]{32})/)?.[1];let session=sid?game.one('SELECT * FROM sessions WHERE id=?',sid):undefined;if(!session){sid=randomBytes(24).toString('base64url');const csrf=randomBytes(24).toString('base64url');game.write('INSERT INTO sessions VALUES(?,?,?)',sid,csrf,now);session={id:sid,csrf};res.cookie('deep_session',sid,{httpOnly:true,secure:production,sameSite:'lax',maxAge:60*86400000,path:'/'});}(req as any).session=session;if(req.method!=='GET'&&req.method!=='HEAD'){const source=req.headers.origin;const token=req.headers['x-csrf-token'];if(source!==origin||typeof token!=='string'||token.length!==session.csrf.length||!timingSafeEqual(Buffer.from(token),Buffer.from(session.csrf))){res.status(403).json({error:'Your session needs refreshing. Reload the page and try again.'});return;}}next();});
 app.get('/api/session',(req,res)=>res.json({csrf:(req as any).session.csrf,content:{prompts:game.bank.length,categories:[...new Set(game.bank.map(p=>p.category))]},serverNow:game.clock()}));
 const session=(req:express.Request)=>(req as any).session.id;
 app.post('/api/runs',(req,res)=>res.json({runId:game.createRun(session(req),req.body??{})}));
 app.get('/api/runs/:id',(req,res)=>res.json(game.state(String(req.params.id),session(req))));
 app.post('/api/runs/:id/next',(req,res)=>res.json(game.begin(String(req.params.id),session(req))));
 app.post('/api/runs/:id/submit',(req,res)=>res.json(game.submit(String(req.params.id),session(req),req.body??{},(req as any).received)));
 app.post('/api/runs/:id/finish',(req,res)=>res.json(game.endEndless(String(req.params.id),session(req))));
 const invite=(cid:string)=>({id:cid,url:`${origin}/challenge/${cid}`});
 app.post('/api/challenges',(req,res)=>res.json(invite(game.createChallenge(session(req),req.body??{}))));
 app.get('/api/challenges/:id',(req,res)=>res.json({...game.summary(String(req.params.id),session(req)),url:`${origin}/challenge/${req.params.id}`}));
 app.post('/api/challenges/:id/claim',(req,res)=>res.json({runId:game.claim(String(req.params.id),session(req),req.body?.nickname)}));
 app.post('/api/challenges/:id/rematch',(req,res)=>res.json(invite(game.rematch(String(req.params.id),session(req),req.body?.nickname))));
 app.post('/api/reports',(req,res)=>{game.report(session(req),req.body??{});res.json({saved:true});});
 app.use('/api',(_req,res)=>res.status(404).json({error:'This action was not found. Return to the surface.'}));
 app.use((err:any,_req:express.Request,res:express.Response,next:express.NextFunction)=>{if(res.headersSent){next(err);return;}const status=err instanceof GameError?err.status:err.type==='entity.too.large'?413:err instanceof SyntaxError?400:503;res.status(status).json({error:status===503?'The dive service could not save or load your progress. Your answer may still be pending; retry to check.':status===413?'That request is too large.':status===400&&!(err instanceof GameError)?'That request could not be read.':err.message});});return app;
}
