import express from 'express';
import tokenCtrl from '../auth/token';
import signinCtrl from '../auth/signin';
const router = express.Router();

router.route('/token')
    .post(tokenCtrl)

router.route('/signin')
    .post(signinCtrl)

export default router;
