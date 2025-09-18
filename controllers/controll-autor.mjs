import Autor from "./../models/Autor.mjs";

async function findAll(req, res) {
    try {
        const result = await Autor.find().populate('canciones', 'name');

        return res.status(200).json({ "state": true, "data": result })
    } catch (error) {
        return res.status(501).json({ "state": false, "error": error })
    }


}

async function findById(req, res) {
    const { id } = req.params;

    try {
        const result = await Autor.findById(id);
        if (!result) {
            return res.status(404).json({ "state": false, "error": "Autor no encontrado" });
        }
        return res.status(200).json({ "state": true, "data": result });
    } catch (error) {
        return res.status(501).json({ "state": false, "error": error })
    }
}

async function save(req, res) {

    try {
        const record = new Autor(req.body);
        const result = await Autor.insertOne(record);

        return res.status(201).json({ "state": true, "data": result })
    } catch (error) {
        return res.status(501).json({ "state": false, "error": error });
    }
}

async function update(req, res) {
    const { idAutor } = req.params;
    try {
        const updatedAutor = await Autor.findByIdAndUpdate(
            idAutor,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedAutor) {
            return res.status(404).json({ "state": false, "error": "Autor no encontrado" });
        }
        res.status(200).json({ "state": true, "data": updatedAutor });
    } catch (error) {
        res.status(501).json({ "state": false, "error": error });
    }
}

async function deleteAutor(req, res) {
    try {
        const { id } = req.params;
        const result = await Autor.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ "state": false, "error": "Autor no encontrado" });
        }

        res.status(200).json({ "state": true, "data": `Autor con ID ${id} eliminada correctamente` });
    } catch (error) {
        res.status(501).json({ "state": false, "error": error });
    }
}

export {
    findAll,
    findById,
    save,
    update,
    deleteAutor
}