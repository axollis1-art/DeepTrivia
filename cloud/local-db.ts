import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import type {Database,Statement} from './game';
class LocalStatement implements Statement {
  values:unknown[]=[];
  constructor(public db:DatabaseSync,public sql:string){}
  bind(...values:unknown[]){const statement=new LocalStatement(this.db,this.sql);statement.values=values;return statement;}
  async first<T>(){return this.db.prepare(this.sql).get(...this.values as any[]) as T??null;}
  async all<T>(){return {results:this.db.prepare(this.sql).all(...this.values as any[]) as T[]};}
  runSync(){return {meta:{changes:Number(this.db.prepare(this.sql).run(...this.values as any[]).changes)}};}
  async run(){return this.runSync();}
}
export class LocalDatabase implements Database {
  db:DatabaseSync;
  constructor(path=':memory:'){if(path!==':memory:')mkdirSync(dirname(path),{recursive:true});this.db=new DatabaseSync(path);this.db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS local_cloud_migrations(name TEXT PRIMARY KEY);');for(const file of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql'))){if(this.db.prepare('SELECT name FROM local_cloud_migrations WHERE name=?').get(file))continue;this.db.exec(readFileSync(new URL(`../drizzle/${file}`,import.meta.url),'utf8'));this.db.prepare('INSERT INTO local_cloud_migrations VALUES(?)').run(file);}}
  prepare(sql:string){return new LocalStatement(this.db,sql);}
  async batch(statements:Statement[]){this.db.exec('BEGIN IMMEDIATE');try{const results=statements.map(statement=>(statement as LocalStatement).runSync());this.db.exec('COMMIT');return results;}catch(error){this.db.exec('ROLLBACK');throw error;}}
}
