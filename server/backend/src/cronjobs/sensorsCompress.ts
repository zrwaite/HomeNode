import axios from "axios";
const sensorsCompress = async () => {
	let allSensors: any = await axios.get('/api/sensors?all=test');
	let sensorsArray = allSensors.data.response.result;
	console.log(sensorsArray);
}

export default sensorsCompress;
