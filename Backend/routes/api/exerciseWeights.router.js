import { Router } from 'express';
import {
    deleteExerciseWeight,
    getExerciseWeights,
    postExerciseWeight,
    putExerciseWeight,
} from '../../controller/exerciseWeights.controller.js';
const router = Router();

router
    .get('/', getExerciseWeights)
    .post('/', postExerciseWeight)
    .put('/', putExerciseWeight)
    .delete('/', deleteExerciseWeight);

export default router;
