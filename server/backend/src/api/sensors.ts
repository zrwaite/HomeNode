import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates standard response
import Sensors from "../models/sensors"; //Schema for mongodb
import axios from "axios";

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
interface sensorsPutBody {
	//Body query interface for put request
	temperature?: number;
	humidity?: number;
	light_level?: number;
}

const buildGetQuery = (req: any) => {
	//Create the get request
	let exists = false;
	let query: sensorsGetQuery = {};
	if (req.query.id !== undefined) {
		query.id = req.query.id;
		exists = true;
	} else if (req.query.home_id !== undefined) {
		query.home_id = req.query.home_id;
		exists = true;
	}
	return {exists: exists, query: query};
};
const buildPostBody = (req: any) => {
	//Create the post request
	let exists = true;
	let list = [req.body.name, req.body.home_id, req.body.current_data];
	list.forEach((param) => {
		if (param === undefined) exists = false;
	});
	let body: sensorsPostBody = {
		name: req.body.name,
		home_id: req.body.home_id,
		current_data: req.body.current_data,
		daily_data: [],
		past_data: [],
	};
	return {exists: exists, body: body};
};
const buildPutBody = (req: any) => {
	//Create the put request for the daily data array
	let exists = false;
	let body: sensorsPutBody = {};
	if (req.body.temperature !== undefined) {
		body.temperature = req.body.temperature;
		exists = true;
	}
	if (req.body.humidity !== undefined) {
		body.humidity = req.body.humidity;
		exists = true;
	}
	if (req.body.light_level !== undefined) {
		body.light_level = req.body.light_level;
		exists = true;
	}
	let id = req.body.id;
	return {exists: exists, id: id, body: body};
};

/* sensors controller */
export default class sensorsController {
	static async apiGetSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let sensors;
		if (req.query.all = "true"){
			try{
				sensors = await Sensors.find();
			} catch (e: any) {
				result.errors.push("Query error", e);
			}
		} else {
			let {exists, query} = buildGetQuery(req);
			if (query.id) {
				//Find by id
				try {
					sensors = await Sensors.findById(query.id);
				} catch (e: any) {
					result.errors.push("Query error", e);
				}
			} else if (exists) {
				//Find by other queries
				try {
					sensors = await Sensors.find(query);
				} catch (e: any) {
					result.errors.push("Query error", e);
				}
			} else {
				result.errors.push("No queries. Include id or home_id.");
			}
		}
		result = getResult(sensors, "sensors", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, body} = buildPostBody(req);
		let newSensors;
		if (exists) {
			try {
				newSensors = new Sensors(body);
				try {
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
					result.errors.push("Error adding to database. Duplicate data probably", e);
				}
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		} else {
			console.log(body);
			result.errors.push("Body error. Make sure to include name, username, home_id, current_data, daily_data, past_data");
		}
		res.status(result.status).json(result);
	}
	static async apiPutSensors(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, id, body} = buildPutBody(req);
		let sensors;
		if (exists) {
			try {
				console.log(body);
				//prettier-ignore
				let updateData: any = {$push: {daily_data: body}};
				if(body.temperature) updateData["current_data.temperature"]= body.temperature;
				if(body.humidity) updateData["current_data.humidity"] = body.humidity;
				if(body.light_level) updateData["current_data.light_level"] = body.light_level;
				sensors = await Sensors.findByIdAndUpdate(id, updateData, {new:true}); //Saves branch to mongodb
				result.status = 201;
				result.response = sensors;
				result.success = true;
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		}
		res.status(result.status).json(result);
	}
}
