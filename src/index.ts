import express, { Application, Request, Response } from 'express';

import {getNodes, getNodeInfo, getTodayTraffic} from './utils/retriver'
import {getEcharges} from './utils/echarge';
//import {prisma} from './utils/prisma'

const app:Application 	= express();
const port:number		= 3001;
const host:string	 	= "/api"

// attivazione del server
app.listen(port, () => {
	console.log(`Server in ascolto su http://localhost:${port}`);
});
  
// necessario per le richieste POST
app.use(express.json());

app.get("/", async(req: Request, res: Response) => {
	//console.log(await prisma.user.findMany(({select: {id: true, name: true}})));
	res.send("Hello World!");
});

// retrive the total informations of nodes

app.get(host+'/city/parkings', async (req, res) => {
	
	// retriving the requested municipality
	const municipality:string = req.query.municipality! as string;
	
	
	// retrive of data
	const nodes = await getNodes(municipality);
	
	// send data
	res.send(nodes);
});

// get the informations of a single node
app.get(host+'/parking', async (req, res) => {
	
	//api?scode=105
	const scode:string = req.query.scode! as string;

	// retrive of data
	const nodes = await getNodeInfo(scode.trim());
	
	// send data
	res.send(nodes);
});

// 
app.get(host+'/parking/chart/dayly/cars', async (req, res) => {
	
	const scode:string = req.query.scode! as string;

	// retrive of data
	const nodes = await getTodayTraffic(scode.trim());
	
	// send data
	res.send(nodes);
});

// ====


app.get(host+'/echarges', async (req, res) => {
	
	// retrive of data
	const nodes = await getEcharges();
	
	// send data
	res.send(nodes);
});