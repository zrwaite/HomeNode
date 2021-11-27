import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult";
import Home from "../models/home/home"; //Schema for mongodb
import bcrypt from "bcrypt";
import {getToken, verifyToken} from "../auth/tokenFunctions";
import axios from "axios";

import {homeGetQuery, homePostBody, homePutBody} from "../models/home/homeInterfaces";

const buildGetQuery = async (req: any) => {
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
				if (auth.home_id!== req.query.id){
					undefinedParams.push("valid home_id in token");
					break;
				}
				query = req.query.id;
				queryType = "id";
			} else if (req.query.username!== undefined){
				if (auth.username!== req.query.username){
					undefinedParams.push("valid username in token");
					break;
				}
				query = req.query.username;
				queryType = "username";
			} else {
				undefinedParams.push("id, username");
			}
	}
	return {queryType: queryType, query: query, errors: undefinedParams};
};
const buildPostBody = async (req: any) => {
	//Create the post request
	let exists = false;
	let undefinedParams: string[] = [];
	let body: any = {};
	["name"].forEach((param) => {
		if (req.body[param]==undefined) undefinedParams.push(param);
	});
	let password = "";
	if (undefinedParams.length == 0) { 
		password = Math.random().toString(36).slice(-8);
		let hash = bcrypt.hashSync(password, 10);
		let postBody: homePostBody = {
			name: req.body.name,
			hash: hash,
			user: [],
			modules: [],
			settings: {intrusion_detection: true, safety_level: 5},
			notifications: [],
		};
		body = postBody;
		exists = true;
	}
	return {password: password, exists: exists, body: body, errors: undefinedParams};
};
const buildPutBody = async (req: any) => {
	//Create the put request for the daily data array
	let putType:string|undefined = req.query.put_type;
	let body: any = {};
	let undefinedParams: string[] = [];
	let id = req.body.id;
	let query: any = {};
	let auth = await verifyToken(req.headers);
	if (!auth) return {putType: undefined, query: query, body: body, errors: ["authorization"]};
	// let body: homePutBody = {}; I removed interfaces for this one
	switch (putType){
		case "user":
			if (req.body.user==undefined) undefinedParams.push("user");
			else body = {$addToSet: {users: req.body.user}};
			query = {_id: id};
			break;
		case "settings.intrusion_detection": case "intrusion_detection":
			if (req.body.settings.intrusion_detection==undefined) undefinedParams.push("intrusion_detection");
			else body = {"settings.intrusion_detection": req.body.settings.intrusion_detection};
			query = {_id: id};
			break;
		case "settings.safety_level": case "safety_level":
			if (req.body.settings.safety_level==undefined) undefinedParams.push("settings.safety_level");
			else body = {"settings.safety_level": req.body.settings.safety_level};
			query = {_id: id};
			break;
		case "module":
			if (req.body.module==undefined) undefinedParams.push("module");
			body = {$addToSet: {modules: req.body.module}};
			query = {_id: id, "modules.module_id": {$ne: req.body.module.module_id}};
			break;
		case "notification":
			if (req.body.notification==undefined) undefinedParams.push("notification");
			body = {$push: {notifications: req.body.notification}};
			query = {_id: id};
			break;
		case "read_notification": 
			body = {$set: {"notifications.$[].read": true}};
			query = {_id: id};
			break;
		default:
			putType = undefined;
			undefinedParams.push("put_type");
	}
	if (id === undefined) {
		putType = undefined;
		undefinedParams.push("id");
	} else if (id !== auth.home_id){
		putType = undefined;
		undefinedParams.push("Valid home_id in token");
	}
	return {putType: putType, query: query, body: body, errors: undefinedParams};
};

const buildDeleteBody = async (req: any) =>{
	let deleteType = undefined;
	let id = req.body.id;
	let body: any = {};
	let undefinedParams: string[] = [];
	let auth = await verifyToken(req.headers);
	if (!auth) return {deleteType: deleteType, id: id, body: body, errors: ["authorization"]};
	let token = await getToken(req.headers);
	switch (req.query.delete_type){
		case "home":
			deleteType = "home";
			break;
		default:
			undefinedParams.push("delete_type");
			break;
	}
	if (id === undefined) {
		deleteType = undefined;
		undefinedParams.push("id");
	} else if (id !== auth.home_id) {
		deleteType = undefined;
		undefinedParams.push("valid home_id in token");
	}
	return {deleteType: deleteType, id: id, token: token, errors: undefinedParams};
}

/* register controller */
export default class homeController {
	static async apiGetHome(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let {queryType, query, errors} = await buildGetQuery(req);
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
		let {exists, body, errors, password} = await buildPostBody(req);
		let newHome: any;
		if (exists) {
			try {
				newHome = new Home(body);
				await newHome.save(); //Saves branch to mongodb
				delete newHome.hash;
				result.status = 201;
				result.response = {home: newHome, password: password};
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
		let {putType, query, body, errors} = await buildPutBody(req);
		let home;
		if (putType) {
			try {
				//prettier-ignore
				home = await Home.findByIdAndUpdate(query, body, {new: true}); //Saves branch to mongodb
				result.status = 201;
				result.success = true;
				result.response = home;
			} catch (e: any) {
				result.status = 404;
				result.errors.push("Home not found, or trying to add duplicate value", e);
			}
		} else {
			errors.forEach((error)=>result.errors.push("missing "+error));
		}
		res.status(result.status).json(result);
	}
	static async apiDeleteHome(req: Request, res: Response, next: NextFunction){
		let result = new response();
		let {deleteType, id, token, errors} = await buildDeleteBody(req);
		let home;
		switch(deleteType){
			case "home":
				try {
					const homeData: any = await axios.get("/api/home?id="+id,{
						headers: {Authorization: "Bearer "+token}
					}
					);
					let homeResult: any = homeData.data;
					let module;
					if (homeResult) {
						let modules = homeResult.response.result.modules;
						let deleteData: any[] = [];
						modules.forEach((module:any)=> {
							let deleteLink = "";
							switch (module.type){
								case "intruders":
									deleteLink = "/api/intruders?delete_type=intruders";
									break;
								case "sensors":
									deleteLink = "/api/sensors?delete_type=sensors"
									break;
								case "plants":
									deleteLink = "/api/plants?delete_type=plants"
									break;
							}	
							if (!!deleteLink) {
								try {
									axios.delete(deleteLink,{
										data: { id: module._id},
										headers: {Authorization: "Bearer "+token}
									});
									deleteData.push("deleted module with id "+id);
								} catch (e:any) {
									console.log("Zac you messed up");
									deleteData.push("Failed to delete module with id "+id);
									result.errors.push("Failed to delete module with id "+id,e);
								}
							}
						});
					} else {
						result.errors.push("Error getting home modules");
					}
				} catch (e:any) {
					result.errors.push("Error sending home request");
				}
				try	{
					home = await Home.findByIdAndDelete(id, {new:true});
					if (home) {
						result.status = 201;
						result.response = {deleted: id};
						result.success = true;
					} else {
						result.status = 404;
						result.errors.push("home not found");
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
