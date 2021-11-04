import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult";
import Home from "../models/home/home"; //Schema for mongodb

import {homeGetQuery, homePostBody, homePutBody} from "../models/home/homeInterfaces";

const buildGetQuery = (req: any) => {
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
			let iDQuery: homeGetQuery = {};
			query = iDQuery;
	}
	return {queryType: queryType, query: query, errors: undefinedParams};
};
const buildPostBody = (req: any) => {
	//Create the post request
	let exists = false;
	let undefinedParams: string[] = [];
	let body: any = {};
	["name"].forEach((param) => {
		if (req.body[param]==undefined) undefinedParams.push(param);
	});
	if (undefinedParams.length == 0) { 
		let postBody: homePostBody = {
			name: req.body.name,
			user: [],
			modules: [],
			settings: {intrusion_detection: true},
			notifications: [],
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
	let param = req.query.put_type;
	if (req.body[param]==undefined) undefinedParams.push(param);
	else {
		putType = param;
		body = req.body[param];
	}
	if (id === undefined) putType = undefined;
	return {putType: putType, id: id, body: body, errors: undefinedParams};
};
/* register controller */
export default class homeController {
	static async apiGetHome(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let {queryType, query, errors} = buildGetQuery(req);
		let home;
		switch (queryType){
			case "all":
				try{home = await Home.find();} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "id":
				try {home = await Home.findById(query);} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "username":
				try {home = await Home.find({usernames: {$all: [query]}});}
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			default:
				errors.forEach((error)=> result.errors.push("missing "+error))
		}
		result = getResult(home, "home", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostHome(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {exists, body, errors} = buildPostBody(req);
		let newHome;
		if (exists) {
			try {
				newHome = new Home(body);
				await newHome.save(); //Saves branch to mongodb
				result.status = 201;
				result.response = newHome;
				result.success = true;
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
	static async apiPutHome(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {putType, id, body, errors} = buildPutBody(req);
		let home;
		let updateData: any = {};
		switch (putType) {
			case "user":
				updateData = {$addToSet: {users: body}};
				break;
			case "intrusion_detection":
				updateData = {"settings.intrusion_detection": body};
				break;
			case "module":
				updateData = {_id: id, "modules.module_id": {$ne: body.module?.module_id}}, {$addToSet: {modules: body.module}};
				break;
			case "notification":
				updateData = {$push: {notifications: body.notification}};
				break;
			default:
				errors.forEach((error)=>result.errors.push("Missing "+error));
				putType = undefined;
		}
		if (putType) {
			try {
				//prettier-ignore
				home = await Home.findByIdAndUpdate(id, updateData, {new: true}); //Saves branch to mongodb
				result.status = 201;
				result.response = home;
				result.success = true;
			} catch (e: any) {
				result.status = 404;
				result.errors.push("Home not found, or trying to add duplicate value", e);
			}
		}
		res.status(result.status).json(result);
	}
}
