const { host, port, pass, user } = require('../config/email');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');

let transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }, debug: true, // Habilita logging
    logger: true
});

// utilizar templates de handlebars
transport.use('compile', hbs({
    viewEngine: {
        extname: '.handlebars',
        defaultLayout: false,
        handlebars: handlebars,
    },
    viewPath: __dirname + '/../views/emails',
    extName: '.handlebars'
}));

exports.enviar = async (opciones) => {

    const opcionesEmail = {
        from: 'devJobs <noreply@devjobs.com',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl
        }
    }
    try {
        await transport.sendMail(opcionesEmail);
    } catch (error) {
        console.log("Error al enviar el correo:", error);
        throw error; // Propaga el error para manejarlo en el controlador
    }

    /* const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, opcionesEmail) */
}