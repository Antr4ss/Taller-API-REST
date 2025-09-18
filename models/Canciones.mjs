import mongoose from "mongoose";

const { Schema } = mongoose;

const cancionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: false
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'autor',
        required: true
    }
});

export default mongoose.model('cancion', cancionSchema, 'canciones');