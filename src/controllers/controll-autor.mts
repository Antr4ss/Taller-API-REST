import Autor from "../models/Autor.mjs";
import type { Request, Response } from 'express';

/**
 * @swagger
 * /autor:
 *   get:
 *     summary: Obtener todos los autores
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o apodo
 *     responses:
 *       200:
 *         description: Lista de autores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Autor'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
async function findAll(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const skip = (page - 1) * limit;
        
        let query: any = { isActive: true };
        
        // Búsqueda por nombre o apodo
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { apodo: { $regex: search, $options: 'i' } }
            ];
        }

        const [autores, total] = await Promise.all([
            Autor.find(query)
                .populate('canciones', 'name album duracion')
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            Autor.countDocuments(query)
        ]);

        return res.status(200).json({
            state: true,
            data: autores,
            pagination: {
                page: (page),
                limit: (limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        return res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

/**
 * @swagger
 * /autor/{id}:
 *   get:
 *     summary: Obtener autor por ID
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del autor
 *     responses:
 *       200:
 *         description: Autor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Autor'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function findById(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const result = await Autor.findById(id).populate('canciones', 'name album duracion año');
        if (!result) {
            return res.status(404).json({
                state: false,
                error: "Autor no encontrado"
            });
        }
        return res.status(200).json({
            state: true,
            data: result
        });
    } catch (error: any) {
        return res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

/**
 * @swagger
 * /autor:
 *   post:
 *     summary: Crear nuevo autor
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Autor'
 *     responses:
 *       201:
 *         description: Autor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Autor creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Autor'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
async function save(req: Request, res: Response) {
    try {
        const record = new Autor(req.body);
        const result = await record.save();

        return res.status(201).json({
            state: true,
            message: "Autor creado exitosamente",
            data: result
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                state: false,
                error: Object.values(error.errors).map((e: any)=> e.message).join(', ')
            });
        }
        return res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

/**
 * @swagger
 * /autor/{id}:
 *   put:
 *     summary: Actualizar autor
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Autor'
 *     responses:
 *       200:
 *         description: Autor actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Autor actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Autor'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function update(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const updatedAutor = await Autor.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAutor) {
            return res.status(404).json({
                state: false,
                error: "Autor no encontrado"
            });
        }
        res.status(200).json({
            state: true,
            message: "Autor actualizado exitosamente",
            data: updatedAutor
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                state: false,
                error: Object.values(error.errors).map((e: any) => e.message).join(', ')
            });
        }
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

/**
 * @swagger
 * /autor/{id}:
 *   delete:
 *     summary: Eliminar autor (soft delete)
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del autor
 *     responses:
 *       200:
 *         description: Autor eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Autor eliminado exitosamente"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function deleteAutor(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Soft delete - marcar como inactivo
        const result = await Autor.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                state: false,
                error: "Autor no encontrado"
            });
        }

        res.status(200).json({
            state: true,
            message: "Autor eliminado exitosamente"
        });
    } catch (error: any) {
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

export {
    findAll,
    findById,
    save,
    update,
    deleteAutor
}