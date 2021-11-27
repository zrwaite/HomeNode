import intruderCompress from "./intruderCompress";
import cron from "node-cron";
import sensorsCompress from "./sensorsCompress";
import {sensorsModule, plantsModule, intrudersModule, allModules} from "./modules"



const cronjobs = () => {
	let obj = {
		temperature : 69,
		humidity : 32,
		light : 12,
		moisture : 44,
		waterCount : 3,
		alert : 4	
	}
	cron.schedule('* * * * *', () => {

		// console.log("output")
		// Object.assign(obj, allModules(obj))
		// console.log(obj)
		console.log("output")
		Object.assign(obj, sensorsModule(obj))
		//console.log(obj)
		//console.log("plants")
		Object.assign(obj, plantsModule(obj))
		//console.log(obj)
		//console.log("intruders")
		Object.assign(obj, intrudersModule(obj))
		console.log(obj)
		
	});
}
export default cronjobs;