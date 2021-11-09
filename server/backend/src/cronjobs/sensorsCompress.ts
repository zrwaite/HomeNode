import axios from "axios";
const sensorsCompress = async () => {
	try{
		let allSensors: any = await axios.get('http://localhost/api/sensors?get_type=all', { timeout: 5000 });
		let sensorsArray = allSensors.data;
		console.log(sensorsArray);
	} catch (e:any) {
		console.log(e)
	}
}

export default sensorsCompress;
