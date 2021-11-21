import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates standard response
import Sensors from "../models/sensors/sensors"; //Schema for mongodb
import axios from "axios";
import {verifyToken, getToken} from "../auth/tokenFunctions";


/* Sensors Interfaces imports */ 
import {sensorsGetQuery, sensorsPostBody, sensorsPastPutBody, sensorsDailyPutBody, sensorsDeleteBody} from "../models/sensors/sensorsInterface";

const compareAuthHomeId = async (headers: any, module_id:string) => {
	const auth = await verifyToken(headers);
	if (!auth.authorized) return false;
	let getLink = "/api/sensors?id="+module_id;
	let token = await getToken(headers);
	if (token) {
		try{
			const sensorsData: any = await axios.get(getLink, 
				{headers: {
					Authorization: "Bearer "+token
				}});
			let home_id = sensorsData.data.response.result.home_id;
			if (home_id == auth.home_id) return true;
		} catch (e) {
			return false;
		}
	}
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
		let postBody: sensorsPostBody = {
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
			["date", "average_temperature", "average_humidity", "average_light_level", "average_moisture"].forEach((param) => {
				if (req.body[param]==undefined) undefinedParams.push(param);
			});
			if (undefinedParams.length == 0) { 
				let pastBody: sensorsPastPutBody = {
					date: req.body.date,
					average_temperature: req.body.average_temperature,
					average_humidity: req.body.average_humidity,
					average_light_level: req.body.average_light_level,
					average_moisture: req.body.average_moisture,
				};
				body = {$push: {past_data: pastBody}};
			} else {
				putType = undefined;
			}
			break;
		case "daily_data":
			let bodyParts: any = [];
			let dailyBody: sensorsDailyPutBody = {};
			if (req.body.temperature !== undefined) {
				dailyBody.temperature = req.body.temperature;
				bodyParts.push({"current_data.temperature": req.body.temperature});
				putType = "daily_data";
			}
			if (req.body.humidity !== undefined) {
				dailyBody.humidity = req.body.humidity;
				bodyParts.push({"current_data.humidity": req.body.humidity});
				putType = "daily_data";
			}
			if (req.body.light_level !== undefined) {
				dailyBody.light_level = req.body.light_level;
				bodyParts.push({"current_data.light_level": req.body.light_level});
				putType = "daily_data";
			}
			if (req.body.moisture !== undefined) {
				dailyBody.moisture = req.body.moisture;
				bodyParts.push({"current_data.moisture": req.body.moisture});
				putType = "daily_data";
			}
			if (!putType) undefinedParams.push("temperature, humidity, moisture or light_level");
			else {
				body = {$push: {daily_data: dailyBody}};
				bodyParts.forEach((part: object) => body = {...body, ...part});
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
			["temperature", "humidity", "light_level", "moisture"].forEach((param) => {
				if (req.body[param]==undefined) undefinedParams.push(param);
			});
			if (undefinedParams.length == 0) { 
				let deleteBody: sensorsDeleteBody = {
					temperature: req.body.temperature,
					humidity: req.body.humidity,
					light_level: req.body.light_level,
					moisture: req.body.moisture
				};
				deleteType = "daily_data";
				body = deleteBody;
			} else {
				deleteType = undefined;
			}
			break;
		case "sensors":
			deleteType = "sensors";
			break;
		default:
			undefinedParams.push("delete_type");
			break;
	}
	if (id === undefined) {
		deleteType = undefined;
		undefinedParams.push("id");
	} else if (id !== auth.home_id){
		deleteType = undefined;
		undefinedParams.push("Valid home_id in token");
	}
	return {deleteType: deleteType, id: id, body: body, errors: undefinedParams};
}

/* sensors controller */
export default class sensorsController {
	static async apiGetSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let sensors: any;
		let {auth, queryType, query, errors} = await buildGetQuery(req);
		switch (queryType){
			case "all":
				try{sensors = await Sensors.find();} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "id":
				try {sensors = await Sensors.findById(query);} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "home_id":
				try {sensors = await Sensors.findOne(query);}
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		if (sensors && sensors.home_id.toString() !== auth.home_id) {
			result.errors.push("Not authorized too access these sensors");
			result.response = {};
		}
		result = getResult(sensors, "sensors", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {token, exists, body, errors} = await buildPostBody(req);
		let newSensors;
		if (exists) {
			try {
				newSensors = new Sensors(body);
				await newSensors.save(); //Saves branch to mongodb
				let putBody = {
					id: body.home_id,
					module: {
						type: 'sensors',
						module_id: newSensors._id.toString()
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
							sensorResult: newSensors,
							homeResult: homeResult.response,
						};
					} else {
						result.errors.push("Error adding user to home");
						result.response = {sensorResult: newSensors};
					}
				} catch (e:any) {
					result.errors.push("Error creating home request", e);
				}
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
	static async apiPutSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {putType, id, body, errors} = await buildPutBody(req);
		let sensors;
		if (putType) {
			try {
				//prettier-ignore
				sensors = await Sensors.findByIdAndUpdate(id, body, {new:true}); //Saves branch to mongodb
				result.status = 201;
				result.response = sensors;
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
	static async apiDeleteSensors(req: Request, res: Response, next: NextFunction){
		let result = new response();
		let {deleteType, id, body, errors} = await buildDeleteBody(req);
		let sensors;
		switch(deleteType){
			case "daily_data":
				try{
					sensors = await Sensors.findByIdAndUpdate(id, {daily_data: [body]}, {new:true}); //Saves branch to mongodb
					result.status = 201;
					result.response = sensors;
					result.success = true;
				} catch (e: any) {
					result.errors.push("Error creating request", e);
				}
				break;
			case "sensors": 
				try	{
					sensors = await Sensors.findByIdAndDelete(id, {new:true});
					if (sensors) {
						result.status = 201;
						result.response = {deleted: id};
						result.success = true;
					} else {
						result.status = 404;
						result.errors.push("sensors module not found");
					}
				} catch (e:any) {
					result.errors.push("Error deleting sensors", e);
				}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		res.status(result.status).json(result);

	}
}
