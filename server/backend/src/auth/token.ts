import {Request, Response, NextFunction} from "express"; //Typescript types
import response from "../models/response"; //Created pre-formatted uniform response
import User from "../models/user/user"; //Schema for mongodb

const tokenController = async (req: Request, res: Response, next: NextFunction) => {

};

export default tokenController;