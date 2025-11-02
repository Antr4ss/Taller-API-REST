// ...existing code...
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

interface IUsuario {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UsuarioDoc extends mongoose.Document, IUsuario {
    comparePassword(candidatePassword: string): Promise<boolean>;
    toJSON(): Record<string, any>;
}

const usuarioSchema = new Schema<UsuarioDoc>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware para encriptar password antes de guardar
usuarioSchema.pre('save', async function(this: UsuarioDoc, next: (err?: any) => void) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Método para comparar passwords
usuarioSchema.methods.comparePassword = async function(this: UsuarioDoc, candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del usuario
usuarioSchema.methods.toJSON = function(this: UsuarioDoc) {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export default mongoose.model<UsuarioDoc>('Usuario', usuarioSchema);
