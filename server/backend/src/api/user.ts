import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates formmated response
import User from "../models/user/user"; //Schema for mongodb
import homeCtrl from "../api/home"; //Used for internally referenced home request
import axios from "axios";

/* Interface imports */
import {userGetQuery, userPostBody, userPutBody, userSettings} from "../models/user/userInterface";


const buildGetQuery = (req: any) => {
	//Create the get request
	let queryType = undefined;
	let query: any = {};
	let undefinedParams: string[] = [];
	switch (req.query.get_type){
		case "all":
			queryType = "all";
			break;
		default:
			if (req.query.id!== undefined){
				query = req.query.id;
				queryType = "id";
			} else if (req.username!== undefined){
				query = req.query.username;
				queryType = "username";
			} else {
				undefinedParams.push("id, username");
			}
			let iDQuery: userGetQuery = {};
			query = iDQuery;
	}
	return {queryType: queryType, query: query, errors: undefinedParams};
};
const buildPostBody = (req: any) => {
	//Create the post request
	let exists = false;
	let undefinedParams: string[] = [];
	let body: any = {};
	["username", "name", "home_id"].forEach((param) => {
		if (req.body[param]==undefined) undefinedParams.push(param);
	});
	if (undefinedParams.length == 0) { 
		let postBody: userPostBody = {
			username: req.body.username,
			name: req.body.name,
			home_id: req.body.home_id,
			settings: {dark_mode: true, email_notifications: true},
		};
		body = postBody;
		exists = true;
	}
	return {exists: exists, body: body, errors: undefinedParams};
};
const buildPutBody = (req: any) => {
	//Create the put request for the daily data array
	let putType = undefined;
	let body: any = {};
	let undefinedParams: string[] = [];
	// let body: userPutBody = {}; I removed interfaces for this one
	let param = req.query.put_type;
	if (req.body[param]==undefined) undefinedParams.push(param);
	else {
		putType = param;
		body = req.body[param];
	}
	//Create query object
	let query: any = {};
	let queryType = undefined;
	if (req.query.id!== undefined){
		query = req.query.id;
		queryType = "_id";
	} else if (req.username!== undefined){
		query = req.query.username;
		queryType = "username";
	} else {
		undefinedParams.push("id, username");
	}
	let queryObj:any = {};
	if (queryType) queryObj[queryType] = query;
	else queryObj = undefined;

	return {queryObj: queryObj, putType: putType, body: body, errors: undefinedParams};
};
/* register controller */
export default class userController {
	static async apiGetUser(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let user;
		let {queryType, query, errors} = buildGetQuery(req);
		switch (queryType){
			case "all":
				try{user = await User.find();} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "id":
				try {user = await User.findById(query);} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "username":
				try {user = await User.find(query);}
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		result = getResult(user, "user", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostUser(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, body, errors} = buildPostBody(req);
		let newUser;
		if (exists) {
			try {
				newUser = new User(body);
				await newUser.save(); //Saves branch to mongodb
				const homeData: any = await axios.put("/api/home", {
					id: body.home_id,
					user: body.username
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
				result.errors.push("Error creating request", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
	static async apiPutUser(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {putType, queryObj, body, errors} = buildPutBody(req);
		let user;
		let updateData: any = {};

		if (!queryObj) result.errors.push("Body error. Make sure to include id or username");
		else {
			switch (putType) {
				case "name":
					updateData = { name: body.name };
					break;
				case "dark_mode":
					updateData = {"settings.dark_mode": body.settings?.dark_mode};
					break;
				case "email_notifications":
					updateData = {"settings.email_notifications":body.settings?.email_notifications};
					break;
				default:
					errors.forEach((error)=>result.errors.push("Missing "+error));
					putType = undefined;
			}
		}

		if (putType){
			try {
				//prettier-ignore
				user = await User.findOneAndUpdate(queryObj,updateData,{ new: true }); //Saves branch to mongodb 
				result.status = 201;
				result.response = user;
				result.success = true;
			}
			catch (e: any) {
				result.errors.push("User not found, or trying to add duplicate value, or review other errors", e);
				result.status = 404;
			}
		}
		res.status(result.status).json(result);
	}
}
