import {Router} from 'express';
const router = Router();
import {checkAccountValid, findOneOrCreate, userInfo} from '../api/index.js';
router.post('/register',  findOneOrCreate)
router.post('/login',  checkAccountValid)
router.get('/user',  userInfo).post('/user',  userInfo)
export default router;