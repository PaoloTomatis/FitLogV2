import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [logged, setLogged] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('logged');
        if (saved === 'true') {
            setLogged(true);
        }
    }, []);

    const login = async (identificative, psw) => {
        try {
            const call1 = await fetch('http://localhost:3000/auth/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identificative: identificative,
                    psw: psw,
                }),
            });
            const result1 = await call.json();
            if (!call1.ok) throw new Error(result1.message);

            //! MANCA L'INVIO DEL TOKEN
            //! MANCA L'API
            const call2 = await fetch(
                `http://localhost:3000/api/user/${identificative}`,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identificative: identificative,
                        psw: psw,
                    }),
                }
            );
            const result2 = await call2.json();
            if (!call2.ok) throw new Error(result2.message);

            setLogged(true);
            setToken(result1.data);
            setUser(result2.data);
            localStorage.setItem('logged', 'true');
        } catch (error) {
            console.error(error.message);
        }
    };

    const register = async (username, email, psw) => {
        try {
            const call = await fetch('http://localhost:3000/auth/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    psw: psw,
                }),
            });
            const result = await call.json();
            if (!call.ok) throw new Error(result.message);
        } catch (error) {
            console.error(error.message);
        }
    };

    const logout = async () => {
        try {
            const call = await fetch('http://localhost:3000/auth/logout');

            const result = await call.json();

            if (!call.ok) throw new Error(result.message);

            setLogged(false);
            setToken(null);
            setUser(null);
            localStorage.removeItem('logged');
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{ logged, token, user, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
