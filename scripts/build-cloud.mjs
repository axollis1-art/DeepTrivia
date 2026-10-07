import {build} from 'esbuild';
import {mkdir,cp,readdir} from 'node:fs/promises';
await mkdir('dist/client',{recursive:true});
for(const name of await readdir('dist'))if(!['client','server','.openai'].includes(name))await cp(`dist/${name}`,`dist/client/${name}`,{recursive:true});
await mkdir('dist/server',{recursive:true});
await build({entryPoints:['cloud/worker.ts'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,loader:{'.html':'text'}});
await mkdir('dist/.openai',{recursive:true});
await cp('.openai/hosting.json','dist/.openai/hosting.json');
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
