/* Interfaces */
interface intrudersGetQuery {
	//Url query interface for get request
	id?: string;
	home_id?: string;
}
interface intrudersPostBody {
	//Body query interface for post request
	name: string;
	home_id: string;
	current_data: object;
	daily_data: object[];
	past_data: object[];
}
interface intrudersDailyPutBody {
	//Body query interface for put request
	detection?: string;
	alert_level?: number;
}
interface intrudersPastPutBody {
	date: Date;
	intrusion_detections: boolean;
	max_alert_level: number;
}
interface intrudersDeleteBody {
	//Body query interface for delete request
	detection?: string;
	alert_level?: number;
}
export {intrudersGetQuery, intrudersPostBody, intrudersDailyPutBody, intrudersPastPutBody, intrudersDeleteBody};