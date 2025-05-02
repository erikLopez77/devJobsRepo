const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande, máximo 100Kb');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }

    });
    next();
}
//opciones de multer
const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/perfiles');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`)
        }
    }), fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            // el cb se ejecuta como true o false, true si se acepta img
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('imagen');
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
//form editar perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    });
}
//guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if (req.body.password) {
        usuario.password = req.body.password;
    }

    if (req.file) {
        usuario.imagen = req.file.filename
    }

    await usuario.save();
    req.flash('correcto', 'Cambios guardados correctamente')

    res.redirect('/administracion');
}
//sanitizar y validar el formulario de usuarios
exports.validarPerfil = async (req, res) => {
    //sanitizar y validar
    await check('nombre').notEmpty().escape().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').notEmpty().escape().withMessage('El correo no puede ir vacío').run(req);
    if (req.body.password) {
        await check('password').escape().run(req);
    }
    const errores = validationResult(req);
    if (errores) {
        // Extraer SOLO los mensajes de error
        const mensajesError = errores.array().map(error => error.msg);

        // Guardar cada mensaje individualmente en flash
        mensajesError.forEach(mensaje => {
            req.flash('error', mensaje);
        });
        return res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en devJobs',
            usuario: req.user.toObject(),
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
            mensajes: req.flash()
        });
    }
    next();
}