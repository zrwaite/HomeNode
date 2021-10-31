import axios from "axios";
const intruderCompress = async () => {
	let allIntruders:any = await axios.get('/api/intruders?all=test');
	let intrudersArray:[any] = allIntruders.data.response.result;
	intrudersArray.forEach(module =>{
		let dailyData: [any] = module.daily_data;
		let maxAlertLevel = 0;
		let intrusionDetections = false;
		dailyData.forEach(data =>{
			if (data.max_alert_level>maxAlertLevel){
				maxAlertLevel = data.max_alert_level;
			}
			if (data.alert_level > 7){
				intrusionDetections = true;
			}
		});
		//Put past_data
		//Delete daily_data
		//Use current_data as first new request the next day
	});
	console.log(intrudersArray);
}

export default intruderCompress;
