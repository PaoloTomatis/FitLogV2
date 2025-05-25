import { Router } from 'express';
import {
    deleteWorkoutComponent,
    getWorkoutComponents,
    postWorkoutComponent,
    putWorkoutComponent,
} from '../../controller/workoutComponents.controller.js';
const router = Router();

router
    .get('/', getWorkoutComponents)
    .post('/', postWorkoutComponent)
    .put('/', putWorkoutComponent)
    .delete('/', deleteWorkoutComponent);

export default router;
