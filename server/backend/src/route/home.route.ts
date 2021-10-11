import express from 'express';
import homeCtrl from '../api/home';
const router = express.Router();

router.route('/')
    .get(homeCtrl.apiGetHome)
    .post(homeCtrl.apiPostHome)
    .put(homeCtrl.apiPutHome)

export default router;
