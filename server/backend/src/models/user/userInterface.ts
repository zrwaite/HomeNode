interface userGetQuery {
	//Url query interface for get request
	id?: string;
	username?: string;
}
interface userPostBody {
	//Body query interface for post request
	username: string;
	name: string;
	hash: string;
	home_id: string;
	settings: object;
	safety_level?: number;
}
interface userPutBody {
	//Body query interface for put request
	name?: string;
	settings?: userSettings;
}
interface userSettings {
	dark_mode?: boolean;
	email_notifications?: boolean;
	safety_level?: boolean;
}

export {userGetQuery, userPostBody, userPutBody, userSettings}