import axios from "axios";
import {getToken} from "../auth/tokenFunctions"

const putPastData = async (id: string, intrusion_detections: boolean, max_alert_level: number, home_id: string) => {
	let token:string = await getToken({home_id: home_id, authorized: false})	
	let date = new Date().toLocaleDateString().toString();
	try {
		const pastData: any = await axios.put("/api/intruders?put_type=past_data",{
			id: id,
			date: date,
			intrusion_detections: intrusion_detections,
			max_alert_level: max_alert_level
		},{headers: {
				Authorization: "Bearer "+token
		}});
		let result: any = pastData.data;
		if (result) return;
		else console.log("Error putting past data");
	} catch (e:any) {
		console.log("Error putting past data", e)
	}
}
const deleteDailyData = async (id: string, detection: string, alert_level: number, home_id: string) => {
	let token:string = await getToken({home_id: home_id, authorized: false})	
	try{
		const deleteData: any = await axios.delete("/api/intruders?delete_type=daily_data",{ 
			data: {
				id: id,
				detection: detection,
				alert_level: alert_level
			},
			headers: {
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
const intruderCompress = async () => {
	try{
		let allIntruders:any = await axios.get('/api/intruders?get_type=all');
		let intrudersArray:[any] = allIntruders.data.response.result;
		intrudersArray.forEach(module =>{
			let id: string = module._id;
			let dailyData: [any] = module.daily_data;
			let currentData: any = module.current_data;
			let home_id: string = module.home_id;
			let maxAlertLevel = 0;
			let intrusionDetections = false;
			dailyData.forEach(data =>{
				if (data.max_alert_level>maxAlertLevel) maxAlertLevel = data.max_alert_level;
				if (data.alert_level > 7) intrusionDetections = true;
			});
	
			let success: boolean = true;
			[maxAlertLevel, intrusionDetections].forEach(param=>{
				if (param===undefined) success = false;
			})
			if (success) {
				putPastData(id, intrusionDetections, maxAlertLevel, home_id);
			}
			else console.log("Error putting past data");
	
			success = true;
			["detection", "alert_level"].forEach(param=>{
				if (currentData[param]==undefined) success = false;
			});
			if (success) deleteDailyData(id, currentData.detection, currentData.alert_level, home_id);
			else {
				console.log("Missing current data");
				console.log(currentData);
			}
		});
	} catch (e :any){
		console.log("Error getting intruder data");
		console.log(e)
	}
}

export default intruderCompress;
