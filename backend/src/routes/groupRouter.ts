import { Router } from 'express';
import { GroupController } from '../controllers/groupController';

const router = Router();
const ctrl = new GroupController();

router.get('/', ctrl.getAllGroups.bind(ctrl));
router.post('/', ctrl.createGroup.bind(ctrl));
router.get('/:id', ctrl.getGroupById.bind(ctrl));
router.post('/:id/apis', ctrl.addApiToGroup.bind(ctrl));
router.delete('/:groupId/apis/:apiId', ctrl.removeApiFromGroup.bind(ctrl));
router.delete('/:id', ctrl.deleteGroup.bind(ctrl));

export default router;