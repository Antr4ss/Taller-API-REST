import mongoose from "mongoose";

const { Schema } = mongoose;

const cancionSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la canción es requerido'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [200, 'El nombre no puede exceder 200 caracteres']
    },
    album: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'El álbum no puede exceder 100 caracteres']
    },
    duracion: {
        type: Number, // Duración en segundos
        min: [1, 'La duración debe ser al menos 1 segundo'],
        max: [3600, 'La duración no puede exceder 1 hora']
    },
    genero: {
        type: String,
        trim: true,
        maxlength: [50, 'El género no puede exceder 50 caracteres']
    },
    año: {
        type: Number,
        min: [1900, 'El año debe ser mayor a 1900'],
        max: [new Date().getFullYear() + 1, 'El año no puede ser futuro']
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'autor',
        required: [true, 'El autor es requerido']
    },
    letra: {
        type: String,
        maxlength: [5000, 'La letra no puede exceder 5000 caracteres']
    },
    urlAudio: {
        type: String,
        trim: true
    },
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
cancionSchema.index({ name: 1 });
cancionSchema.index({ album: 1 });
cancionSchema.index({ autor: 1 });
cancionSchema.index({ genero: 1 });
cancionSchema.index({ año: 1 });
cancionSchema.index({ isActive: 1 });

// Virtual para formatear duración
cancionSchema.virtual('duracionFormateada').get(function() {
    if (!this.duracion) return null;
    const minutos = Math.floor(this.duracion / 60);
    const segundos = this.duracion % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
});

// Middleware para validar que el autor existe
cancionSchema.pre('save', async function(next) {
    if (this.autor) {
        const Autor = mongoose.model('autor');
        const autorExiste = await Autor.findById(this.autor);
        if (!autorExiste) {
            const error = new Error('El autor especificado no existe');
            error.statusCode = 400;
            return next(error);
        }
    }
    next();
});

// Middleware post-save para actualizar el autor
cancionSchema.post('save', async function() {
    if (this.autor) {
        const Autor = mongoose.model('autor');
        await Autor.findByIdAndUpdate(
            this.autor,
            { $addToSet: { canciones: this._id } }
        );
    }
});

// Middleware post-remove para actualizar el autor
cancionSchema.post('findOneAndDelete', async function(doc) {
    if (doc && doc.autor) {
        const Autor = mongoose.model('autor');
        await Autor.findByIdAndUpdate(
            doc.autor,
            { $pull: { canciones: doc._id } }
        );
    }
});

export default mongoose.model('cancion', cancionSchema, 'canciones');