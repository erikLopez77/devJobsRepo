const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}
exports.validarRegistro = async (req, res, next) => {
    //validar + sanitizar
    await check('nombre').notEmpty().escape().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().escape().withMessage('El email debe ser válido').run(req);
    await check('password').notEmpty().escape().withMessage('El password no puede ir vacio').run(req);
    await check('confirmar').notEmpty().escape().withMessage('Confirmar password no puede ir vacio').run(req);
    await check('confirmar').equals(req.body.password).escape().withMessage('El password no debe de ser diferente').run(req);

    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        // Extraer SOLO los mensajes de error
        const mensajesError = errores.array().map(error => error.msg);

        // Guardar cada mensaje individualmente en flash
        mensajesError.forEach(mensaje => {
            req.flash('error', mensaje);
        });
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        });
        return;
    }
    next();
}
exports.crearUsuario = async (req, res, next) => {
    //crear usuario
    const usuario = new Usuarios(req.body);
    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error)
        res.redirect('/crear-cuenta');
    }
}
//formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesión en devJobs'
    });
}
