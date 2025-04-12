const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeControllers');
const vacantesController = require('../controllers/vacanteController');
module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);
    //crear Vacante
    router.get('/vacantes/nueva',
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva',
        vacantesController.agregarVacante
    );
    return router;

}