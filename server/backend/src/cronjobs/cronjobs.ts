import intruderCompress from "./intruderCompress";
import cron from "node-cron";
import sensorsCompress from "./sensorsCompress";

const cronjobs = () => {
	cron.schedule('*/5 * * * *', () => {
		//intruderCompress();
		//sensorsCompress();
	});
}
export default cronjobs;