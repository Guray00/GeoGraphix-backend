const CHARGINGSTATION = 'https://mobility.api.opendatahub.com/v2/flat,node/EChargingPlug/';

import {getAllElements, getElement, getElementsInInterval} from './wrapper';

interface NodeInfo {
	//name_en: string;
	//capacity: number;
	//mvalue: number;
	x: number;
	y: number;
	scode: string;
	sname: string;
	maxPower: number;
	maxCurrent: number;
	minCurrent: number;
	savailable: boolean;
  }
  
  interface NodeTimeInfo {
	  mvalue: number;
	  mvalidtime: string;
  }
 
  
  // get list of nodes
  const getEcharges = async (): Promise<NodeInfo[]> => {
	// attributes to select
	   const attributes = [
	  'sname',
	  'scode',
	  'scoordinate',
	  'savailable',
	  'smetadata.outlets.maxPower',
	  'smetadata.outlets.maxCurrent',
	  'smetadata.outlets.minCurrent',

		];
  
		// conditionals
		const where:any[] = [
		];
  
	  let result = await getAllElements(CHARGINGSTATION, ['echarging-plug-status'], attributes, [], -1);
	  
	  result = result.data.map((node: any) => {
		  return {
			  //name_en: node['smetadata.name_en'],


			  //capacity: node['smetadata.capacity']
			  //mvalue: node['mvalue'],
			  x: node['scoordinate'].x,
			  y: node['scoordinate'].y,
			  scode: node['scode'],
			  sname: node['sname'],
			  maxPower: node['smetadata.outlets.maxPower'],
			  maxCurrent: node['smetadata.outlets.maxCurrent'],
			  minCurrent: node['smetadata.outlets.minCurrent'],
			  savailable: node['savailable'],
		};
	  });
	  
	  return result;
  };
  
  /*
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
  
	let node = await getElement(CHARGINGSTATION, ['free'], attributes, scode, -1);
  
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
  */

  export {getEcharges};