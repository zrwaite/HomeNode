import express from "express";
import cors from "cors";
import env from "dotenv";
import path from "path";
//import jwt from 'express-jwt';
//import jwks from 'jwks-rsa';
import response from "./models/response"; //Created pre-formatted uniform response

const app = express();

//configs
env.config();

// utilities
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../frontend/build"))); //development


// routes
import getFile from "./route/files.route";
import getFrontend from "./route/frontend.route";
import apiRoute from "./route/api.route";
import authRoute from "./route/auth.route";

// api
app.use("/api", apiRoute);
app.use("/auth", authRoute);

app.get("/test", (req, res) => {
	let result = new response(200, [], {page: "test"}, true);
	res.status(result.status).json(result); //Return 200 result
});

app.get("/backend/*", (req, res) => {
	let result = new response(403, [], {response: "nice try buddy"});
	res.status(result.status).json(result); //Return 200 result
});

app.get("/files/*", getFile);
app.get("/", (req: express.Request, res: express.Response) => {
	res.sendFile(path.resolve(__dirname, "../../frontend/build", "index.html")); //production
});
app.get("/*", getFrontend);


export default app; //Export server for use in index.js
