import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHero from '../components/DashboardHero';
import { useSidebar } from '../utils/SidebarContext';
import { useAuth } from '../utils/AuthContext';

function Dashboard() {
    const links = useSidebar();
    const { logged } = useAuth();
    return (
        <>
            <Sidebar links={links} />
            {logged ? <h1>LOGGATO</h1> : <DashboardHero />}
        </>
    );
}

export default Dashboard;
