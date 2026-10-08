const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('assets/studio.js','utf8');
const part=source.slice(source.indexOf('async function githubFile('),source.indexOf("$('#connect').onclick="));
async function run(){let calls=[],responses=[];const context={token:'test-session-token',TextEncoder,TextDecoder,Uint8Array,Buffer,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),fetch:async(url,options)=>{calls.push({url,options});return responses.shift();}};vm.createContext(context);vm.runInContext(part+'\nglobalThis.client={request,githubFile,encode,decode};',context);const c=context.client;
 const text='A place to grow. Ⲑⲱⲕ · العربية';assert.equal(c.decode(c.encode(text)),text);
 responses=[{ok:false,status:401,json:async()=>({message:'Bad credentials'})}];await assert.rejects(c.request('repos/test/site'),/not accepted/);
 responses=[{ok:false,status:403,json:async()=>({})}];await assert.rejects(c.request('repos/test/site'),/denied access/);
 responses=[{ok:false,status:409,json:async()=>({})}];await assert.rejects(c.request('repos/test/site'),/changed/);
 responses=[{ok:true,status:200,json:async()=>({sha:'abc',content:''})},{ok:true,status:200,json:async()=>({content:c.encode(text)})}];const file=await c.githubFile({repo:'test/site',branch:'main'});assert.equal(c.decode(file.content),text);assert.match(calls.at(-1).url,/git\/blobs\/abc$/);
 responses=[{ok:true,status:201,json:async()=>({content:{sha:'next'}})}];await c.request('repos/test/site/contents/site-settings.json',{method:'PUT',body:JSON.stringify({sha:'abc',content:c.encode(text),branch:'main'})});assert.equal(calls.at(-1).options.method,'PUT');assert.equal(JSON.parse(calls.at(-1).options.body).sha,'abc');assert.equal(calls.at(-1).options.headers.Authorization,'Bearer test-session-token');
 console.log('Studio checks passed: Unicode, access failures, conflicts, large backups, revision write.');}
run().catch(error=>{console.error(error);process.exitCode=1;});
