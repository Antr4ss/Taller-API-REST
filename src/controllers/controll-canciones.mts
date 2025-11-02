import Cancion from "../models/Canciones.mjs";
import Autor from "../models/Autor.mjs";
import type { Request, Response } from 'express';

/**
 * @swagger
 * /canciones:
 *   get:
 *     summary: Obtener todas las canciones
 *     tags: [Canciones]
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
 *         description: Buscar por nombre de canción
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *         description: Filtrar por género
 *       - in: query
 *         name: autor
 *         schema:
 *           type: string
 *         description: Filtrar por ID del autor
 *     responses:
 *       200:
 *         description: Lista de canciones obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Cancion'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
async function findAll(req: Request, res: Response) {
    try {
        // Convertir page y limit a número de forma segura
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const genero = req.query.genero as string;
        const autor = req.query.autor as string;

        const skip = (page - 1) * limit;

        let query: any = { isActive: true };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (genero) {
            query.genero = { $regex: genero, $options: 'i' };
        }

        if (autor) {
            query.autor = autor;
        }

        const [canciones, total] = await Promise.all([
            Cancion.find(query)
                .populate('autor', 'name apodo nacionalidad')
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            Cancion.countDocuments(query)
        ]);

        return res.status(200).json({
            state: true,
            data: canciones,
            pagination: {
                page,
                limit,
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
 * /canciones:
 *   post:
 *     summary: Crear nueva canción
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cancion'
 *     responses:
 *       201:
 *         description: Canción creada exitosamente
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
 *                   example: "Canción creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Cancion'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
async function save(req: Request, res: Response) {
    try {
        const nuevaCancion = new Cancion(req.body);
        const result = await nuevaCancion.save();

        res.status(201).json({
            state: true,
            message: "Canción creada exitosamente",
            data: result
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
 * /canciones/{id}:
 *   get:
 *     summary: Obtener canción por ID
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *     responses:
 *       200:
 *         description: Canción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 state:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cancion'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const cancion = await Cancion.findById(id).populate('autor', 'name apodo nacionalidad');
        if (!cancion) {
            return res.status(404).json({
                state: false,
                error: "Canción no encontrada"
            });
        }
        return res.status(200).json({
            state: true,
            data: cancion
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
 * /canciones/autor/{autorId}:
 *   get:
 *     summary: Obtener canciones por autor
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: autorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del autor
 *     responses:
 *       200:
 *         description: Canciones del autor obtenidas exitosamente
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
 *                     $ref: '#/components/schemas/Cancion'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function findByAutor(req: Request, res: Response) {
    const { autorId } = req.params;
    try {
        // Verificar que el autor existe
        const autor = await Autor.findById(autorId);
        if (!autor) {
            return res.status(404).json({
                state: false,
                error: "Autor no encontrado"
            });
        }

        const canciones = await Cancion.find({ 
            autor: autorId, 
            isActive: true 
        }).populate('autor', 'name apodo nacionalidad');
        
        return res.status(200).json({
            state: true,
            data: canciones
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
 * /canciones/{id}:
 *   put:
 *     summary: Actualizar canción
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cancion'
 *     responses:
 *       200:
 *         description: Canción actualizada exitosamente
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
 *                   example: "Canción actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Cancion'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function update(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const updatedCancion = await Cancion.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('autor', 'name apodo nacionalidad');
        
        if (!updatedCancion) {
            return res.status(404).json({
                state: false,
                error: "Canción no encontrada"
            });
        }
        
        res.status(200).json({
            state: true,
            message: "Canción actualizada exitosamente",
            data: updatedCancion
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
 * /canciones/{id}:
 *   delete:
 *     summary: Eliminar canción (soft delete)
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *     responses:
 *       200:
 *         description: Canción eliminada exitosamente
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
 *                   example: "Canción eliminada exitosamente"
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
async function deleteSong(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Soft delete - marcar como inactivo
        const result = await Cancion.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                state: false,
                error: "Canción no encontrada"
            });
        }

        res.status(200).json({
            state: true,
            message: "Canción eliminada exitosamente"
        });
    } catch (error: any) {
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

export { 
    save,
    findAll,
    findById,
    findByAutor,
    update,
    deleteSong
};