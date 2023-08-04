const express = require('express');
const app = express();

// open hub api link
const SERVER_URL = 'https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*/latest?';

// funzione di utility per la gestione di un json
function getJson(httpResponsePromise) {
	
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Impossibile effettuare il parsing della risposta" }))

        } else {
          response.json()
            .then(obj => 
              reject(obj)
              )
			.catch(err => reject({ error: "Impossibile effettuare il parsing dei dati" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Impossibile comunicare" })
      ) 
  });
}

// get list of nodes
const getNodes = async(municipality) => {

	// attributes to select
	let attributes = [
		'smetadata.name_en',
		'smetadata.capacity',
		'mvalue',
		'scoordinate',
		'mvalidtime',
		'mperiod',
		'scode',
	];

	// conditionals
	let where = [
		'stype.eq.ParkingStation', 	// is a parking station
		'tname.eq.free',      		// is free	
	];
	
	// needed to filter by municipality
	if (municipality) {
		where.push('smetadata.municipality.eq.'+municipality);
	}
	
	const query = SERVER_URL + 'limit=-1&select='+attributes.join(",")+"&where="+where.join(",");
	console.log(query);
		
	return getJson(fetch(query, { method: 'GET'})).then(json =>{

		return json.data.map((node) => {
			
			// remapping of attributes
			const result = {
				name_en: node['smetadata.name_en'],
				capacity: node['smetadata.capacity'],
				mvalue: node['mvalue'],
				x: node['scoordinate'].x,
				y: node['scoordinate'].y,
				scode: node['scode'],
			}

			return result;
		})	
	});
}

// get node info by scode
const getNodeInfo = async(scode) => {

	// attributes to select
	let attributes = [
		'smetadata.name_en',
		'smetadata.capacity',
		'mvalue',
		'scoordinate',
		'mvalidtime',
		'mperiod',
		'scode',
	];
	
	console.log(scode);

	// conditionals
	let where = [
		'stype.eq.ParkingStation', 	// is a parking station
		'tname.eq.free',      		// is free	
		'scode.eq."'+scode+'"',			// is the requested node
	];
	
	const query = SERVER_URL + 'limit=-1&select='+attributes.join(",")+"&where="+where.join(",");
	console.log(query);
		
	return getJson(fetch(query, { method: 'GET'})).then(json =>{

		return json.data.map((node) => {
			
			// remapping of attributes
			const result = {
				name_en: node['smetadata.name_en'],
				capacity: node['smetadata.capacity'],
				mvalue: node['mvalue'],
				x: node['scoordinate'].x,
				y: node['scoordinate'].y,
				scode: node['scode'],
			}

			return result;
		})[0]	
	});
}



module.exports = {
	getNodes, getNodeInfo
};