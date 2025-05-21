import bcrypt from "bcrypt";
import db from "../database/db.function.js"
import dotenv from "dotenv"
dotenv.config();

const register = async (req, res) => {
    try {
        const { username, email, psw } = req.body;

        if (!psw, !username, !email) return res.status(400).json({ "success": false, "message": "Password, Username e Email sono richiesti" });

        const dUsername = await db.getUser(username, "username");
        const dEmail = await db.getUser(email, "email");

        if (dUsername || dEmail) return res.status(409).json({ "success": false, "message": "Username o Email già utilizzati" });

        const hashPsw = await bcrypt.hash(psw, 10);
        const result = await db.addUser(username, email, hashPsw);

        if (result) return res.status(500).json({ "success": false, "message": "Internal Server Error" });

        res.status(201).json({"success": true, "message": "Utente registrato con successo"});
        
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ "success": false, "message": error.message || "Server Internal Error" });
    }
};

export default register;