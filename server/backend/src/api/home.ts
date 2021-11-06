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
			} else if (req.query.username!== undefined){
				query = req.query.username;
				queryType = "username";
			} else {
				undefinedParams.push("id, username");
			}
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
	let putType:string|undefined = req.query.put_type;
	let body: any = {};
	let undefinedParams: string[] = [];
	let id = req.body.id;
	console.log(id);
	// let body: homePutBody = {}; I removed interfaces for this one
	switch (putType){
		case "user":
			if (req.body.user==undefined) undefinedParams.push("user");
			else body = {$addToSet: {users: req.body.user}};
			break;
		case "settings.intrusion_detection":
			if (req.body.settings.intrusion_detection==undefined) undefinedParams.push("intrusion_detection");
			body = {"settings.intrusion_detection": req.body.settings.intrusion_detection};
			break;
		case "module":
			if (req.body.module==undefined) undefinedParams.push("module");
			body = {_id: id, "modules.module_id": {$ne: req.body.module.module_id}}, {$addToSet: {modules: req.body.module}};
			break;
		case "notification":
			if (req.body.notification==undefined) undefinedParams.push("notification");
			body = {$push: {notifications: req.body.notification}};
			break;
		default:
			putType = undefined;
			undefinedParams.push("put_type");
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
				console.log(query)
				try {home = await Home.findById(query);} 
				catch (e: any) {result.errors.push("Query error", e);}
				break;
			case "username":
				console.log(query);
				try {home = await Home.find({users: {$all: [query]}});}
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
		if (putType) {
			try {
				//prettier-ignore
				home = await Home.findByIdAndUpdate(id, body, {new: true}); //Saves branch to mongodb
				result.status = 201;
				result.response = home;
				result.success = true;
			} catch (e: any) {
				result.status = 404;
				result.errors.push("Home not found, or trying to add duplicate value", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
}
