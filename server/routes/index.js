import {Router} from 'express';
const router = Router();
import {home} from '../api/index.js';
// router.get('/login',  findOneOrCreate)
router.get('/login',  home)
export default router;