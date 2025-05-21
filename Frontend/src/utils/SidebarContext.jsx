import React, { createContext, useContext } from 'react';
import dashboardIcon from '../assets/dashboard-icon.png';
import weightIcon from '../assets/weight-icon.png';
import calendarIcon from '../assets/calendar-icon.png';
import exercisesIcon from '../assets/exercises-icon.png';
import workoutsIcon from '../assets/workouts-icon.png';

const SidebarContext = createContext();

const links = [
    { text: 'Dashboard', url: '/', img: dashboardIcon },
    { text: 'Peso Corporeo', url: '/weight', img: weightIcon },
    { text: 'Allenamenti', url: '/workouts', img: workoutsIcon },
    { text: 'Esercizi', url: '/exercises', img: exercisesIcon },
    { text: 'Calendario', url: '/calendar', img: calendarIcon },
];

function SidebarProvider({ children }) {
    return (
        <SidebarContext.Provider value={links}>
            {children}
        </SidebarContext.Provider>
    );
}

function useSidebar() {
    return useContext(SidebarContext);
}

export { SidebarProvider, useSidebar };
