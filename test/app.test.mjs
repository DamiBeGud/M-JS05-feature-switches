import {test} from 'node:test';import assert from 'node:assert/strict';import {once} from 'node:events';
import {createApp} from '../dist/app.js';
import {Problem} from '../dist/common.js';
test('HTTP domain behavior, boundaries and conflicts',async()=>{

const runtime=createApp({token:'synthetic-unit-token',});const server=runtime.app.listen(0,'127.0.0.1');
try{await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}`;
const request=(method,path,body,auth=true)=>fetch(base+path,{method,headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer synthetic-unit-token'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
assert.equal((await request('GET','/health/live')).status,200);
assert.equal((await request('POST','/flags/test',{enabled:false},false)).status,401);
assert.equal((await request('POST','/flags/test',{enabled:false})).status,201);
assert.equal((await request('PATCH','/flags/test',{enabled:true,expectedVersion:1})).status,200);
assert.equal((await request('PATCH','/flags/test',{enabled:false,expectedVersion:1})).status,409);
const flag=await (await request('GET','/flags/test',undefined,false)).json();assert.equal(flag.enabled,true);assert.equal(flag.version,2);
assert.equal((await request('POST','/flags/other',{enabled:1})).status,400);
}finally{if(server.listening){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}await runtime.close();}
});
