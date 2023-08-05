import express from 'express';

const app = express();

// open hub api link
const SERVER_URL = 'https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*/latest?';

const CHARGINGSTATION = 'https://mobility.api.opendatahub.com/v2/flat/EChargingPlug';

interface NodeInfo {
  name_en: string;
  capacity: number;
  mvalue: number;
  x: number;
  y: number;
  scode: string;
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
    'mvalidtime',
    'mperiod',
    'scode',
  ];

  // conditionals
  const where = [
    'stype.eq.ParkingStation',   // is a parking station
    'tname.eq.free',             // is free	
  ];

  // needed to filter by municipality
  if (municipality) {
    where.push('smetadata.municipality.eq.' + municipality);
  }

  const query = SERVER_URL + 'limit=-1&select=' + attributes.join(",") + "&where=" + where.join(",");
  console.log(query);

  const json = await getJson(fetch(query, { method: 'GET' }));

  return json.data.map((node: any) => {
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
  });
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
    'stype.eq.ParkingStation',   // is a parking station
    'tname.eq.free',             // is free	
    'scode.eq."' + scode + '"',   // is the requested node
  ];

  const query = SERVER_URL + 'limit=-1&select=' + attributes.join(",") + "&where=" + where.join(",");
  console.log(query);

  const json = await getJson(fetch(query, { method: 'GET' }));

  const node = json.data[0];

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

export {
  getNodes,
  getNodeInfo
};
