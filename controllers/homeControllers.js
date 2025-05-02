const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async (req, res, next) => {
    //lean() convierte a objetos planos los datos de mongo
    const vacantes = await Vacante.find({}).lean();

    if (!vacantes) {
        return next();
    }
    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y publica trabajos para desarrolladores web',
        barra: true,
        boton: true,
        vacantes
    });

}
