import 'node:process';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import express from 'express';
import {openDatabase} from './database';
import {Game} from './game';
import {createApp} from './app';
import {bank} from './content';
import {validateContent} from '../src/shared/core';
if(existsSync('.env'))process.loadEnvFile('.env');
const production=process.argv.includes('--production');const port=Number(process.env.PORT??3000);const publicUrl=new URL(process.env.PUBLIC_ORIGIN||process.env.RENDER_EXTERNAL_URL||`http://localhost:${port}`);const origin=publicUrl.origin;
if(production&&publicUrl.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(publicUrl.hostname))throw new Error('Production requires an HTTPS PUBLIC_ORIGIN');
if(process.env.TEST_FAST_TIMERS==='1'&&production)throw new Error('Accelerated test timers are forbidden in production');
const errors=validateContent(bank);if(errors.length)throw new Error(errors.join('\n'));
const game=new Game(openDatabase(),bank.filter(p=>p.reviewed),Date.now,process.env.TEST_FAST_TIMERS==='1'?50:3000,process.env.TEST_FAST_TIMERS==='1'?3000:25000);
const app=createApp(game,origin,production);
if(production){app.use(express.static(resolve('dist'),{index:false}));app.get('/{*path}',(_req,res)=>res.sendFile(resolve('dist/index.html')));}else{const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true,hmr:{port:port+20000}},appType:'spa'});app.use(vite.middlewares);}
const server=app.listen(port,'0.0.0.0',()=>console.log(`Deep Trivia ready at ${origin}`));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>server.close(()=>{game.db.close();process.exit(0);}));
