import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { Request, Response, NextFunction } from 'express';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
}


// Middleware para verificar JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            state: false, 
            error: 'Token de acceso requerido' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                state: false, 
                error: 'Token inválido o expirado' 
            });
        }
            req.user = decoded as JwtPayload & { id: string };
        next();
    });
};

// Función para generar JWT
export const generateToken = (user: any) => {
    return jwt.sign(
        { 
            id: user.id, 
            name: user.name,
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Función para verificar token (sin middleware)
export const verifyToken = (token: any) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};