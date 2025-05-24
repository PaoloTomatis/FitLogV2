import pool from './database.js';

const getDays = async (req, res) => {
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
        const [days] =
            (await pool.query(`SELECT * FROM days WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Per ogni giorno controllo che l'id dello user corrisponda
        const check = days.every((w) => w.userId == id);

        if (check) {
            // Risposta con dati richiesti
            return res.status(200).json({ success: true, data: days });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                data: [],
                message: 'Giorno privato o non disponibile!',
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

const postDay = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ data:{notes:"notes", date:"YYYY-MM-DD"} }
        const { notes, date } = req.body.data;
        const { id } = req.user;

        // Controllo i dati ricevuti
        if (!date || !notes)
            return res.status(400).json({
                success: false,
                message: 'Dati mancanti!',
            });

        // Ricavo i giorni con la stessa data
        const [days] =
            (await pool.query(`SELECT * FROM days WHERE date = ?`, [date])) ||
            [];

        if (!days) {
            // Effettuo la query di inserimento
            await pool.query(
                `INSERT INTO days (date, notes, userId) VALUES (?, ?, ?)`,
                [date, notes, id]
            );

            // Restituisco messaggio di conferma
            res.status(200).json({
                success: true,
                message: 'Giorno aggiunto correttamente!',
            });
        } else {
            // Restituisco messaggio con errore
            res.status(409).json({
                success: false,
                message: 'Giorno già esistente!',
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

const putDay = async (req, res) => {
    try {
        // Ricevo dati dalla richiesta
        // body={ where:{identificative:2, field:"id"}, data:{date:"YYYY-MM-DD", notes:"notes"} }
        const { identificative, field } = req.body.where;
        const { date, notes } = req.body.data;
        const { id } = req.user;

        // Inizializzazione liste
        const updates = [];
        const values = [];

        // Logica per inserimento dati nella query
        if (date) {
            updates.push('date = ?');
            values.push(date);
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

        // Esecuzione query per ricavare lo user id dei giorni
        const [days] =
            (await pool.query(`SELECT userId FROM days WHERE ?? = ?`, [
                field,
                identificative,
            ])) || [];

        // Controllo che gli id dello user corrispondano
        if (days[0]?.userId == id) {
            // Esecuzione query di aggiornamento
            await pool.query(
                `UPDATE days SET ${updates.join(', ')} WHERE ?? = ?`,
                values
            );

            // Risposta di conferma
            res.status(200).json({
                success: true,
                message: 'Giorno aggiornato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Giorno privato o non disponibile!',
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

const deleteDay = async (req, res) => {
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

        // Esecuzione query per ricavare l'id utente del giorno che si vuole eliminare
        const [days] =
            (await pool.query('SELECT userId FROM days WHERE ?? = ?', [
                field,
                identificative,
            ])) || [];

        // Controllo che gli id dello user corrispondano
        if (days[0]?.userId == id) {
            // Esecuzione query di eliminazione
            await pool.query(`DELETE * FROM days WHERE ?? = ?`, [
                field,
                identificative,
            ]);

            // Risposta di conferma
            return res.status(200).json({
                success: true,
                message: 'Giorno eliminato correttamente!',
            });
        } else {
            // Risposta con errore
            return res.status(403).json({
                success: false,
                message: 'Giorno privato o non disponibile!',
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

export { getDays, postDay, putDay, deleteDay };
