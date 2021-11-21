import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const getToken = async (headers: any) => {
	if (headers.authorization) {
		return headers.authorization.split(" ")[1];
	} return false;
}
const verifyToken = async (headers: any) => {
	const token = await getToken(headers);
	let decoded:any = {authorized: false};
	if (token) {
		try{
			decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}`);	
		} catch (e) {
			decoded = {authorized: false};
		}
	}
	return decoded;
}

const createToken = async (body: object) => {
	return jwt.sign(body, `${process.env.TOKEN_SECRET}`, { expiresIn: '3000000s' });
}
export {createToken, verifyToken, getToken};