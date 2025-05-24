import db from '../database/db.function.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const verifyJWT = (req, res, next) => {
    const accessToken = !req.headers['authorization']
        ? null
        : req.headers['authorization'].split(' ')[1];
    if (!accessToken)
        return res
            .status(400)
            .json({ success: false, message: 'AccessToken mancante' });
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err)
                return res
                    .status(403)
                    .json({ success: false, message: 'AccessToken invalido' });
            req.user = await db.getUser(decoded.email, 'email');
            next();
        }
    );
};

export default verifyJWT;
