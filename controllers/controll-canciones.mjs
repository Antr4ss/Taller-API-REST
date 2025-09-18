import Cancion from "../models/Canciones.mjs";
import Autor from "../models/Autor.mjs";

async function findAll(req, res) {
    try {
        const result = await Cancion.find().populate('autor', 'name');
        return res.status(200).json({ "state": true, "data": result });
    } catch (error) {
        return res.status(501).json({ "state": false, "error": error });
    }
}

async function save(req, res) {
    try {
        const { name, album, autor } = req.body;
        const nuevaCancion = new Cancion({ name, album, autor });
        const result = await nuevaCancion.save();

        // Agregar la canción al arreglo 'canciones' del autor
        await Autor.findByIdAndUpdate(
            autor,
            { $push: { canciones: result._id } }
        );

        res.status(201).json({ "state": true, "data": result });
    } catch (error) {
        res.status(501).json({ "state": false, "error": error.message });
    }
}

async function findByAutor(req, res) {
    const { autorId } = req.params;
    try {
        const canciones = await Cancion.find({ autor: autorId }).populate('autor', 'name');
        return res.status(200).json({ "state": true, "data": canciones });
    } catch (error) {
        return res.status(501).json({ "state": false, "error": error.message });
    }
}

//To do implement the update function for the songs
async function update(req, res) {



}

async function deleteSong(req, res) {
    try {
        const { id } = req.params;
        // Busca la canción antes de eliminarla para obtener el autor
        const cancion = await Cancion.findById(id);
        if (!cancion) {
            return res.status(404).json({ "state": false, "error": "Canción no encontrada" });
        }

        // Elimina la canción
        const result = await Cancion.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ "state": false, "error": "Canción no encontrada" });
        }

        // Quita la referencia en el autor
        await Autor.findByIdAndUpdate(
            cancion.autor,
            { $pull: { canciones: cancion._id } }
        );

        return res.status(200).json({ "state": true, "data": "Canción eliminada" });
    } catch (error) {
        return res.status(501).json({ "state": false, "error": error.message });
    }
}

export { 
    save,
    findAll,
    findByAutor,
    update,
    deleteSong
};