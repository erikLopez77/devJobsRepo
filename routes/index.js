const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeControllers')
module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);


    return router;

}