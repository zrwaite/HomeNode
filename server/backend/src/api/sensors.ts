import {Request, Response, NextFunction} from 'express';
import response from '../models/response'; //Created pre-formatted uniform response
import Sensors from '../models/sensors';

interface sensorsQueries {
    exists: boolean;
    id?: string;
    username?: string;
}

/* register controller */
export default class sensorsController {
    static findQueries(req : any){
        let queries: sensorsQueries = {exists: false};
        if (req.query.id !== undefined){
            queries.id = req.query.id; 
            queries.exists = true;
        }
        if (req.query.username !== undefined){
            queries.username = req.query.username;
            queries.exists = true;
        }
        return queries;
    }
    static getResult(sensors: any, result: response){
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
    static async apiGetSensors(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        let sensors;
        let query = sensorsController.findQueries(req);
        if (query.id){ //Find by id
            try{sensors = await Sensors.findById(query.id);} 
            catch (e: any) {result.errors.push("Query error");}
        } 
        else if (query.exists) { //Find by other queries
            try{sensors = await Sensors.find(query);} 
            catch (e: any) {result.errors.push("Query error");}
        } 
        else {result.errors.push("No queries");}
        result = sensorsController.getResult(sensors, result);
        res.status(result.status).json(result); //Return whatever result remains
    }
    static async apiPostSensors(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        /*
static async apiPostOrders(req, res, next) {
        let result = new response();
        const { // get user info from request body
            password,
            store_id,
            username,
            price,
            products,
        } = req.body;
        if (store_id===undefined){result.errors.push("store_id undefined")}
        if (username===undefined){result.errors.push("username undefined")}
        if (price===undefined){result.errors.push("price undefined")}
        if (products===undefined){result.errors.push("products undefined")}
        if (password===undefined || password!==process.env.PASSWORD){result.errors.push("password incorrect")}
        if (result.errors.length==0){
            const taxed_price = Math.round(113*price)/100.0;
            let newOrders;
            try{
                newOrders = new Orders({ //Create branch with input
                    store_id,
                    username,
                    price,
                    taxed_price,
                    products
                });
            } catch (e) {
                result.status = 400;
                result.errors.push("Error creating order", e)
            }
            try{
                await newOrders.save(); //Save the branch to mongodb
                result.status = 201;
                result.response = newOrders
                result.success = true;
            } catch (e) {
                result.status = 400;
                result.errors.push("Error pushing to database", e);
            }
        } else {
            result.status = 400;
        }
        // Push the data to DB asynchronously (call save() function and handle errors)
        res.status(result.status).json(result); //Return whatever result remains
    }
        */
        
    }
    static async apiPutSensors(req:Request, res: Response, next: NextFunction) {
        
    }
}