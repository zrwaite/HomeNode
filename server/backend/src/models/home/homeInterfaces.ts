interface homeGetQuery {
	//Url query interface for get request
	id?: string;
	username?: string;
}
interface homePostBody {
	//Body query interface for post request
	name: string;
	hash: string;
	user: string[];
	modules: object[];
	settings: object;
	notifications: object[];
}
interface homePutBody {
	//Body query interface for put request
	user?: string;
	settings?: homeSettings;
	module?: homeModule;
	notification?: object;
}
interface homeSettings {
	intrusion_detection?: boolean;
}
interface homeModule {
	type: string;
	module_id: string;
}
export {homeGetQuery, homePostBody, homePutBody, homeSettings, homeModule};