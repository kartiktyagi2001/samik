import { Router } from 'express';
import { DemoGroupCtrl, DemoAggrCtrl } from '../controllers/demoController';

const router = Router();
const groupctrl = new DemoGroupCtrl();
const aggrctrl = new DemoAggrCtrl();


router.get('/', groupctrl.getAllGroups.bind(groupctrl));
router.post('/', groupctrl.createGroup.bind(groupctrl));
router.get('/:id', groupctrl.getGroupById.bind(groupctrl));
router.post('/:id/apis', groupctrl.addApiToGroup.bind(groupctrl));
router.delete('/:groupId/apis/:apiId', groupctrl.removeApiFromGroup.bind(groupctrl));
router.delete('/:id', groupctrl.deleteGroup.bind(groupctrl));
router.get('/aggregate/:groupName', aggrctrl.aggregateGroup.bind(aggrctrl));
router.post('/test', aggrctrl.testApi.bind(aggrctrl));


export default router;