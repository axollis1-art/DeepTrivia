import {api,type Env} from './api';
import indexHtml from '../dist/client/index.html';
export default {async fetch(request:Request,env:Env){const url=new URL(request.url);if(url.pathname.startsWith('/api/'))return api(request,env);if(!url.pathname.split('/').at(-1)?.includes('.'))return new Response(indexHtml,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}});if(env.ASSETS)return env.ASSETS.fetch(request);return new Response('Not found',{status:404});}};
