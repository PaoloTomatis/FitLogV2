import { Router } from 'express';

import exercises from './api/exercises.router.js';
import exerciseWeights from './api/exerciseWeights.router.js';
import workoutComponents from './api/workoutComponents.router.js';
import workoutPresets from './api/workoutPresets.router.js';
import weight from './api/weight.router.js';
import workoutSessions from './api/workoutSessions.router.js';
import days from './api/days.router.js';
import user from './api/user.router.js';

const router = Router();

router
    .use('/exercises', exercises)
    .use('/exerciseWeights', exerciseWeights)
    .use('/workoutComponents', workoutComponents)
    .use('/workoutPresets', workoutPresets)
    .use('/weight', weight)
    .use('/workoutSessions', workoutSessions)
    .use('/days', days)
    .use('/user', user);

export default router;
