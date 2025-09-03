import { Router } from 'express';
import { AggregateController } from '../controllers/aggregateController';

const router = Router();
const ctrl = new AggregateController();

router.get('/', ctrl.listGroups.bind(ctrl));
router.get('/:groupName', ctrl.aggregateGroup.bind(ctrl));
router.post('/test', ctrl.testApi.bind(ctrl));

export default router;
