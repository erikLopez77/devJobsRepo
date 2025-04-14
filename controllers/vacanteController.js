const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    });
}

//agregar las vacantes a lsa db
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);

    //array de skills
    vacante.skills = req.body.skills.split(',');

    //almacenar en db
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacante/${nuevaVacante.url}`);
}
//muestra una vacante
exports.mostrarVacante = async (req, res) => {
    const vacante = await Vacante.findOne({ url: req.params });

    //si no hay resultados
    if (!vacante) return next();

    return res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}