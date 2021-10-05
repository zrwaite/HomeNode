import {Request, Response, NextFunction} from 'express';
import response from '../models/response'; //Created pre-formatted uniform response
import Sensors from '../models/sensors';

interface sensorsGetQuery {
    id?: string;
    username?: string;
}
interface sensorsPostBody {
    name: string;
    username: string;
    home_id: string;
    current_data: object;
    daily_data: object[];
    past_data: object[];
}
interface sensorsPutBody {
    temperature?: number;
    humidity?: number;
    light_level?: number;
}

const buildGetQuery = (req : any) =>{
    let exists = false;
    let list = [req.query.id, req.query.username];
    list.forEach((param)=>{if(param !== undefined) exists=true;})
    let query: sensorsGetQuery = {
        id: req.query.id,
        username: req.query.username
    };
    return {exists: exists, query: query}
}
const buildPostBody = (req: any) => {
    let exists = true;
    let list = [req.body.name, req.body.username, req.body.home_id, req.body.current_data, req.body.daily_data, req.body.past_data];
    list.forEach((param)=>{if(param === undefined) exists=false;})
    let body: sensorsPostBody = {
        name: req.body.name,
        username: req.body.username,
        home_id: req.body.home_id,
        current_data: req.body.current_data,
        daily_data: req.body.daily_data,
        past_data: req.body.past_data
    };
    return {exists: exists, body: body}
}
const buildPutBody = (req: any) =>{
    let exists = false;
    let id = req.body.id;
    let list = [req.body.id, req.body.temperature, req.body.humidity, req.body.light_level];
    list.forEach((param)=>{if(param !== undefined) exists=true;})
    let body: sensorsPutBody = {
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        light_level: req.body.light_level
    };
    return {exists: exists, id: id, body: body}
}
const getResult = (sensors: any, result: response) =>{
    if (result.errors.length>0){return result;} 
    if (sensors !== undefined && sensors !== null && sensors.length !== 0) {
        result.status = 200;
        result.success = true;
        result.response = {"sensors": sensors};
    } else{
        result.status = 404;
        result.errors.push('Sensors not found');
    }
    return result;
}
/* register controller */
export default class sensorsController {
    static async apiGetSensors(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let sensors;
        let {exists, query} = buildGetQuery(req);
        if (query.id){ //Find by id
            try{sensors = await Sensors.findById(query.id);} 
            catch (e: any) {result.errors.push("Query error");}
        } 
        else if (exists) { //Find by other queries
            try{sensors = await Sensors.find(query);} 
            catch (e: any) {result.errors.push("Query error");}
        } 
        else {result.errors.push("No queries. Include id or username.");}
        result = getResult(sensors, result);
        res.status(result.status).json(result); //Return whatever result remains
    }
    static async apiPostSensors(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let {exists, body} = buildPostBody(req);
        let newSensors;
        if (exists){
            try { 
                newSensors = new Sensors(body);
                try {
                    await newSensors.save(); //Saves branch to mongodb
                    result.status = 201;
                    result.response = newSensors;
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
            result.errors.push("Body error. Make sure to include name, username, home_id, current_data, daily_data, past_data");
        }
        res.status(result.status).json(result);
    }
    static async apiPutSensors(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let {exists, id, body} = buildPutBody(req);
        let sensors;
        if (exists){
            try {  //findByIdAndUpdate(id, update)
                sensors = await Sensors.findByIdAndUpdate(id, {$push: {daily_data: body}}); //Saves branch to mongodb
                result.status = 201;
                result.response = sensors;
                result.success = true;
            }
            catch (e: any) {
                result.errors.push("Error creating request", e);
            }
        }
        res.status(result.status).json(result);
    }
}