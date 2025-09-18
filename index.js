import express from 'express';
import dotenv from 'dotenv';
import rutaAutor from './routes/rutaAutor.mjs'
import rutaCanciones from './routes/rutaCanciones.mjs'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6972;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect DB
import './drivers/connect-db.mjs'

app.use('/autor', rutaAutor);
app.use('/canciones', rutaCanciones);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});