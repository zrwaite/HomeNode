import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates formmated response
import User from "../models/user"; //Schema for mongodb
import homeCtrl from "../api/home"; //Used for internally referenced home request
import axios from "axios";

interface userGetQuery {
	//Url query interface for get request
	id?: string;
	username?: string;
}
interface userPostBody {
	//Body query interface for post request
	username: string;
	name: string;
	home_id: string;
	settings: object;
}
interface userPutBody {
	//Body query interface for put request
	name?: string;
	settings?: userSettings;
}
interface userSettings {
	dark_mode?: boolean;
	email_notifications?: boolean;
}

const buildGetQuery = (req: any) => {
	//Create the get request
	let exists = false;
	let query: userGetQuery = {};
	if (req.query.id !== undefined) {
		query.id = req.query.id;
		exists = true;
	} else if (req.query.username !== undefined) {
		query.username = req.query.username;
		exists = true;
	}
	return {exists: exists, query: query};
};
const buildPostBody = (req: any) => {
	//Create the post request
	let exists = true;
	let list = [req.body.username, req.body.name, req.body.home_id];
	list.forEach((param) => {
		if (param === undefined) exists = false;
	});
	let body: userPostBody = {
		username: req.body.username,
		name: req.body.name,
		home_id: req.body.home_id,
		settings: {dark_mode: true, email_notifications: true},
	};
	return {exists: exists, body: body};
};
const buildPutBody = (req: any) => {
	//Create the put request for the daily data array
	let putType;
	let queryType;
	let body: userPutBody = {};
	if (req.body.name !== undefined) {
		body.name = req.body.name;
		putType = "name";
	} else if (req.body.settings !== undefined) {
		if (req.body.settings.dark_mode !== undefined) {
			body.settings = {};
			body.settings.dark_mode = true;
			putType = "dark_mode";
		} else if (req.body.settings.email_notifications !== undefined) {
			body.settings = {};
			body.settings.email_notifications = true;
			putType = "email_notifications";
		}
	}
	let id = req.body.id;
	let username = req.body.username;
	let query;
	if (id !== undefined) {
		queryType = "_id";
		query = id;
	} else if (username !== undefined) {
		queryType = "username";
		query = username;
	} else {
		queryType = undefined;
	}
	console.log(queryType);
	return {queryType: queryType, putType: putType, query: query, body: body};
};
/* register controller */
export default class userController {
	static async apiGetUser(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let user;
		let {exists, query} = buildGetQuery(req);
		if (query.id) {
			//Find by id
			try {
				user = await User.findById(query.id);
			} catch (e: any) {
				result.errors.push("Query error", e);
			}
		} else if (exists) {
			//Find by other queries
			try {
				user = await User.find(query);
			} catch (e: any) {
				result.errors.push("Query error", e);
			}
		} else {
			result.errors.push("No queries. Include id or username.");
		}
		result = getResult(user, "user", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostUser(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, body} = buildPostBody(req);
		let newUser;
		if (exists) {
			try {
				newUser = new User(body);
				try {
					await newUser.save(); //Saves branch to mongodb
					const homeData: any = await axios.put("/api/home", {
						id: "61649dca5ff56e9a75f3572b",
						user: "barryhawkener2@gmail.com",
					});
					let homeResult: any = homeData.data;
					if (homeResult) {
						console.log(homeResult);
						result.success = homeResult.success;
						result.errors.push(...homeResult.errors);
						result.status = homeResult.status;
						result.response = {
							userResult: newUser,
							homeResult: homeResult.response,
						};
					} else {
						result.success = false;
						result.errors.push("Error adding user to home");
						result.status = 400;
						result.response = {userResult: newUser};
					}
				} catch (e: any) {
					result.errors.push("Error adding to database", e);
				}
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		} else {
			result.errors.push("Body error. Make sure to include username, name and home_id ");
		}
		res.status(result.status).json(result);
	}
	static async apiPutUser(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {putType, queryType, query, body} = buildPutBody(req);
		let user;
		if (queryType) {
		} else {
			result.errors.push("Body error. Make sure to include id or username");
		}
		switch (putType) {
			case "name":
				try {
					//prettier-ignore
					user = await User.findOneAndUpdate({queryType: query},{ name: body.name },{ new: true }); //Saves branch to mongodb
				} catch (e: any) {
					result.errors.push("Error creating name request", e);
				}
				break;
			case "dark_mode":
				try {
					//prettier-ignore
					user = await User.findOneAndUpdate({queryType: query}, {"settings.dark_mode": body.settings?.dark_mode},{new: true}); //Saves branch to mongodb
				} catch (e: any) {
					result.errors.push("Error creating settings darkMode request", e);
				}
				break;
			case "email_notifications":
				try {
					//prettier-ignore
					user = await User.findOneAndUpdate({queryType: query}, {"settings.email_notifications":body.settings?.email_notifications,},{new: true}); //Saves branch to mongodb
				} catch (e: any) {
					result.errors.push("Error creating settings email notifications request",e);
				}
				break;
			default:
				result.errors.push("Body error. Make sure to include id, and name or settings");
		}
		if (user && result.errors.length === 0) {
			result.status = 201;
			result.response = user;
			result.success = true;
		} else {
			result.status = 404;
			result.success = false;
			result.errors.push("User not found, or trying to add duplicate value, or review other errors");
			result.response = {};
		}
		res.status(result.status).json(result);
	}
}
