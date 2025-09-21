import { Router } from 'express';
import { GroupController } from '../controllers/groupController';

const router = Router();
const ctrl = new GroupController();

router.get('/playground', ctrl.getAllGroups.bind(ctrl));
router.get('/test', ctrl.getAllGroups.bind(ctrl));


export default router;