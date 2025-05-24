import { Router } from 'express';

import exercises from './api/exercises.router.js';
import exerciseWeights from './api/exerciseWeights.router.js';
import workoutComponents from './api/workoutComponents.router.js';
import workoutPresets from './api/workoutPresets.router.js';
import weight from './api/weight.router.js';
import workoutSessions from './api/workoutSessions.router.js';
import days from './api/days.router.js';

const router = Router();

router
    .use('/exercises')
    .use('/exerciseWeights')
    .use('/workoutComponents')
    .use('/workoutPresets')
    .use('/weight')
    .use('/workoutSessions')
    .use('/days');

export default router;
