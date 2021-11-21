import express from 'express';
import homeCtrl from '../api/home';
import intrudersCtrl from '../api/intruders';
import sensorsCtrl from '../api/sensors';
import userCtrl from '../api/user';
const router = express.Router();

router.route('/home')
    .get(homeCtrl.apiGetHome)
    .post(homeCtrl.apiPostHome)
    .put(homeCtrl.apiPutHome)
    .delete(homeCtrl.apiDeleteHome)

router.route('/intruders')
	.get(intrudersCtrl.apiGetIntruders)
	.post(intrudersCtrl.apiPostIntruders)
	.put(intrudersCtrl.apiPutIntruders)
	.delete(intrudersCtrl.apiDeleteIntruders)

router.route('/sensors')
    .get(sensorsCtrl.apiGetSensors)
    .post(sensorsCtrl.apiPostSensors)
    .put(sensorsCtrl.apiPutSensors)
    .delete(sensorsCtrl.apiDeleteSensors)

router.route('/user')
    .get(userCtrl.apiGetUser)
    .post(userCtrl.apiPostUser)
    .put(userCtrl.apiPutUser)

export default router;
