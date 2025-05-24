import { Router } from 'express';
import {
    deleteDay,
    getDays,
    postDay,
    putDay,
} from '../../controller/days.controller';
const router = Router();

router
    .get('/', getDays)
    .post('/', postDay)
    .put('/', putDay)
    .delete('/', deleteDay);

export default router;
