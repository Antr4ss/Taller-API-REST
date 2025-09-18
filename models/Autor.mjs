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
        required: true
    },
    apodo:{
        type: String,
        required:false
    },
    canciones: [{
        type: Schema.Types.ObjectId,
        ref: 'cancion'
    }]
});

export default mongoose.model('autor', autorSchema)