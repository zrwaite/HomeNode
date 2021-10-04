import express from 'express';
import sensorsCtrl from '../api/sensors';
const router = express.Router();

router.route('/')
    .get(sensorsCtrl.apiGetSensors)
    .post(sensorsCtrl.apiPostSensors)
    .put(sensorsCtrl.apiPutSensors)

export default router;