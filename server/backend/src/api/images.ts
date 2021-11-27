import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import getResult from "./modules/getResult"; //Creates formatted response
import IntruderImage from "../models/images/images"; //Schema for mongodb
import axios from "axios";
import {verifyToken, getToken} from "../auth/tokenFunctions";
const multer = require('multer');
const upload = multer({dest: '../uploads/images'});

import {imageGetQuery, imagePostBody, imageDeleteBody} from "../models/images/imagesInterface"

/* Import interfaces */

const compareAuthHomeId = async (headers: any, module_id: string) => {
	const auth = await verifyToken(headers);
	if (!auth.authorized) return false;
	let getLink = "/api/images?id=" + module_id;
	let token = await getToken(headers);
	if (token) {
		try {
			const intruderData: any = await axios.get(getLink, {
				headers: {
					Authorization: "Bearer " + token,
				},
			});
			let home_id = intruderData.data.response.result.home_id;
			if (home_id == auth.home_id) return true;
		} catch (e) {
			return false;
		}
	}
	return false;
};

/* Build Functions */

const buildGetQuery = async (req: any) => {
	//Create the get request
	let queryType = undefined;
	let query: any = {};
	let undefinedParams: string[] = [];
	let auth = await verifyToken(req.headers);
	if (!auth) return {queryType: queryType, query: query, errors: ["Authorization"]};
	switch (req.query.get_type) {
		case "all":
			queryType = "all";
			break;
		default:
			if (req.query.id !== undefined) {
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
	return {exists: exists, body: body, errors: undefinedParams};
};
const buildDeleteBody = async (req: any) => {
	let deleteType = undefined;
	let id = req.body.id;
	let body: any = {};
	let undefinedParams: string[] = [];
	let auth = await verifyToken(req.headers);
	if (!auth) return {deleteType: undefined, id: id, body: body, errors: ["authorization"]};
	if (id === undefined) {
		deleteType = undefined;
		undefinedParams.push("id");
	} else if (!(await compareAuthHomeId(req.headers, id))) {
		deleteType = undefined;
		undefinedParams.push("Valid home_id in token");
	}
	return {id: id, body: body, errors: undefinedParams};
};
/* register controller */
export default class ImageController {
	static async apiGetImage(req: Request, res: Response, next: NextFunction) {
		let result = new response(); //Create new standardized response
		let {auth, queryType, query, errors} = await buildGetQuery(req);
		let image: any;
		switch (queryType) {
			case "all":
				try {
					image = await IntruderImage.find();
				} catch (e: any) {
					result.errors.push("Query error", e);
				}
				break;
			case "id":
				try {
					image = await IntruderImage.findById(query);
				} catch (e: any) {
					result.errors.push("Query error", e);
				}
				break;
			default:
				errors.forEach((error) => result.errors.push("missing " + error));
		}
		if (queryType !== "all" && image && image.home_id.toString() !== auth.home_id) {
			result.errors.push("Not authorized too access these sensors");
			result.response = {};
		}
		result = getResult(image, "intruders", result);
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async apiPostImage(req: any, res: Response, next: NextFunction) {
		let result = new response();
		upload.single('photo')
		if(req.file) {
			res.json(req.file);
		}
		else throw 'error';
		/*
		let {exists, body, errors} = await buildPostBody(req);
		let image;
		if (exists) {
			try {
				image = new IntruderImage(body);
				await image.save(); //Saves branch to mongodb
			} catch (e: any) {
				result.errors.push("Error creating request", e);
			}
		} else {
			errors.forEach((error) => result.errors.push("missing " + error));
		}
		res.status(result.status).json(result);
		*/
	}
	static async apiDeleteImage(req: Request, res: Response, next: NextFunction) {
		let result = new response();
		let {id, body, errors} = await buildDeleteBody(req);
		let image;
		image = await IntruderImage.findByIdAndDelete(id, {new: true});
		res.status(result.status).json(result);
	}
}
