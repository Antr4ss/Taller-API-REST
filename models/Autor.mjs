import mongoose from "mongoose";

const { Schema } = mongoose;

const autorSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'El nombre del autor es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    apodo: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'El apodo no puede exceder 50 caracteres']
    },
    biografia: {
        type: String,
        maxlength: [1000, 'La biografía no puede exceder 1000 caracteres']
    },
    fechaNacimiento: {
        type: Date
    },
    nacionalidad: {
        type: String,
        trim: true,
        maxlength: [50, 'La nacionalidad no puede exceder 50 caracteres']
    },
    canciones: [{
        type: Schema.Types.ObjectId,
        ref: 'cancion'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para optimizar consultas
autorSchema.index({ name: 1 });
autorSchema.index({ apodo: 1 });
autorSchema.index({ isActive: 1 });

// Virtual para contar canciones
autorSchema.virtual('totalCanciones').get(function() {
    return this.canciones ? this.canciones.length : 0;
});

// Middleware para validar que el ID sea único
autorSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingAutor = await this.constructor.findOne({ id: this.id });
        if (existingAutor) {
            const error = new Error('El ID del autor ya existe');
            error.statusCode = 400;
            return next(error);
        }
    }
    next();
});

export default mongoose.model('autor', autorSchema);