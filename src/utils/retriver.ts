// open hub api link
const SERVER_URL = 'https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*/latest?';
const SERVER_URL2 = 'https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/';

import {getAllElements, getElement, getElementsInInterval} from './wrapper'

const CHARGINGSTATION = 'https://mobility.api.opendatahub.com/v2/flat/EChargingPlug';

interface NodeInfo {
  name_en: string;
  capacity: number;
  mvalue: number;
  x: number;
  y: number;
  scode: string;
}

interface NodeTimeInfo {
	mvalue: number;
	mvalidtime: string;
}


// funzione di utility per la gestione di un json
async function getJson(httpResponsePromise: Promise<Response>): Promise<any> {
  try {
    const response = await httpResponsePromise;
    if (response.ok) {
      return response.json();
    } else {
      throw await response.json();
    }
  } catch (err) {
    throw { error: "Impossibile comunicare" };
  }
}

// get list of nodes
const getNodes = async (municipality?: string): Promise<NodeInfo[]> => {
  // attributes to select
 	const attributes = [
    'smetadata.name_en',
    'smetadata.capacity',
    'mvalue',
    'scoordinate',
    //'mvalidtime',
    //'mperiod',
    'scode',
  	];

  	// conditionals
  	const where = [
  	];

  	// needed to filter by municipality
  	if (municipality) {
    	where.push('smetadata.municipality.eq.' + municipality);
  	}

	let result = await getAllElements(SERVER_URL2, ['free'], attributes, where, -1);
    
	result = result.data.map((node: any) => {
		return {
			name_en: node['smetadata.name_en'],
			capacity: node['smetadata.capacity'],
			mvalue: node['mvalue'],
			x: node['scoordinate'].x,
			y: node['scoordinate'].y,
			scode: node['scode'],
		};
	});
	
	return result;
};

// get node info by scode
const getNodeInfo = async (scode: string): Promise<NodeInfo | null> => {
  // attributes to select
  const attributes = [
    'smetadata.name_en',
    'smetadata.capacity',
    'mvalue',
    'scoordinate',
    'mvalidtime',
    'mperiod',
    'scode',
  ];

  // conditionals
  const where = [
    'scode.eq."' + scode + '"',   // is the requested node
  ];

  let node = await getElement(SERVER_URL2, ['free'], attributes, scode, -1);

  if (!node) {
    return null;
  }

  // remapping of attributes
  const result: NodeInfo = {
	name_en: node['smetadata.name_en'],
    capacity: node['smetadata.capacity'],
    mvalue: node['mvalue'],
    x: node['scoordinate'].x,
    y: node['scoordinate'].y,
    scode: node['scode'],
  };

  return result;
};



const getTodayTraffic = async (scode: string): Promise<any> => {

	// attributes to select
	const attributes = [
		'mvalue',
		'mvalidtime',
	];

	//YYYY-MM-DDTHH:mm:ss.sssZ
	const today = new Date();
  	const tomorrow = new Date(today);
  	tomorrow.setDate(today.getDate() + 1);
	  
	//const fromTo = {
	let from = today.toISOString().slice(0, 10);
	let to	 = tomorrow.toISOString().slice(0, 10);
	
	
	// conditionals
	const where = [
		'scode.eq."' + scode + '"',   // is the requested node
	];

	
	let result = await getElementsInInterval(SERVER_URL2, ['free'], attributes, where, from, to, -1);
}


export {
  getNodes,
  getNodeInfo,
  getTodayTraffic,
};
