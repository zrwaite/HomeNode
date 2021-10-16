import {Request, Response, NextFunction} from 'express'; //Typescript types
import response from '../models/response'; //Created pre-formatted uniform response
import getResult from './modules/getResult';
import Home from '../models/home'; //Schema for mongodb

interface homeGetQuery { //Url query interface for get request
    id?: string;
    username?: string;
}
interface homePostBody { //Body query interface for post request
    name: string;
    user: string[];
    modules: object[];
    settings: object;
    notifications: object[];
}
interface homePutBody { //Body query interface for put request
    user?: string;
    settings?: homeSettings;
    module?: homeModule;
    notification?: object;
}
interface homeSettings {
    intrusion_detection?: boolean;
}
interface homeModule {
    type: string;
    module_id: string;
}

const buildGetQuery = (req : any) =>{ //Create the get request
    let exists = false;
    let query: homeGetQuery = {};
    if (req.query.id !== undefined) {
        query.id = req.query.id;
        exists = true;
    } else if (req.query.username !== undefined) {
        query.username = req.query.username;
        exists = true;
    }
    return {exists: exists, query: query}
}
const buildPostBody = (req: any) => { //Create the post request
    let exists = true;
    let list = [req.body.name];
    list.forEach((param)=>{if(param === undefined) exists=false;})
    let body: homePostBody = {
        name: req.body.name,
        user: [],
        modules: [],
        settings: {intrusion_detection: true},
        notifications: []
    };
    return {exists: exists, body: body}
}
const buildPutBody = (req: any) =>{ //Create the put request for the daily data array
    let type;
    let body: homePutBody = {};
    if (req.body.user !== undefined) {
        body.user = req.body.user;
        type = "user";
    } else if (req.body.settings !== undefined) {
        if (req.body.settings.intrusion_detection !== undefined){
            body.settings = {};
            body.settings.intrusion_detection = true;
            type = "intrusion_detection";
        }
    } else if (req.body.module !== undefined) {
        body.module = req.body.module;
        type = "module";
    } else if (req.body.notification !== undefined) {
        body.notification = req.body.notification;
        type = "notification";
    }
    let id = req.body.id;
    if (id==undefined){
        type = undefined;
    }
    return {type: type, id: id, body: body}
}
/* register controller */
export default class homeController {
    static async apiGetHome(req:Request, res: Response, next: NextFunction) {
        let result = new response(); //Create new standardized response
        let home; 
        let {exists, query} = buildGetQuery(req);
        if (query.id){ //Find by id
            try{home = await Home.findById(query.id);} 
            catch (e: any) {result.errors.push("Query error", e);}
        } 
        else if (exists) { //Find by other queries
            try{home = await Home.find({ usernames: { $all: [query.username] } });} 
            catch (e: any) {result.errors.push("Query error", e);}
        } 
        else {result.errors.push("No queries. Include id or username.");}
        result = getResult(home, 'home', result);
        res.status(result.status).json(result); //Return whatever result remains
    }
    static async apiPostHome(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let {exists, body} = buildPostBody(req);
        let newHome;
        if (exists){
            try { 
                newHome = new Home(body);
                try {
                    await newHome.save(); //Saves branch to mongodb
                    result.status = 201;
                    result.response = newHome;
                    result.success = true;
                } catch (e: any){
                    result.errors.push("Error adding to database", e);
                }
            }
            catch (e: any) {
                result.errors.push("Error creating request", e);
            }
        } else {
            result.errors.push("Body error. Make sure to include name");
        }
        res.status(result.status).json(result);
    }
    static async apiPutHome(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let {type, id, body} = buildPutBody(req);
        let home;
        switch (type) {
            case "user":
                try {
                    home = await Home.findByIdAndUpdate(id, {$addToSet: {users: body.user}}, {new:true}); //Saves branch to mongodb
                } catch (e:any) {result.errors.push("Error creating user request", e);}
                break;
            case "intrusion_detection":
                try {
                    home = await Home.findByIdAndUpdate(id, {"settings.intrusion_detection": body.settings?.intrusion_detection}, {new:true}); //Saves branch to mongodb
                } catch (e:any) {result.errors.push("Error creating settings request", e);}
                break;
            case "module":
                try {
                    home = await Home.findOneAndUpdate({_id: id, 'modules.module_id': {$ne: body.module?.module_id}}, {$addToSet: {modules: body.module}}, {new:true}); //Saves branch to mongodb
                } catch (e:any) {result.errors.push("Error creating module request", e);}
                break;
            case "notification":
                try {
                    home = await Home.findByIdAndUpdate(id, {$push: {notifications: body.notification}},{new:true}); //Saves branch to mongodb
                } catch (e:any) {result.errors.push("Error creating notification request", e);}
                break;
            default:
                result.errors.push("Body error. Make sure to include id and user, settings, module, or notification");
        }
        if (home && result.errors.length === 0) {
            result.status = 201; 
            result.response = home; 
            result.success = true;
        } else {
            result.status = 404; 
            result.success = false;
            result.errors.push("Home not found, or trying to add duplicate value");
            result.response = {};
        }
        res.status(result.status).json(result);
    }
}