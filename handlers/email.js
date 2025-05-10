const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const { dirname } = require('path');
let hbs; //se configura asi por que las versiones recientes no sosportan CommonJs
import('nodemailer-express-handlebars').then(module => {
    hbs = module.default;
}).catch(err => {
    console.error('Error al cargar nodemailer-express-handlebars:', err);
    process.exit(1);
});
const util = require('util');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

// utilizar templates de handlebars
transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: __dirname + '/../views/emails',
    extName: '.handlebars'
}));
// Configuración asíncrona
let emailSender;
(async () => {
    try {
        const { default: hbs } = await import('nodemailer-express-handlebars');

        transport.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                partialsDir: path.join(__dirname, '../views/emails/partials'),
                defaultLayout: false,
            },
            viewPath: path.join(__dirname, '../views/emails'),
            extName: '.handlebars',
        }));

        emailSender = {
            enviar: async (opciones) => {
                const opcionesEmail = {
                    from: 'devJobs <noreply@devjobs.com>',
                    to: opciones.usuario.email,
                    subject: opciones.subject,
                    template: opciones.archivo,
                    context: {
                        resetUrl: opciones.resetUrl
                    }
                };
                const sendMail = util.promisify(transport.sendMail.bind(transport));
                return sendMail(opcionesEmail);
            }
        };
    } catch (error) {
        console.error('Error al configurar email:', error);
        process.exit(1);
    }
})();

// Exportamos un getter para asegurar la inicialización
exports. = {
    getEmailSender: () => {
        if (!emailSender) {
            throw new Error('El módulo de email no se ha inicializado aún');
        }
        return emailSender;
    }
};
exports.enviarEmail = async (opciones) => {

    const opcionesEmail = {
        from: 'devJobs <noreply@devjobs.com',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl
        }
    }

    //const sendMail=util.promisify(transport.sendMail,transport);
    //return sendMail.call(transport,opcionesEmail)
    const sendMail = util.promisify(transport.sendMail.bind(transport));
    return sendMail(opcionesEmail);
}