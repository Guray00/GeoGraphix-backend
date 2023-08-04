import express from 'express';
import {getNodes, getNodeInfo} from './utils/retriver'
import {prisma} from './utils/prisma'

const app = express();
const port 	= 3001;
const host 	= "/api"

// attivazione del server
app.listen(port, () => {
	console.log(`Server in ascolto su http://localhost:${port}`);
});
  
// necessario per le richieste POST
app.use(express.json());

app.get("/", (req, res) => {
	console.log(prisma.user.findMany(({select: {id: true, name: true}})));
	res.send("Hello World!");
});

// retrive the total informations of nodes
app.get(host+'/getNodes', async (req, res) => {
	
	// retriving the requested municipality
	const municipality:string = req.query.municipality! as string;
	
	
	// retrive of data
	const nodes = await getNodes(municipality);
	
	// send data
	res.send(nodes);
});

// get the informations of a single node
app.get(host+'/getNodeInfo', async (req, res) => {
	

	//api?scode=105
	const scode:string = req.query.scode! as string;
	//const   = req.query.scode!.trim();
	

	// retrive of data
	const nodes = await getNodeInfo(scode.trim());
	
	// send data
	res.send(nodes);
});
