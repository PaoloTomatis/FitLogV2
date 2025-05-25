import pool from '../database/database.js';

const getWorkoutSessions = async (req, res) => {
    try {
        // Ricevo i dati dalla richiesta
        const { identificative, field } = req.query;
        const { id } = req.user;

        // Check dei dati
        if (!identificative || !field)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Richiedo i dati al database
        const [workoutSessions] =
            (await pool.query(`SELECT * FROM workoutSessions WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni sessione controllo che l'id dello user corrisponda
        const check = workoutSessions.every((w) => w.userId == id);

        if (check) {
            // Risposta con dati richiesti
            return res
                .status(200)
                .json({ success: true, data: workoutSessions });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Sessione privata o non disponibile!',
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

const postWorkoutSession = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{presetId:59, duration:48.50, notes:"notes"} }
        const { presetId, duration, notes } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!presetId || !duration || !notes)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Effettuo la query di inserimento
        await pool.query(
            `INSERT INTO workoutSessions (presetId, duration, notes, userId) VALUES (?, ?, ?, ?)`,
            [presetId, duration, notes, id]
        );

        // Restituisco messaggio di conferma
        res.status(200).json({
            success: true,
            message: 'Sessione aggiunta correttamente!',
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

const putWorkoutSession = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{presetId:"presetId", duration:"duration", notes:"notes"} }
        const { identificative, field } = req.body.where;
        const { presetId, duration, notes } = req.body.data;
        const { id } = req.user;

        // Inizializzazione liste
        const updates = [];
        const values = [];

        // Logica per inserimento dati nella query
        if (presetId) {
            updates.push('presetId = ?');
            values.push(presetId);
        }
        if (duration) {
            updates.push('duration = ?');
            values.push(duration);
        }
        if (notes) {
            updates.push('notes = ?');
            values.push(notes);
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

        // Esecuzione query per ricavare lo user id delle sessioni
        const [workoutSessions] =
            (await pool.query(
                `SELECT userId FROM workoutSessions WHERE ?? = ?`,
                [field, identificative]
            )) || [];

        // Controllo che gli id dello user corrispondano
        if (workoutSessions[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(
                `UPDATE workoutSessions SET ${updates.join(', ')} WHERE ?? = ?`,
                values
            );

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Sessione aggiornata correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Sessione privata o non disponibile!',
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

const deleteWorkoutSession = async (req, res) => {
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

        // Esecuzione query per ricavare l'id utente della sessione che si vuole eliminare
        const [workoutSessions] =
            (await pool.query(
                'SELECT userId FROM workoutSessions WHERE ?? = ?',
                [field, identificative]
            )) || [];

        // Controllo che gli id dello user corrispondano
        if (workoutSessions[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM workoutSessions WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Sessione eliminata correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Sessione privata o non disponibile!',
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
    getWorkoutSessions,
    postWorkoutSession,
    putWorkoutSession,
    deleteWorkoutSession,
};
