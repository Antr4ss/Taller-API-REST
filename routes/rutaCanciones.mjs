import express from 'express';
import { authenticateToken } from '../middlewares/auth.mjs';
import{
  save, findAll, findById, findByAutor, deleteSong, update
} from './../controllers/controll-canciones.mjs';

const router = express.Router();

// Aplicar autenticación JWT a todas las rutas
router.use(authenticateToken);

router.get('/', findAll);
router.get('/:id', findById);
router.get('/autor/:autorId', findByAutor);
router.post('/', save);
router.put('/:id', update);
router.delete('/:id', deleteSong);

export default router;