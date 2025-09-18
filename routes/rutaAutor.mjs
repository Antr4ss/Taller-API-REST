import express from 'express';

import{
  findAll, findById, save, update, deleteAutor
} from './../controllers/controll-autor.mjs';

const router = express.Router();

router.get('/', findAll);
router.get('/:id', findById);
router.post('/', save);
router.put('/:idAutor', update)
router.delete('/:id', deleteAutor)

export default router;