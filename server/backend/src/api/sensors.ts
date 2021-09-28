import {Request, Response, NextFunction} from 'express';
import response from '../models/response'; //Created pre-formatted uniform response
import Sensors from '../models/sensors';

/* register controller */
export default class sensorsController {
    static async apiGetSensors(req:Request, res: Response, next: NextFunction) {
        let result = new response();
        // search if the project already exsisted (call findOne function)
        let sensors;
        if (req.query.id === undefined) {
            try{
                sensors = await Sensors.find({});
                result.connected = true;
            } catch (e: any) {
                result.status = 400;
                result.errors.push("Sensors not found", e);
            }
        } else {
            try{
                sensors = await Sensors.findById(req.query.id);
                result.connected = true;
            } catch (e: any) {
                result.status = 400;
                result.errors.push("ID Error", e);
            }
        }
        if (result.connected){
            if (sensors == null) {
                result.status = 404;
                result.errors.push('Sensor not found');
            } else{
                result.status = 200;
                result.success = true;
                result.response = {"sensors": sensors};
            }
        }
        res.status(result.status).json(result); //Return whatever result remains
    }
}