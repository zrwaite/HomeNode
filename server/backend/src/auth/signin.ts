import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import {createToken} from "./tokenFunctions";
import bcrypt from "bcrypt";
import axios from "axios";

const signInController = async (req: Request, res: Response, next: NextFunction) => {
	let result = new response();
	//Get home data, confirming it exists
	let password = req.body.password;
	let username = req.body.username;
	//The following statements should be refactored to push all missing params
	if (username==undefined) result.errors.push("Missing username");
	else if (password==undefined) result.errors.push("Missing password");
	else {
		try{
			let token = await createToken({username: username, authorized: true})
			const userData: any = await axios.get("/api/user?username="+username,
			{headers: {
				Authorization: "Bearer "+token
			}});
			let userResult: any = userData.data;
			let passwordCheck = false;
			if (userResult.success && userResult.response.result.hash!==undefined) {
				passwordCheck = bcrypt.compareSync(password, userResult.response.result.hash);
			}
			if (passwordCheck) {
				let home_id = userResult.response.result.home_id;
				token = await createToken({home_id: home_id, username: username, authorized: true})
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

export default signInController;