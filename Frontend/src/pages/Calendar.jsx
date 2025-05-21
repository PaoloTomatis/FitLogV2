import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../utils/SidebarContext';

function Calendar() {
    const links = useSidebar();
    return <Sidebar links={links} />;
}

export default Calendar;
