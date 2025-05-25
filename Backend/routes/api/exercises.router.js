import { Router } from 'express';
import {
    deleteExercise,
    getExercises,
    postExercise,
    putExercise,
} from '../../controller/exercises.controller.js';
const router = Router();

router
    .get('/', getExercises)
    .post('/', postExercise)
    .put('/', putExercise)
    .delete('/', deleteExercise);

export default router;
