const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { check, validationResult } = require('express-validator');


exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
    });
}

//agregar las vacantes a la db
exports.agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body);
    vacante.autor = req.user._id;
    //array de skillss
    vacante.skills = req.body.skills.split(',');

    //almacenar en db
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}
//muestra una vacante
exports.mostrarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    //si no hay resultados
    if (!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}

exports.formEditarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.editarVacante = async (req, res) => {
    const vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(',');
    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url },
        vacanteActualizada, {
        new: true,//trae el nuevo modelo actualizado en el const
        runValidators: true//tome todo lo que pusimos en el modelo
    });
    res.redirect(`/vacantes/${vacante.url}`);
}
//validar y sanitizar los campos de las nuevas vacantes
exports.validarVacante = async (req, res) => {
    //sanitizar los campos y validar
    await check('titulo').notEmpty().escape().withMessage('Agrega un titulo a la vacante').run(req);
    await check('empresa').notEmpty().escape().withMessage('Agrega una empresa').run(req);
    await check('ubicacion').notEmpty().escape().withMessage('Agrega una ubicación').run(req);
    await check('salario').escape().run(req);
    await check('contrato').notEmpty().escape().withMessage('Selecciona el tipo de contrato').run(req);
    await check('skills').notEmpty().escape().withMessage('Agrega al menos una habilidad').run(req);

    const errores = validationResult(req);
    if (errores) {
        // Extraer SOLO los mensajes de error
        const mensajesError = errores.array().map(error => error.msg);

        // Guardar cada mensaje individualmente en flash
        mensajesError.forEach(mensaje => {
            req.flash('error', mensaje);
        });
        return res.render('nueva-vacante', {
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        });
    }
}
exports.eliminarVacante = async (req, res) => {
    const { id } = req.params;

}