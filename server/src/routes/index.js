import {Router} from 'express';
const router = Router();
import {checkAccountValid, findOneOrCreate, userInfo} from '../api/index.js';
import {getMessages, saveMessages} from '../api/messages/index';
router.post('/register', findOneOrCreate)
router.post('/login',  checkAccountValid)
router.get('/user',  userInfo).post('/user',  userInfo)
router.get('/user/saveMessages',  saveMessages).post('/user/saveMessages',  userInfo)
router.get('/user/getMessages',  getMessages).post('/user/getMessages',  userInfo)
export default router;