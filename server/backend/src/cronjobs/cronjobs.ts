import intruderCompress from "./intruderCompress";
import cron from "node-cron";
import sensorsCompress from "./sensorsCompress";

const cronjobs = () => {
	cron.schedule('* * * * *', () => {
		// intruderCompress();
		sensorsCompress();
	});
}
export default cronjobs;