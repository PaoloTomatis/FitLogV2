import pool from './database.js';

const getExerciseWeights = async (req, res) => {
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
        const [exerciseWeights] =
            (await pool.query(`SELECT * FROM exerciseWeight WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni carico pesi controllo che l'id dello user corrisponda
        const check = exerciseWeights.every((w) => w.userId == id);

        if (check) {
            // Risposta con dati richiesti
            return res
                .status(200)
                .json({ success: true, data: exerciseWeights });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Carichi esercizi privati o non disponibili!',
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

const postExerciseWeight = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{exerciseId:3, sessionId:7, weight:68.94} }
        const { exerciseId, sessionId, weight } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!exerciseId || !sessionId || !weight)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Effettuo la query di inserimento
        await pool.query(
            `INSERT INTO exerciseWeight (exerciseId, sessionId, weight, userId) VALUES (?, ?, ?, ?)`,
            [exerciseId, sessionId, weight, id]
        );

        // Restituisco messaggio di conferma
        res.status(200).json({
            success: true,
            message: 'Carico esercizi aggiunto correttamente!',
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

const putExerciseWeight = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{exerciseId:43, sessionId:63, weight:24.43} }
        const { identificative, field } = req.body.where;
        const { exerciseId, sessionId, weight } = req.body.data;
        const { id } = req.user;

        // Inizializzazione liste
        const updates = [];
        const values = [];

        // Logica per inserimento dati nella query
        if (exerciseId) {
            updates.push('exerciseId = ?');
            values.push(exerciseId);
        }
        if (sessionId) {
            updates.push('sessionId = ?');
            values.push(sessionId);
        }
        if (weight) {
            updates.push('weight = ?');
            values.push(weight);
        }

        // Controllo dati ricevuti
        if (values.length === 0 || !identificative || !field) {
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });
        }

        values.push(field);
        values.splice(updates.length - 1, 0, field);

        // Esecuzione query per ricavare lo user id dei carichi pesi
        const [exerciseWeights] =
            (await pool.query(
                `SELECT userId FROM exerciseWeights WHERE ?? = ?`,
                [field, identificative]
            )) || [];

        // Controllo che gli id dello user corrispondano
        if (exerciseWeights[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(
                `UPDATE exerciseWeight SET ${updates.join(', ')} WHERE ?? = ?`,
                values
            );

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Carico esercizio aggiornato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Carico esercizio privato o non disponibile!',
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

const deleteExerciseWeight = async (req, res) => {
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

        // Esecuzione query per ricavare l'id utente del carico pesi che si vuole eliminare
        const [exerciseWeight] =
            (await pool.query(
                'SELECT userId FROM exerciseWeights WHERE ?? = ?',
                [field, identificative]
            )) || [];

        // Controllo che gli id dello user corrispondano
        if (exerciseWeight[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM exerciseWeights WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Carico pesi eliminato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Carico pesi privato o non disponibile!',
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

export {
    getExerciseWeights,
    postExerciseWeight,
    putExerciseWeight,
    deleteExerciseWeight,
};
