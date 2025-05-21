import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../utils/SidebarContext';
import LoginForm from '../components/LoginForm';
import { useParams } from 'react-router-dom';

function Login() {
    const links = useSidebar();
    const typeParam = useParams().type;
    const type = typeParam
        ? parseInt(typeParam) === 1
            ? 'login'
            : 'signup'
        : 'signup';
    return (
        <>
            <Sidebar links={links} />
            <LoginForm type={type} />
        </>
    );
}

export default Login;
