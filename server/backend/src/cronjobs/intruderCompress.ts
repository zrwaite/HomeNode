import axios from "axios";
const putPastData = async (intrusion_detections: boolean, max_alert_level: number) => {
	let date = new Date().toLocaleDateString().toString();
	const pastData: any = await axios.put("/api/intruders?put_type=past_data",{
		date: date,
		intrusion_detections: intrusion_detections,
		max_alert_level: max_alert_level
	});
	let result: any = pastData.data;
	if (result) return;
	else console.log("Error putting past data");
}
const deleteDailyData = async (detection: string, alert_level: number) => {
	const deleteData: any = await axios.put("/api/intruders?delete_type=daily_data",{
		detection: detection,
		alert_level: alert_level
	});
	let result: any = deleteData.data;
	if (result) return;
	else console.log("Error deleting daily data");
}
const intruderCompress = async () => {
	let allIntruders:any = await axios.get('/api/intruders?get_type=all');
	let intrudersArray:[any] = allIntruders.data.response.result;
	intrudersArray.forEach(module =>{
		let dailyData: [any] = module.daily_data;
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
		if (success) putPastData(intrusionDetections, maxAlertLevel);
		else console.log("Error putting past data");

		let recentData = dailyData[dailyData.length-1];
		success = false;
		["detection", "alert_level"].forEach(param=>{
			if (recentData[param]==undefined) success = false;
		});
		if (success) deleteDailyData(recentData.detection, recentData.alert_level);
		else console.log("Error deleting daily data");
	});
}

export default intruderCompress;
