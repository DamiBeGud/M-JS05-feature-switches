import express from 'express';
import { Switches } from './domain.js';
import { authorized,wrap,errors } from './common.js';

export function createApp(options: any={}) {
 const app=express();app.use(express.json({limit:'16kb'}));
 const repository=undefined;const service=new Switches();
 app.get('/health/live',(_req,res)=>res.json({status:'ok'}));
 app.get('/health/live',wrap(async(_req,res)=>{res.json({status:'ready'});}));
 app.get('/flags/:name',wrap((req,res)=>res.json(service.get(req.params.name))));
app.use((req,_res,next)=>{try{authorized(req.headers.authorization,options.token);next();}catch(e){next(e);}});
app.post('/flags/:name',wrap((req,res)=>res.status(201).json(service.create(req.params.name,req.body))));
app.patch('/flags/:name',wrap((req,res)=>res.json(service.update(req.params.name,req.body))));
 app.use(errors);return {app,close:()=>repository?.close()??Promise.resolve()};
}
