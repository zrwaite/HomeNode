import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates formatted response
import Intruders from "../models/intruders/intruders"; //Schema for mongodb
import axios from "axios";
import {verifyToken, getToken} from "../auth/tokenFunctions";


/* Import interfaces */
import {intrudersGetQuery, intrudersPostBody, intrudersDailyPutBody, intrudersPastPutBody, intrudersDeleteBody} from "../models/intruders/intudersInterface";

const compareAuthHomeId = async (headers: any, module_id:string) => {
	const auth = await verifyToken(headers);
	if (!auth.authorized) return false;
	let getLink = "/api/intruders?id="+module_id;
	let token = await getToken(headers);
	if (token) {
		try{
			const intruderData: any = await axios.get(getLink,
				{headers: {
					Authorization: "Bearer "+token
				}});
			let home_id = intruderData.data.response.result.home_id;
			if (home_id == auth.home_id) return true;
		} catch (e) {
			return false;
		}
	}
	return false;
}

/* Build Functions */

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
			} else {
				undefinedParams.push("id");
			}
	}
	return {auth: auth, queryType: queryType, query: query, errors: undefinedParams};
};
const buildPostBody = async (req: any) => {
	//Create the post request
	let exists = false;
	let undefinedParams: string[] = [];
	let body: any = {}; 
	["name", "home_id", "current_data"].forEach((param) => {
		if (req.body[param]==undefined) undefinedParams.push(param);
	});
	let auth = await verifyToken(req.headers);
	if (!auth) return {token: "", exists: exists, body: body, errors: ["valid token"]};
	let token = await getToken(req.headers);
	if (!token) undefinedParams.push("token");
	if (undefinedParams.length == 0) { 
		let postBody: intrudersPostBody = {
			name: req.body.name,
			home_id: req.body.home_id,
			current_data: req.body.current_data,
			daily_data: [],
			past_data: [],
		};
		body = postBody;
		exists = true;
	}
	return {token: token, exists: exists, body: body, errors: undefinedParams};
};
const buildPutBody = async (req: any) => {
	//Create the put request for the daily data array
	let putType: string|undefined = req.query.put_type;
	let id = req.body.id;
	let body: any = {};
	let undefinedParams: string[] = [];
	if (id === undefined) undefinedParams.push("id");
	switch (putType) {
		case "past_data":
			["date", "intrusion_detections", "max_alert_level"].forEach((param) => {
				if (req.body[param]==undefined) undefinedParams.push(param);
			});
			if (undefinedParams.length == 0) { 
				let pastBody: intrudersPastPutBody = {
					date: req.body.date,
					intrusion_detections: req.body.intrusion_detections,
					max_alert_level: req.body.max_alert_level,
				};
				body = {$push: {past_data: pastBody}};
			} else {
				putType = undefined;
			}
			break;
		case "daily_data":
			["detection", "alert_level"].forEach((param) => {
				if (req.body[param]==undefined) undefinedParams.push(param);
			});
			if (undefinedParams.length == 0) { 
				let dailyBody: intrudersDailyPutBody = {
					detection: req.body.detection,
					alert_level: req.body.alert_level
				};
				body = {$push: {daily_data: dailyBody}, current_data: dailyBody};
			} else {
				putType = undefined;
			}
			break;
		default:
			undefinedParams.push("put_type");
			break;
	}
	if (undefinedParams.length == 0 && ! await compareAuthHomeId(req.headers, id)){
		return {putType: undefined, id: id, body: body, errors: ["valid home_id in the token"]};
	}
	if (id === undefined) putType = undefined;
	return {putType: putType, id: id, body: body, errors: undefinedParams};
};

const buildDeleteBody = async (req: any) =>{
	let deleteType = undefined;
	let id = req.body.id;
	let body: any = {};
	let undefinedParams: string[] = [];
	let auth = await verifyToken(req.headers);
	if (!auth) return {deleteType: undefined, id: id, body: body, errors: ["authorization"]};
	switch (req.query.delete_type){
		case "daily_data":
			["detection", "alert_level"].forEach((param) => {
				if (req.body[param]==undefined) undefinedParams.push(param);
			});
			if (undefinedParams.length == 0) { 
				let deleteBody: intrudersDeleteBody = {
					detection: req.body.detection,
					alert_level: req.body.alert_level,
				};
				deleteType = "daily_data";
				body = deleteBody;
			} else {
				deleteType= undefined;
			}
			break;
		case "intruders":
			deleteType = "intruders";
			break;
		default:
			undefinedParams.push("delete_type");
			break;
	}
	if (id === undefined) {
		deleteType = undefined;
		undefinedParams.push("id");
	} else if (! await compareAuthHomeId(req.headers, id)){
		deleteType = undefined;
		undefinedParams.push("Valid home_id in token");
	}
	return {deleteType: deleteType, id: id, body: body, errors: undefinedParams};
}
/* register controller */
export default class intrudersController {
	static async apiGetIntruders(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let {auth, queryType, query, errors} = await buildGetQuery(req);
		let intruders:any;
		switch (queryType){
			case "all":
				try{intruders = await Intruders.find();} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "id":
				try {intruders = await Intruders.findById(query);} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "home_id":
				try {intruders = await Intruders.findOne(query);}
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		if (queryType !== "all" && intruders && intruders.home_id.toString() !== auth.home_id) {
			result.errors.push("Not authorized too access these sensors");
			result.response = {};
		}
		result = getResult(intruders, "intruders", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostIntruders(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {token, exists, body, errors} = await buildPostBody(req);
		let newIntruders;
		if (exists) {
			try {
				newIntruders = new Intruders(body);
				await newIntruders.save(); //Saves branch to mongodb
				let putBody = {
					id: body.home_id,
					module : {
						type: 'intruders',
						module_id: newIntruders._id.toString()
					}
				}
				try{
					const homeData: any = await axios.put("/api/home?put_type=module", putBody, 
					{headers: {
						Authorization: "Bearer "+token
					}});
					let homeResult: any = homeData.data;
					if (homeResult) {
						result.success = homeResult.success;
						result.errors.push(...homeResult.errors);
						result.status = homeResult.status;
						result.response = {
							intruderResult: newIntruders,
							homeResult: homeResult.response,
						};
					} else {
						result.errors.push("Error adding user to home");
						result.response = {intruderResult: newIntruders};
					}
				} catch (e: any){
					result.errors.push("Error adding to home", e);
				}
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
	static async apiPutIntruders(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {putType, id, body, errors} = await buildPutBody(req);
		let intruders;
		if (putType) {
			try {
				//prettier-ignore
				intruders = await Intruders.findByIdAndUpdate(id, body, {new:true}); //Saves branch to mongodb
				result.status = 201;
				result.response = intruders;
				result.success = true;
			} catch (e: any) {
				result.status = 404;
				result.errors.push("Error creating request", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("Missing "+error));
		}
		res.status(result.status).json(result);
	}
	static async apiDeleteIntruders(req: Request, res: Response, next: NextFunction){
		let result = new response();
		let {deleteType, id, body, errors} = await buildDeleteBody(req);
		let intruders;
		switch(deleteType){
			case "daily_data":
				try{
					intruders = await Intruders.findByIdAndUpdate(id, {daily_data: [body]}, {new:true}); //Saves branch to mongodb
					result.status = 201;
					result.response = intruders;
					result.success = true;
				} catch (e: any) {
					result.errors.push("Error creating request", e);
				}
				break;
			case "intruders":
				try	{
					intruders = await Intruders.findByIdAndDelete(id, {new:true});
					console.log(intruders);
					if (intruders) {
						result.status = 201;
						result.response = {deleted: id};
						result.success = true;
					} else {
						result.status = 404;
						result.errors.push("intruders module not found");
					}
				} catch (e:any) {
					result.errors.push("Error deleting intruders", e);
				}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		res.status(result.status).json(result);
	}
}
