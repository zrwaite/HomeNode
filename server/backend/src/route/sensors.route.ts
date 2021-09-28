import express from 'express';
import sensorsCtrl from '../api/sensors';
const router = express.Router();

router.route('/')
    .get(sensorsCtrl.apiGetSensors)

export default router;