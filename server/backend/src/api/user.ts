import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates formmated response
import User from "../models/user/user"; //Schema for mongodb
import axios from "axios";
import bcrypt from "bcrypt";
import {createToken, verifyToken, getToken} from "../auth/tokenFunctions";

/* Interface imports */
import {userGetQuery, userPostBody, userPutBody, userSettings} from "../models/user/userInterface";

const getUsernameFromId = async (headers: any, user_id: string) => {
	const auth = await verifyToken(headers);
	if (!auth.authorized) return false;
	let getLink = "/api/user?id="+user_id;
	let token = await getToken(headers);
	try{
		const userData: any = await axios.get(getLink,
			{headers: {
				Authorization: "Bearer "+token
			}});
		let username = userData.data.response.result.username;
		return username;
	} catch (e) {
		return false;
	}
}

const compareAuthUsername = async (headers: any, username:string) => {
	const auth = await verifyToken(headers);
	if (!auth.authorized) return false;
	if (username && username == auth.username) return true;
	return false;
}

const buildGetQuery = async (req: any) => {
	//Create the get request
	let queryType = undefined;
	let query: any = {};
	let undefinedParams: string[] = [];
	let auth = await verifyToken(req.headers);
	if (!auth) return {queryType: queryType, query: query, errors: ["Authorization"]};
	switch (req.query.get_type){
		case "all":
			queryType = "all";
			break;
		default:
			if (req.query.id!== undefined){
				query = req.query.id;
				queryType = "id";
			} else if (req.query.username!== undefined){
				query = req.query.username;
				queryType = "username";
			} else {
				undefinedParams.push("id, username");
			}
	}
	return {auth: auth, queryType: queryType, query: query, errors: undefinedParams};
};
const buildPostBody = async (req: any) => {
	//Create the post request
	let exists = false;
	let undefinedParams: string[] = [];
	let body: any = {};
	["username", "name", "home_id", "password"].forEach((param) => {
		if (req.body[param]==undefined) undefinedParams.push(param);
	});
	if (undefinedParams.length == 0) { 
		let hash = bcrypt.hashSync(req.body.password, 10);
		if (hash!=="0"){
			let postBody: userPostBody = {
				username: req.body.username,
				name: req.body.name,
				hash: hash,
				home_id: req.body.home_id,
				settings: {dark_mode: true, email_notifications: true},
			};
			body = postBody;
			exists = true;
		}
	}
	return {exists: exists, body: body, errors: undefinedParams};
};
const buildPutBody = async (req: any) => {
	//Create the put request for the daily data array
	let putType:string|undefined = req.query.put_type;
	let body: any = {};
	let undefinedParams: string[] = [];
	// let body: userPutBody = {}; I removed interfaces for this one
	
	//Create query object 
	let query: any = {};
	let queryType = undefined;
	if (req.body.username!== undefined){
		query = req.body.username;
		queryType = "username";
	} else if (req.body.id!== undefined){
		let username = await getUsernameFromId(req.headers, req.body.id);
		if (username) {
			query = username;
			queryType = "username"
		}
	}  else {
		putType = undefined;
		undefinedParams.push("id, username");
	}

	switch (putType){
		case "name":
			if (req.body.name==undefined) undefinedParams.push("name");
			else body = { name: req.body.name };
			break;
		case "settings.dark_mode": case "settings":
			if (req.body.settings.dark_mode==undefined) undefinedParams.push("settings.dark_mode");
			else body = {"settings.dark_mode": req.body.settings.dark_mode}
			break;
		case "settings.email_notifications": case "email_notifications":
			if (req.body.settings.email_notifications==undefined) undefinedParams.push("settings.email_notifications");
			else body = {"settings.email_notifications":req.body.settings.email_notifications}
			break;
		case "home": case "home_id":
			if (req.body.home_id==undefined) undefinedParams.push("home_id");
			else body = {"home_id": req.body.home_id};
			break;
		default:
			putType = undefined;
			undefinedParams.push("put_type");
	}
	if (undefinedParams.length == 0){
		if (! await compareAuthUsername(req.headers, query)){
			return {queryObj: undefined, putType: undefined, body: body, errors: ["valid username in the token"]}
		}
	} else {
		putType = undefined;
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
		let user: any;
		let {auth, queryType, query, errors} = await buildGetQuery(req);
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
				try {user = await User.findOne({username: query});}
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		if (user && user.username.toString() !== auth.username) {
			result.errors.push("Not authorized too access this user");
			result.response = {};
		}
		result = getResult(user, "user", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostUser(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, body, errors} = await buildPostBody(req);
		let newUser;
		if (exists) {
			try {
				newUser = new User(body);
				await newUser.save(); //Saves branch to mongodb
				let token = await createToken({home_id: body.home_id, username: body.username, authorized: true});
				try{
					const homeData: any = await axios.put("/api/home?put_type=user", {
						id: body.home_id,
						user: body.username
					},
					{headers: {
						Authorization: "Bearer "+token
					}});
					let homeResult: any = homeData.data;
					if (homeResult) {
						result.success = homeResult.success;
						result.errors.push(...homeResult.errors);
						result.status = homeResult.status;
						result.response = {
							token: token,
							userResult: newUser,
							homeResult: homeResult.response,
						};
					} else {
						result.success = false;
						result.errors.push("Error adding user to home");
						result.status = 400;
						result.response = {userResult: newUser};
					}				
				} catch (e) {
					result.errors.push("Error adding to home");
					console.log(e);
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
		let {putType, queryObj, body, errors} = await buildPutBody(req);
		let user;
		if (putType){
			try {
				//prettier-ignore
				user = await User.findOneAndUpdate(queryObj,body,{ new: true }); //Saves branch to mongodb 
				result.status = 201;
				result.response = user;
				result.success = true;
			}
			catch (e: any) {
				result.errors.push("User not found, or trying to add duplicate value, or review other errors", e);
				result.status = 404;
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
}
