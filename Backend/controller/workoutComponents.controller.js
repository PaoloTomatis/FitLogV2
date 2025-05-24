import pool from './database.js';

const getWorkoutComponents = async (req, res) => {
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
        const [workoutComponents] =
            (await pool.query(`SELECT * FROM workoutComponents WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni componente controllo che l'id dello user corrisponda
        const check = !workoutComponents.every(
            (w) => w.userId == id || w.userId == 0
        );

        if (check) {
            // Risposta con dati richiesti
            return res
                .status(200)
                .json({ success: true, data: workoutComponents });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Componenti privati o non disponibili!',
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

const postWorkoutComponent = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{presetId:96, exerciseId:46, order:2} }
        const { presetId, exerciseId, order } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!presetId || !exerciseId || !order)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Effettuo la query di inserimento
        await pool.query(
            `INSERT INTO workoutComponents (presetId, exerciseId, order, userId) VALUES (?, ?, ?, ?)`,
            [presetId, exerciseId, order, id]
        );

        // Restituisco messaggio di conferma
        res.status(200).json({
            success: true,
            message: 'Componente creato correttamente!',
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

const putWorkoutComponent = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{presetId:96, exerciseId:46, order:2} }
        const { identificative, field } = req.body.where;
        const { presetId, exerciseId, order } = req.body.data;
        const { id } = req.user;

        // Inizializzazione liste
        const updates = [];
        const values = [];

        // Logica per inserimento dati nella query
        if (presetId) {
            updates.push('presetId = ?');
            values.push(presetId);
        }
        if (exerciseId) {
            updates.push('exerciseId = ?');
            values.push(exerciseId);
        }
        if (order) {
            updates.push('order = ?');
            values.push(order);
        }

        // Controllo dati ricevuti
        if (values.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });
        }
        if (!identificative || !field)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        values.push(field);
        values.splice(updates.length - 1, 0, field);

        // Esecuzione query per ricavare il componente
        const [workoutComponents] = await pool.query(
            `SELECT userId FROM workoutComponents WHERE ?? = ?`,
            [field, identificative]
        );

        // Controllo che gli id dello user corrispondano
        if (workoutComponents[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(
                `UPDATE workoutComponents SET ${updates.join(
                    ', '
                )} WHERE ?? = ?`,
                values
            );

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Componente aggiornato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Componente privato o non disponibile!',
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

const deleteWorkoutComponent = async (req, res) => {
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

        // Esecuzione query per ricavare l'id utente dell'esercizio che si vuole eliminare
        const [workoutComponents] =
            (await pool.query(
                'SELECT userId FROM workoutComponents WHERE ?? = ?',
                [field, identificative]
            )) || [];

        // Controllo che gli id dello user corrispondano
        if (workoutComponents[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM workoutComponents WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Componente eliminato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Componente privato o non disponibile!',
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
    getWorkoutComponents,
    postWorkoutComponent,
    putWorkoutComponent,
    deleteWorkoutComponent,
};
