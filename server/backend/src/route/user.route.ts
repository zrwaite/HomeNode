import express from 'express';
import userCtrl from '../api/user';
const router = express.Router();

router.route('/')
    .get(userCtrl.apiGetUser)
    .post(userCtrl.apiPostUser)
    .put(userCtrl.apiPutUser)

export default router;
