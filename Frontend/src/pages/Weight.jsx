import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../utils/SidebarContext';
import { useAuth } from '../utils/AuthContext';

function Weight() {
    const links = useSidebar();
    const { logged } = useAuth();

    if (logged) {
        useEffect(async () => {
            try {
                const result = await fetch(
                    'http://localhost:3000/api/weights/'
                );
            } catch (error) {
                console.error(error.message);
            }
        });

        return (
            <>
                <Sidebar links={links} />
            </>
        );
    }
}

export default Weight;
