import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.mjs';
import rutaAuth from './routes/rutaAuth.mjs';
import rutaAutor from './routes/rutaAutor.mjs';
import rutaCanciones from './routes/rutaCanciones.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6972;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect DB
import './drivers/connect-db.mjs'

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API de Música - Documentación'
}));

// Rutas
app.use('/auth', rutaAuth);
app.use('/autor', rutaAutor);
app.use('/canciones', rutaCanciones);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'API de Música - Parcial EJS',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            autores: '/autor',
            canciones: '/canciones'
        }
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});