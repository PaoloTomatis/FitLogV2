import React, { useEffect, useState } from 'react';
import '../styles/login-form.css';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm(props) {
    const [type, setType] = useState(props.type || 'signup');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        identificative: '',
    });
    const navigate = useNavigate();

    const welcomeTxt = type === 'login' ? 'Ben Ritornato!' : 'Benvenuto!';

    const { login, register } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log([formData.identificative, formData.password]);

            const result = await login(
                formData.identificative,
                formData.password
            );
            setFormData({
                username: '',
                email: '',
                password: '',
                identificative: '',
            });

            if (result) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log([formData.identificative, formData.password]);
            const result = await register(
                formData.username,
                formData.email,
                formData.password
            );
            setFormData({
                username: '',
                email: '',
                password: '',
                identificative: '',
            });
            if (result) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const toggleType = (e) => {
        e.preventDefault();
        setType((prev) => (prev === 'login' ? 'signup' : 'login'));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form
            onSubmit={type === 'login' ? handleLogin : handleRegister}
            className="login-form"
        >
            <h2 className="form-tit">{welcomeTxt}</h2>

            {type === 'login' ? (
                <input
                    onChange={handleChange}
                    type="text"
                    name="identificative"
                    placeholder="Inserisci Email/Username"
                    className="txt-input"
                    value={formData.identificative}
                />
            ) : (
                <>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="username"
                        placeholder="Inserisci Username"
                        className="txt-input"
                        value={formData.username}
                    />
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Inserisci Email"
                        className="txt-input"
                        value={formData.email}
                    />
                </>
            )}

            <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Inserisci Password"
                className="txt-input"
                value={formData.password}
            />

            <button type="submit" className="submit-btn">
                Invia
            </button>

            <p className="form-txt">
                {type === 'login'
                    ? 'Non hai ancora un account? '
                    : 'Hai già un account? '}
                <a href="#" onClick={toggleType}>
                    {type === 'login' ? 'Registrati' : 'Accedi'}
                </a>{' '}
                ora!
            </p>
        </form>
    );
}

export default LoginForm;
