import pool from './database.js';

const getWorkoutPresets = async (req, res) => {
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
        const [workoutPresets] =
            (await pool.query(`SELECT * FROM workoutPresets WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni componente controllo che l'id dello user corrisponda
        const check = !workoutPresets.every(
            (w) => w.userId == id || w.userId == 0
        );

        if (check) {
            // Risposta con dati richiesti
            return res
                .status(200)
                .json({ success: true, data: workoutPresets });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Preset privati o non disponibili!',
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

const postWorkoutPreset = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{name:"name", description:"description"} }
        const { name, description } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!name || !description)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Effettuo la query di inserimento
        await pool.query(
            `INSERT INTO workoutPresets (name, description, userId) VALUES (?, ?, ?)`,
            [name, description, id]
        );

        // Restituisco messaggio di conferma
        res.status(200).json({
            success: true,
            message: 'Preset creato correttamente!',
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

const putWorkoutPreset = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{name:"name", description:"description"} }
        const { identificative, field } = req.body.where;
        const { name, description } = req.body.data;
        const { id } = req.user;

        // Inizializzazione liste
        const updates = [];
        const values = [];

        // Logica per inserimento dati nella query
        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (description) {
            updates.push('description = ?');
            values.push(description);
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

        // Esecuzione query per ricavare il preset
        const [workoutPresets] = await pool.query(
            `SELECT userId FROM workoutPresets WHERE ?? = ?`,
            [field, identificative]
        );

        // Controllo che gli id dello user corrispondano
        if (workoutPresets[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(
                `UPDATE workoutPresets SET ${updates.join(', ')} WHERE ?? = ?`,
                values
            );

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Preset aggiornato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Preset privato o non disponibile!',
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

const deleteWorkoutPreset = async (req, res) => {
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
        const [workoutPresets] =
            (await pool.query(
                'SELECT userId FROM workoutPresets WHERE ?? = ?',
                [field, identificative]
            )) || [];

        // Controllo che gli id dello user corrispondano
        if (workoutPresets[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM workoutPresets WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Preset eliminato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Preset privato o non disponibile!',
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
    getWorkoutPresets,
    postWorkoutPreset,
    putWorkoutPreset,
    deleteWorkoutPreset,
};
