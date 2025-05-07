const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { check, validationResult } = require('express-validator');

const multer = require('multer');
const shortId = require('shortid');
const { findById } = require('../models/Usuarios');
const { cerrarSesion } = require('./authController');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
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
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor').lean();

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
exports.validarVacante = async (req, res, next) => {
    //sanitizar los campos y validar
    await check('titulo').notEmpty().escape().withMessage('Agrega un titulo a la vacante').run(req);
    await check('empresa').notEmpty().escape().withMessage('Agrega una empresa').run(req);
    await check('ubicacion').notEmpty().escape().withMessage('Agrega una ubicación').run(req);
    await check('salario').escape().run(req);
    await check('contrato').notEmpty().escape().withMessage('Selecciona el tipo de contrato').run(req);
    await check('skills').notEmpty().escape().withMessage('Agrega al menos una habilidad').run(req);

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
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
    next();
}
exports.eliminarVacante = async (req, res) => {
    const { id } = req.params;
    const vacante = await Vacante.findById(id);
    if (verificarAutor(vacante, req.user)) {
        //si es el usuario
        await Vacante.findByIdAndDelete(id);
        res.status(200).send('Vacante eliminada correctamente');
    } else {
        // no permitido
        res.status(403).send('Error')
    }

}
const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) {
        return false;
    }
    return true;
}
//subir archivos en PDF
exports.subirCV = (req, res, next) => {
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
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}

//opciones de multer
const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/cv');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortId.generate()}.${extension}`)
        }
    }), fileFilter(req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            // el cb se ejecuta como true o false, true si se acepta img
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('cv');
//almacenar candidatos en la db
exports.contactar =async (req,res,next) =>{
    const vacante= await Vacante.findOne({url:req.params.url});

    //sino existe la vacante
    if(!vacante) return next();
    console.log(req.file)

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email:req.body.email,
        cv:req.file.filename
    }

    //almacenar la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    req.flash('correcto', 'Se envió tu curriculum correctamente');
    res.redirect('/');
}

exports.mostrarCandidatos = async (req, res)=>{
    const vacante= await Vacante.findById(req.params.id).lean();

    if(vacante.autor != req.user._id.toString()){
        return next();
    }
    if(!vacante) return next();

    res.render('candidatos',{
        nombrePagina: `Candidatos vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    })
}