import bcrypt from "bcrypt";
import db from "../database/db.function.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

const login = async (req, res) => {
    try {
        const { identificative, psw } = req.body;
        if (!psw || !identificative) return res.status(400).json({ "success": false, "message": "Password e Identificativo sono richiesti" });

        const user = identificative.includes("@") ? await db.getUser(identificative, "email") : await db.getUser(identificative, "username");
        const verifyPsw = !user ? false : await bcrypt.compare(psw, user.psw);

        if (!verifyPsw || !user) return res.status(401).json({ "success": false, "message": "Identificativo o Password errati" });

        const accessToken = jwt.sign(
            { "username": user.username, "email": user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );

        const refreshToken = jwt.sign(
            { "username": user.username, "email": user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        await db.updateUser(user.id, refreshToken, "refreshToken");

        res.cookie("jwt", refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "None" });
        res.status(200).json({ "success": true, "data": accessToken });

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ "success": false, "message": error.message || "Internal Server Error" });
    }
};

export default login;