import {createApp} from './app.js';
const port=Number(process.env.PORT??'3205');
if(!Number.isInteger(port)||port<1||port>65535) throw new Error('invalid_PORT');
if(!process.env.API_TOKEN) throw new Error("API_TOKEN_required");
const runtime=createApp({token:process.env.API_TOKEN});
const server=runtime.app.listen(port,'0.0.0.0');
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>server.close(()=>runtime.close().then(()=>process.exit(0))));
