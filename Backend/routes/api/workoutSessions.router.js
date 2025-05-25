import { Router } from 'express';
import {
    deleteWorkoutSession,
    getWorkoutSessions,
    postWorkoutSession,
    putWorkoutSession,
} from '../../controller/workoutSessions.controller.js';
const router = Router();

router
    .get('/', getWorkoutSessions)
    .post('/', postWorkoutSession)
    .put('/', putWorkoutSession)
    .delete('/', deleteWorkoutSession);

export default router;
