import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates standard response
import Sensors from "../models/sensors/sensors"; //Schema for mongodb
import axios from "axios";

/* Sensors Interfaces imports */ 
import {sensorsGetQuery, sensorsPostBody, sensorsPastPutBody, sensorsDailyPutBody} from "../models/sensors/sensorsInterface";

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
			} else if (req.home_id!== undefined){
				query = req.query.home_id;
				queryType = "home_id";
			} else {
				undefinedParams.push("id, home_id");
			}
			let iDQuery: sensorsGetQuery = {};
			query = iDQuery;
	}
	return {queryType: queryType, query: query, errors: undefinedParams};
};
const buildPostBody = (req: any) => {
	//Create the post request
	let exists = false;
	let undefinedParams: string[] = [];
	let body: any = {};
	["name", "home_id", "current_data"].forEach((param) => {
		if (req.body[param]==undefined) undefinedParams.push(param);
	});
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
	return {exists: exists, body: body, errors: undefinedParams};
};
const buildPutBody = (req: any) => {
	//Create the put request for the daily data array
	let putType = undefined;
	let id = req.body.id;
	let body: any = {};
	let undefinedParams: string[] = [];
	switch (req.query.put_type) {
		case "past_data":
			["date", "average_temperature", "average_humidity", "average_light_level"].forEach((param) => {
				if (req.body[param]==undefined) undefinedParams.push(param);
			});
			if (undefinedParams.length == 0) { 
				let pastBody: sensorsPastPutBody = {
					date: req.body.date,
					average_temperature: req.body.average_temperature,
					average_humidity: req.body.average_humidity,
					average_light_level: req.body.average_light_level,
				};
				putType = "past_data";
				body = pastBody;
			}
			break;
		case "daily_data":
			let dailyBody: sensorsDailyPutBody = {};
			if (req.body.temperature !== undefined) {
				body.temperature = req.body.temperature;
				putType = "daily_data";
			}
			if (req.body.humidity !== undefined) {
				body.humidity = req.body.humidity;
				putType = "daily_data";
			}
			if (req.body.light_level !== undefined) {
				body.light_level = req.body.light_level;
				putType = "daily_data";
			}
			if (!putType) undefinedParams.push("temperature, humidity or light_level");
			body = dailyBody;

			break;
		default:
			undefinedParams.push("put_type");
			break;
	}
	if (id === undefined) putType = undefined;
	return {putType: putType, id: id, body: body, errors: undefinedParams};
};

/* sensors controller */
export default class sensorsController {
	static async apiGetSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let sensors;
		let {queryType, query, errors} = buildGetQuery(req);
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
				try {sensors = await Sensors.find(query);}
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		result = getResult(sensors, "sensors", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, body, errors} = buildPostBody(req);
		let newSensors;
		if (exists) {
			try {
				newSensors = new Sensors(body);
				await newSensors.save(); //Saves branch to mongodb
				const homeData: any = await axios.put("/api/home", {
					id: body.home_id,
					module : {
						type: 'sensors',
						module_id: newSensors._id 
					}
				});
				let homeResult: any = homeData.data;
				if (homeResult) {
					console.log(homeResult);
					result.success = homeResult.success;
					result.errors.push(...homeResult.errors);
					result.status = homeResult.status;
					result.response = {
						sensorResult: newSensors,
						homeResult: homeResult.response,
					};
				} else {
					result.success = false;
					result.errors.push("Error adding user to home");
					result.status = 400;
					result.response = {sensorResult: newSensors};
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
		let {putType, id, body, errors} = buildPutBody(req);
		let updateData: any = {};
		let sensors;
		switch (putType){
			case "daily_data":
				updateData = {$push: {daily_data: body}};
				if(body.temperature) updateData["current_data.temperature"]= body.temperature;
				if(body.humidity) updateData["current_data.humidity"] = body.humidity;
				if(body.light_level) updateData["current_data.light_level"] = body.light_level;
				break;
			case "past_data":
				updateData = {$push: {past_data: body}};
				break;
			default:
				errors.forEach((error)=>result.errors.push("Missing "+error));
				putType = undefined;
		}
		if (putType) {
			try {
				//prettier-ignore
				sensors = await Sensors.findByIdAndUpdate(id, updateData, {new:true}); //Saves branch to mongodb
				result.status = 201;
				result.response = sensors;
				result.success = true;
			} catch (e: any) {
				result.status = 404;
				result.errors.push("Error creating request", e);
			}
		}
		res.status(result.status).json(result);
	}
}
