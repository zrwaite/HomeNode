import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const createToken = async (body: object) => {
	let secret: jwt.Secret|undefined = process.env.TOKEN_SECRET;
	return jwt.sign(body, `${process.env.TOKEN_SECRET}`, { expiresIn: '1800s' });
}
console.log(createToken({"test": "hello"}));