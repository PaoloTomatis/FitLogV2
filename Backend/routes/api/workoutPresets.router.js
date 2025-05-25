import { Router } from 'express';
import {
    deleteWorkoutPreset,
    getWorkoutPresets,
    postWorkoutPreset,
    putWorkoutPreset,
} from '../../controller/workoutPresets.controller.js';
const router = Router();

router
    .get('/', getWorkoutPresets)
    .post('/', postWorkoutPreset)
    .put('/', putWorkoutPreset)
    .delete('/', deleteWorkoutPreset);

export default router;
