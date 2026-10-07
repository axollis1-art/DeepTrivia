import {openDatabase} from '../server/database';
import {Game} from '../server/game';
import {bank} from '../server/content';
if(process.argv.includes('--help')){console.log('DATABASE_PATH selects the SQLite file; migrations and content seeding are idempotent.');}else{const db=openDatabase();new Game(db,bank);db.close();console.log('Schema migrated and immutable content version seeded.');}
