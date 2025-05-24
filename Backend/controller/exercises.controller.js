import pool from './database.js';

const getExercises = async (req, res) => {
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
        const [exercises] =
            (await pool.query(`SELECT * FROM exercises WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni esercizio controllo che l'id dello user corrisponda
        const check = exercises.every((w) => w.userId == id || w.userId == 0);

        if (check) {
            // Risposta con dati richiesti
            return res.status(200).json({ success: true, data: exercises });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Esercizi privati o non disponibili!',
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

const postExercise = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{name:"name", type:"type"} }
        const { name, type } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!name || !type)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Effettuo la query di inserimento
        await pool.query(
            `INSERT INTO exercises (name, type, userId) VALUES (?, ?, ?)`,
            [name, type, id]
        );

        // Restituisco messaggio di conferma
        res.status(200).json({
            success: true,
            message: 'Esercizio creato correttamente!',
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

const putExercise = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{name:"name", type:"type"} }
        const { identificative, field } = req.body.where;
        const { name, type } = req.body.data;
        const { id } = req.user;

        // Inizializzazione liste
        const updates = [];
        const values = [];

        // Logica per inserimento dati nella query
        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (type) {
            updates.push('type = ?');
            values.push(type);
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

        // Esecuzione query per ricavare lo user id degli esercizi
        const [exercise] =
            (await pool.query(`SELECT userId FROM exercises WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Controllo che gli id dello user corrispondano
        if (exercise[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(
                `UPDATE exercises SET ${updates.join(', ')} WHERE ?? = ?`,
                values
            );

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Esercizio aggiornato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Esercizio privato o non disponibile!',
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

const deleteExercise = async (req, res) => {
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
        const [exercise] =
            (await pool.query('SELECT userId FROM exercises WHERE ?? = ?', [
                field,
                identificative,
            ])) || [];

        // Controllo che gli id dello user corrispondano
        if (exercise[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM exercises WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Esercizio eliminato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Esercizio privato o non disponibile!',
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

export { getExercises, postExercise, putExercise, deleteExercise };
