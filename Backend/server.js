import express from 'express';
import auth from './routes/auth.router.js';
import api from './routes/api.router.js';
import verifyJWT from './middleware/verifyJWT.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', auth);
app.get('/api', verifyJWT, api);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Pagina non trovata!' });
});

app.listen(PORT, () => console.log('Server Avviato alla Porta ' + PORT));
