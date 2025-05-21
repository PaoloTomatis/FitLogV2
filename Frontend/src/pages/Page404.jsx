import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../utils/SidebarContext';

function Page404() {
    const links = useSidebar();
    return <Sidebar links={links} />;
}

export default Page404;
