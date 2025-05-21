import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Page404 from './pages/Page404.jsx';
import Login from './pages/Login.jsx';
import Weight from './pages/Weight.jsx';
import Workouts from './pages/Workouts.jsx';
import Workout from './pages/Workout.jsx';
import Exercises from './pages/Exercises.jsx';
import Exercise from './pages/Exercise.jsx';
import Calendar from './pages/Calendar.jsx';
import AddWorkout from './pages/AddWorkout.jsx';
import Day from './pages/Day.jsx';
import WorkoutRL from './pages/WorkoutRL.jsx';
import './styles/utilities.css';
import { SidebarProvider } from './utils/SidebarContext.jsx';
import { AuthProvider } from './utils/AuthContext.jsx';

const router = createBrowserRouter([
    { path: '/', element: <Dashboard /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/weight', element: <Weight /> },
    { path: '/workouts', element: <Workouts /> },
    { path: '/workout/:id', element: <Workout /> },
    { path: '/exercises', element: <Exercises /> },
    { path: '/exercise/:id', element: <Exercise /> },
    { path: '/calendar', element: <Calendar /> },
    { path: '/day', element: <Day /> },
    { path: '/workout-realtime/:id', element: <WorkoutRL /> },
    { path: '/add-workout', element: <AddWorkout /> },
    { path: '/login/:type', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '*', element: <Page404 /> },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <SidebarProvider>
                <RouterProvider router={router} />
            </SidebarProvider>
        </AuthProvider>
    </StrictMode>
);
