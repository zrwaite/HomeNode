import express from 'express';
import tokenCtrl from '../auth/token';
import signinCtrl from '../auth/signin';
import signupCtrl from '../auth/signup';
const router = express.Router();

router.route('/token')
    .post(tokenCtrl)

router.route('/signin')
    .post(signinCtrl)

router.route('/signup')
	.post(signupCtrl)

export default router;
