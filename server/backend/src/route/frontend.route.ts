import {Request, Response, NextFunction} from "express";
import path from "path";
import fs from "fs";

const folderPath = path.join(__dirname, "../../../frontend/build");

const getFrontend = (req: Request, res: Response) => {
	if (req.url !== "/" && fs.existsSync(folderPath)) {
		res.status(200).sendFile("index.html", {root: folderPath});
	} else {
		res.status(404).json("404 File not found");
	}
};
export default getFrontend; 
