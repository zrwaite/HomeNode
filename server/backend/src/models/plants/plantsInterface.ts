/* Interfaces */
interface plantsPostBody {
	//Body query interface for post request
	name: string;
	home_id: string;
	current_data: object;
	daily_data: object[];
	past_data: object[];
}
interface plantsDailyPutBody {
	//Body query interface for put request
	moisture?: number;
	light_level?: number;
	num_waters?: number;
	light_on?: boolean;
}
interface plantsPastPutBody {
	date: Date;
	average_moisture: number;
	average_light_level: number;
	num_waters: number;
}

interface plantsDeleteBody {
	//Body query interface for delete request
	moisture: number;
	light_level: number;
	num_waters: number;
	light_on: boolean;
}
export {plantsPostBody, plantsDailyPutBody, plantsPastPutBody, plantsDeleteBody};