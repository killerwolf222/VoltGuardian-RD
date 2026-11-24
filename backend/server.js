const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const incidentesRoutes = require('./routes/incidentesRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/incidentes', incidentesRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API VoltGuardian RD',
        estado: 'Activo'
    });
});

app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.json({
            servidor: 'Conectado',
            baseDatos: 'Conectada'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error de conexión',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
}

module.exports = app;