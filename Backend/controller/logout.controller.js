import db from '../database/crud/db.function.js';
import dotenv from 'dotenv';
dotenv.config();

const logout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt)
            return res
                .status(200)
                .json({ success: true, message: 'Login non effettuato' });

        const token = cookies.jwt;
        const user = await db.getUser(token, 'refreshToken');

        if (!user) {
            res.clearCookie('jwt', {
                sameSite: 'None',
                secure: true,
                httpOnly: true,
            });
            return res
                .status(200)
                .json({ success: true, message: 'Login non effettuato' });
        }

        await db.updateUser(user.id, null, 'refreshToken');
        res.clearCookie('jwt', {
            secure: true,
            sameSite: 'None',
            httpOnly: true,
        });
        return res
            .status(200)
            .json({ success: true, message: 'Logout avvenuto con successo' });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Errore interno del Server',
        });
    }
};

export default logout;
