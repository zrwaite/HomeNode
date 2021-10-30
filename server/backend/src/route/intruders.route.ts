import express from 'express';
import intrudersCtrl from '../api/intruders';
const router = express.Router();

router.route('/')
    .get(intrudersCtrl.apiGetIntruders)
    .post(intrudersCtrl.apiPostIntruders)
    .put(intrudersCtrl.apiPutIntruders)
    .delete(intrudersCtrl.apiDeleteIntruders)

export default router;
