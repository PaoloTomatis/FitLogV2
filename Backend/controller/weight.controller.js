import pool from './database.js';

const getWeights = async (req, res) => {
    try {
        // Ricevo i dati dalla richiesta
        const { identificative, field } = req.body;
        const { id } = req.user;

        // Check dei dati
        if (!identificative || !field)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Richiedo i dati al database
        const [weights] =
            (await pool.query(`SELECT * FROM weights WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni peso controllo che l'id dello user corrisponda
        const check = weights.every((w) => w.userId == id);

        if (check) {
            // Risposta con dati richiesti
            return res.status(200).json({ success: true, data: weights });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Peso Corporeo privato o non disponibile!',
            });
        }
    } catch (error) {
        // Restituisco eventuali errori
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Errore interno del Server',
        });
    }
};

const postWeight = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{weight:59.80} }
        const { weight } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!weight)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Effettuo la query di inserimento
        await pool.query(`INSERT INTO weights (weight, userId) VALUES (?, ?)`, [
            weight,
            id,
        ]);

        // Restituisco messaggio di conferma
        res.status(200).json({
            success: true,
            message: 'Peso Corporeo aggiunto correttamente!',
        });
    } catch (error) {
        // Restituisco eventuali errori
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Errore interno del Server',
        });
    }
};

const putWeight = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{name:"name", description:"description"} }
        const { identificative, field } = req.body.where;
        const { weight } = req.body.data;
        const { id } = req.user;

        // Controllo dati ricevuti
        if (!weight || !identificative || !field) {
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });
        }

        // Esecuzione query per ricavare lo user id dei pesi
        const [weights] =
            (await pool.query(`SELECT userId FROM weights WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Controllo che gli id dello user corrispondano
        if (weights[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(`UPDATE weights SET weight = ? WHERE ?? = ?`, [
                weight,
                field,
                identificative,
            ]);

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Peso Corporeo aggiornato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Peso Corporeo privato o non disponibile!',
            });
        }
    } catch (error) {
        // Restituisco eventuali errori
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Errore interno del Server',
        });
    }
};

const deleteWeight = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        const { identificative, field } = req.body;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!identificative || !field)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Esecuzione query per ricavare l'id utente del peso che si vuole eliminare
        const [weights] =
            (await pool.query('SELECT userId FROM weights WHERE ?? = ?', [
                field,
                identificative,
            ])) || [];

        // Controllo che gli id dello user corrispondano
        if (weights[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM weights WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Peso Corporeo eliminato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Peso Corporeo privato o non disponibile!',
            });
        }
    } catch (error) {
        // Restituisco eventuali errori
        console.error(error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Errore interno del Server',
        });
    }
};

export { getWeights, postWeight, putWeight, deleteWeight };
