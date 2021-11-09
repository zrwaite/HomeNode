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
interface sensorsDailyPutBody {
	//Body query interface for put request
	temperature?: number;
	humidity?: number;
	light_level?: number;
	moisture?: number;
}
interface sensorsPastPutBody {
	date: Date;
	average_temperature: number;
	average_humidity: number;
	average_light_level: number;
	average_moisture: number;
}

interface sensorsDeleteBody {
	//Body query interface for put request
	temperature: number;
	humidity: number;
	light_level: number;
	moisture: number;
}

export {sensorsGetQuery, sensorsPostBody, sensorsPastPutBody, sensorsDailyPutBody, sensorsDeleteBody}