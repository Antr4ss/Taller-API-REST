import express from 'express';
import{
  save, findAll, findByAutor, deleteSong, update
} from './../controllers/controll-canciones.mjs';

const router = express.Router();

router.get('/', findAll);
router.get('/:autorId', findByAutor);
router.post('/', save);
// router.put('/:idCancion', update)
router.delete('/:id', deleteSong);

export default router;