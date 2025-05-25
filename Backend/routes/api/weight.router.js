import { Router } from 'express';
import {
    deleteWeight,
    getWeights,
    postWeight,
    putWeight,
} from '../../controller/weight.controller.js';
const router = Router();

router
    .get('/', getWeights)
    .post('/', postWeight)
    .put('/', putWeight)
    .delete('/', deleteWeight);

export default router;
