import express from 'express';
import { authenticateToken } from '../middlewares/auth.mjs';
import{
  findAll, findById, save, update, deleteAutor
} from '../controllers/controll-autor.mjs';

const router = express.Router();

// Aplicar autenticación JWT a todas las rutas
router.use(authenticateToken);

router.get('/', findAll);
router.get('/:id', findById);
router.post('/', save);
router.put('/:id', update);
router.delete('/:id', deleteAutor);

export default router;