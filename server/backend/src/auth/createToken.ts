import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const createToken = async (body: object) => {
	return jwt.sign(body, `${process.env.TOKEN_SECRET}`, { expiresIn: '3000000s' });
}
console.log(createToken({"test": "hello"}));
export default createToken;