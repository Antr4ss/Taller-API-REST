import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const objetosPath = path.join(__dirname, "../data/objetos.json");
const departamentosPath = path.join(__dirname, "../data/departments.json");
const municipiosPath = path.join(__dirname, "../data/towns.json");


function leerJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function guardarJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  const objetos = leerJSON(objetosPath);
  res.render("objetos/list", { objetos });
});


router.get("/nuevo", (req, res) => {
  const departamentos = leerJSON(departamentosPath);
  const municipios = leerJSON(municipiosPath);
  res.render("objetos/form", { departamentos, municipios });
});


router.post("/nuevo", (req, res) => {
  const { fecha, departamento, municipio } = req.body;
  const objetos = leerJSON(objetosPath);

  const nuevo = {
    id: objetos.length + 1,
    fecha,
    departamento,
    municipio,
  };

  objetos.push(nuevo);
  guardarJSON(objetosPath, objetos);

  res.redirect("/objetos");
});


router.post("/eliminar/:id", (req, res) => {
  let objetos = leerJSON(objetosPath);
  const id = parseInt(req.params.id, 10);

  objetos = objetos.filter(o => o.id !== id);
  guardarJSON(objetosPath, objetos);

  res.redirect("/objetos");
});


router.get("/filter", (req, res) => {
  const { departamento } = req.query; 
  let objetos = leerJSON(objetosPath);

  if (departamento) {
    objetos = objetos.filter(o => o.departamento.toLowerCase() === departamento.toLowerCase());
  }

  res.render("objetos/list", { objetos });
});

export default router;
