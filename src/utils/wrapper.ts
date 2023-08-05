
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

// wrapper for select and where and limit
const getAllElements = async(SERVER_URL:string, type: String[], select:any[], where:any[], limit?:number): Promise<any> => {
  const query = SERVER_URL + type.join(",")+"/latest?"+(limit ? "limit="+limit : "limit=-1") + (select ? '&select=' + select.join(",") : "") + (where ? "&where=" + where.join(",") : "");
  console.log(query);
  
  const json = await getJson(fetch(query, { method: 'GET' }));
  return json;
}

// get only one element
const getElement = async(SERVER_URL:string, type: String[], select:any[], scode: string, limit?:number): Promise<any> => {

	// forcing where condition
	const where = [
		'scode.eq."'+scode+'"',
	];

  	let json = await getAllElements(SERVER_URL, type, select, where, limit);
  	return json.data[0];
}

const getElementsInInterval = async(SERVER_URL:string, type: String[], select:any[], where:any[], from:string, to: string, limit?:number): Promise<any> => {
	const query = SERVER_URL + from+ "/" + to + "/" + type.join(",")+"/latest?"+(limit ? "limit="+limit : "limit=-1") + (select ? '&select=' + select.join(",") : "") + (where ? "&where=" + where.join(",") : "");
  	console.log(query);
  
  	const json = await getJson(fetch(query, { method: 'GET' }));
  	return json;
}

export {getAllElements, getElement, getElementsInInterval}