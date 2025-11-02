import Usuario from '../models/Usuario.mjs';
import { generateToken } from '../middlewares/auth.mjs';
import type { Request, Response } from 'express';


// Registro de usuario
export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        // Validar datos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                state: false,
                error: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                state: false,
                error: 'El usuario ya existe'
            });
        }

        // Crear nuevo usuario
        const usuario = new Usuario({
            name,
            email,
            password
        });

        await usuario.save();

        // Generar token
        const token = generateToken(usuario);

        res.status(201).json({
            state: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: usuario,
                token
            }
        });

    } catch (error: any) {
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

// Login de usuario
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Validar datos requeridos
        if (!email || !password) {
            return res.status(400).json({
                state: false,
                error: 'Email y password son requeridos'
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({
                state: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verificar password
        const isPasswordValid = await usuario.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                state: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.isActive) {
            return res.status(401).json({
                state: false,
                error: 'Usuario desactivado'
            });
        }

        // Generar token
        const token = generateToken(usuario);

        res.status(200).json({
            state: true,
            message: 'Login exitoso',
            data: {
                user: usuario,
                token
            }
        });

    } catch (error: any) {
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

// Obtener perfil del usuario autenticado
export async function getProfile(req: Request, res: Response) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                state: false,
                error: 'No autenticado'
            });
        }

        const usuario = await Usuario.findById(req.user.id);
        if (!usuario) {
            return res.status(404).json({
                state: false,
                error: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            state: true,
            data: usuario
        });

    } catch (error: any) {
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}

// Actualizar perfil del usuario
export async function updateProfile(req: Request, res: Response) {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                state: false,
                error: 'No autenticado'
            });
        }

        const { name, email } = req.body;
        const updates: any = {};

        if (name) updates.name = name;
        if (email) {
            // Verificar si el email ya existe en otro usuario
            const existingUser = await Usuario.findOne({ 
                email, 
                _id: { $ne: req.user.id } 
            });
            if (existingUser) {
                return res.status(400).json({
                    state: false,
                    error: 'El email ya está en uso'
                });
            }
            updates.email = email;
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            state: true,
            message: 'Perfil actualizado exitosamente',
            data: usuario
        });

    } catch (error: any) {
        res.status(500).json({
            state: false,
            error: error.message
        });
    }
}
