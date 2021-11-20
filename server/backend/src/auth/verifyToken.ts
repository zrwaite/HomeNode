import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { decodedTextSpanIntersectsWith } from "typescript";
dotenv.config();
const verifyToken = (headers: any) => {
	let token;
	let decoded:any = {authorized: false};
	if (headers.authorization) {
		token = headers.authorization.split(" ")[1];
		try{
			decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);	
		} catch (e) {
			decoded = {authorized: false};
		}
	}
	else decoded = {authorized: false};
	return decoded;
}
export default verifyToken;