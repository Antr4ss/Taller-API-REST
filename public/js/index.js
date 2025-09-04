import express from 'express'
import 'dotenv/config'
import path from 'node:path';

const app = new express()

const PORT = process.env.PUERTO || 4500

app.set('PORT_NEW', process.env.PUERTO || 6972)

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./index.html')) // Asegúrate de que el archivo esté en la carpeta 'public'
})

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'))

app.listen(app.get('PORT_NEW'), () => console.log(`Server is running on port ${app.get('PORT_NEW')}`))