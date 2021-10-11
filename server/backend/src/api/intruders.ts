import {Request, Response, NextFunction} from 'express'; //Typescript types
import response from '../models/response'; //Created pre-formatted uniform response
import Intruders from '../models/intruders'; //Schema for mongodb
interface intrudersGetQuery { //Url query interface for get request
    id?: string;
    home_id?: string;
}
interface intrudersPostBody { //Body query interface for post request
    name: string;
    username: string;
    home_id: string;
    current_data: object;
    daily_data: object[];
    past_data: object[];
}
interface intrudersPutBody { //Body query interface for put request
    detection?: string;
    alert_level?: number;
}
const buildGetQuery = (req : any) =>{ //Create the get request
    let exists = false;
    let query: intrudersGetQuery = {};
    if (req.query.id !== undefined) {
        query.id = req.query.id;
        exists = true;
    } else if (req.query.home_id !== undefined) {
        query.home_id = req.query.home_id;
        exists = true;
    }
    return {exists: exists, query: query}
}
const buildPostBody = (req: any) => { //Create the post request
    let exists = true;
    let list = [req.body.name, req.body.username, req.body.home_id, req.body.current_data];
    list.forEach((param)=>{if(param === undefined) exists=false;})
    let body: intrudersPostBody = {
        name: req.body.name,
        username: req.body.username,
        home_id: req.body.home_id,
        current_data: req.body.current_data,
        daily_data: [],
        past_data: []
    };
    return {exists: exists, body: body}
}
const buildPutBody = (req: any) =>{ //Create the put request for the daily data array
    let exists = false;
    let body: intrudersPutBody = {};
    let id = req.body.id;
    if (req.body.detection !== undefined) {
        body.detection = req.body.detection;
        exists = true;
    }
    if (req.body.alert_level !== undefined) {
        body.alert_level = req.body.alert_level;
        exists = true;
    }
    return {exists: exists, id: id, body: body}
}
const getResult = (intruders: any, result: response) =>{ //Create the returned result of a get request
    if (result.errors.length>0){return result;} 
    if (intruders !== undefined && intruders !== null && intruders.length !== 0) {
        result.status = 200;
        result.success = true;
        result.response = {"intruders": intruders};
    } else{
        result.status = 404;
        result.errors.push('Intruders data not found');
    }
    return result;
}
/* register controller */
export default class intrudersController {
    static async apiGetIntruders(req:Request, res: Response, next: NextFunction) {
        let result = new response(); //Create new standardized response
        let intruders; 
        let {exists, query} = buildGetQuery(req);
        if (query.id){ //Find by id
            try{intruders = await Intruders.findById(query.id);} 
            catch (e: any) {result.errors.push("Query error", e);}
        } 
        else if (exists) { //Find by other queries
            try{intruders = await Intruders.find(query);} 
            catch (e: any) {result.errors.push("Query error", e);}
        } 
        else {result.errors.push("No queries. Include id or username.");}
        result = getResult(intruders, result);
        res.status(result.status).json(result); //Return whatever result remains
    }
    static async apiPostIntruders(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let {exists, body} = buildPostBody(req);
        let newIntruders;
        if (exists){
            try { 
                newIntruders = new Intruders(body);
                try {
                    await newIntruders.save(); //Saves branch to mongodb
                    result.status = 201;
                    result.response = newIntruders;
                    result.success = true;
                } catch (e: any){
                    result.errors.push("Error adding to database", e);
                }
            }
            catch (e: any) {
                result.errors.push("Error creating request", e);
            }
        } else {
            console.log(body);
            result.errors.push("Body error. Make sure to include name, home_id, current_data, daily_data, past_data");
        }
        res.status(result.status).json(result);
    }
    static async apiPutIntruders(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let {exists, id, body} = buildPutBody(req);
        let intruders;
        if (exists){
            try {  //findByIdAndUpdate(id, update)
                intruders = await Intruders.findByIdAndUpdate(id, {$push: {daily_data: body}, current_data: body}, {new:true}); //Saves branch to mongodb
                result.status = 201;
                result.response = intruders;
                result.success = true;
            }
            catch (e: any) {
                result.errors.push("Error creating request", e);
            }
        }
        res.status(result.status).json(result);
    }
}