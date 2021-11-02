interface sensorsGetQuery {
	//Url query interface for get request
	id?: string;
	home_id?: string;
}
interface sensorsPostBody {
	//Body query interface for post request
	name: string;
	home_id: string;
	current_data: object;
	daily_data: object[];
	past_data: object[];
}
interface sensorsPutBody {
	//Body query interface for put request
	temperature?: number;
	humidity?: number;
	light_level?: number;
}
export {sensorsGetQuery, sensorsPostBody, sensorsPutBody}