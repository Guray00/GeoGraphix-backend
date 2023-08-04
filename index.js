express = require('express');
const retrive = require('./retriver.js');

const app = express();
const port 	= 3001;
const host 	= "/api"

// attivazione del server
app.listen(port, () => {
	console.log(`Server in ascolto su http://localhost:${port}`);
});
  
// necessario per le richieste POST
app.use(express.json());

// retrive the total informations of nodes
app.get(host+'/getNodes', async (req, res) => {
	
	// retriving the requested municipality
	const municipality = req.query.municipality;
	
	
	// retrive of data
	const nodes = await retrive.getNodes(municipality);
	
	// send data
	res.send(nodes);
});
