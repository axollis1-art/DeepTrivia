import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
export function openDatabase(path=process.env.DATABASE_PATH??'./data/deep-trivia.sqlite') {if(path!==':memory:')mkdirSync(dirname(resolve(path)),{recursive:true});const db=new DatabaseSync(path);db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');db.exec(readFileSync(new URL('../migrations/001.sql',import.meta.url),'utf8'));return db;}
export function transaction<T>(db:DatabaseSync,fn:()=>T):T{db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
