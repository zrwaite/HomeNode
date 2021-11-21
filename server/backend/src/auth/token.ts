import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import {createToken} from "./tokenFunctions";
import bcrypt from "bcrypt";
import axios from "axios";

const tokenController = async (req: Request, res: Response, next: NextFunction) => {
	let result = new response();
	//Get home data, confirming it exists
	let home_id = req.body.home_id;
	let password = req.body.password;
	let token = await createToken({home_id: home_id, authorized: true})
	if (home_id==undefined) result.errors.push("Missing home_id");
	else if (password==undefined) result.errors.push("Missing password");
	else {
		try{
			const homeData: any = await axios.get("/api/home?id="+home_id, 
			{headers: {
				Authorization: "Bearer "+token
			}});
			let homeResult: any = homeData.data;
			let passwordCheck = false;
			if (homeResult.success && homeResult.response.result.hash!==undefined) {
				passwordCheck = bcrypt.compareSync(password, homeResult.response.result.hash);
			}
			if (passwordCheck) {
				result.response = {token: token};
				result.status = 201;
				result.success = true;
			} else {
				result.errors.push("password check failed");
			}
		} catch (e:any) {
			result.errors.push("Error creating home request", e);
		}
	}
	res.status(result.status).json(result);
};

export default tokenController;