import express from 'express';
import 'dotenv/config';
import routes from './routes/objetos.mjs';
import path from 'node:path';

const app = express();

// Setters
app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');
app.set('PORT', process.env.PORT || 6972);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // si vas a manejar JSON
app.use(express.static(path.resolve('./public'))); // servir CSS/JS
app.use('/objetos', routes);

// Start the server
app.listen(app.get('PORT'), () =>
  console.log(`Server is running at http://localhost:${app.get('PORT')}`)
);
