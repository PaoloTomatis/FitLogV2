import pool from '../database/database.js';

const getUser = async (req, res) => {
    try {
        // Ricevo i dati dalla richiesta
        const user = req.user;

        // Risposta con dati richiesti
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        // Restituisco eventuali errori
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Errore interno del Server',
        });
    }
};

export { getUser };
