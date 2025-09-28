import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-para-jwt';

// Middleware para verificar JWT
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            state: false, 
            error: 'Token de acceso requerido' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                state: false, 
                error: 'Token inválido o expirado' 
            });
        }
        req.user = user;
        next();
    });
};

// Función para generar JWT
export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            name: user.name,
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Función para verificar token (sin middleware)
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};