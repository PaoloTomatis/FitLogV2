import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../utils/SidebarContext';

function Workouts() {
    const links = useSidebar();
    return <Sidebar links={links} />;
}

export default Workouts;
