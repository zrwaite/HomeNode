import axios from "axios";
import {getToken} from "../auth/tokenFunctions"

const putPastData = async (id: string, average_temperature: number, average_humidity: number, average_light_level: number, home_id: string) => {
	let token:string = await getToken({home_id: home_id, authorized: false})	
	let date = new Date().toLocaleDateString().toString();
	try {
		const pastData: any = await axios.put("/api/sensors?put_type=past_data",{
			id: id,
			date: date,
			average_temperature: average_temperature,
			average_humidity: average_humidity,
			average_light_level: average_light_level
		},{headers: {
			Authorization: "Bearer "+token
		}});
		let result: any = pastData.data;
		if (result) return;
		else console.log("Error putting past data");
	} catch (e:any) {
		console.log("Error putting past data", e.response.data)
	}
}
const deleteDailyData = async (id: string, temperature: number, humidity: number, light_level: number, home_id: string) => {
	let token:string = await getToken({home_id: home_id, authorized: false})	
	try{
		const deleteData: any = await axios.delete("/api/sensors?delete_type=daily_data",{ 
			data: {
				id: id,
				temperature: temperature,
				humidity: humidity,
				light_level: light_level
			}, headers: {
				Authorization: "Bearer "+token
			}
		});
		let result: any = deleteData.data;
		if (result) return;
		else console.log("Error deleting daily data");
	} catch(e:any){
		console.log("Delete error:");
		console.log(e)
	}
}
const sensorsCompress = async () => {
	try{
		let allSensors:any = await axios.get('/api/sensors?get_type=all');
		let sensorsArray:[any] = allSensors.data.response.result;
		sensorsArray.forEach(module =>{
			let id: string = module._id;
			let dailyData: [any] = module.daily_data;
			let currentData: any = module.current_data;
			let home_id: string = module.home_id;
			let total_temperature = 0;
			let total_humidity = 0;
			let total_light_level = 0;
			let num_temperatures = 0;
			let num_humidities = 0;
			let num_light_levels = 0;
			dailyData.forEach(data =>{
				if (data.temperature) {
					total_temperature += data.temperature;
					num_temperatures ++;
				}
				if (data.humidity) {
					total_humidity += data.humidity;
					num_humidities ++;
				}
				if (data.light_level){
					total_light_level += data.light_level;
					num_light_levels ++;
				}
			});
			let average_light_level = Math.round(total_light_level/num_light_levels);
			let average_humidity = Math.round(total_humidity/num_humidities);
			let average_temperature = Math.round(total_temperature/num_temperatures);

			let success = true;
			["light_level", "humidity", "moisture", "temperature"].forEach(param=>{
				if (currentData[param]==undefined) success = false;
			});
			if (success){
				putPastData(id, average_temperature, average_humidity, average_light_level, home_id);
				deleteDailyData(id, currentData.temperature, currentData.humidity, currentData.light_level, home_id);
			}
			else {
				console.log("Missing current data");
				console.log(currentData);
			}
		});
	} catch (e :any){
		console.log("Error getting sensors data");
		console.log(e)
	}
}

export default sensorsCompress;
