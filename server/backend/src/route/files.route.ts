import {Request, Response, NextFunction} from "express";
import path from "path";
import fs from "fs";

const folderPath = path.join(__dirname, "../../../");

const getFile = (req: Request, res: Response) => {
	if (req.url !== "/" && fs.existsSync(folderPath + req.url)) {
		res.status(200).sendFile(req.url, {root: folderPath});
	} else {
		res.status(404).json("404 File not found");
	}
};
export default getFile;
