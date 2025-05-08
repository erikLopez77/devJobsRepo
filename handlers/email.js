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
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

// utilizar templates de handlebars
transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath:__dirname+'/../views/emails',
    extName:'.handlebars'
}));
exports.enviar = async (opciones) =>{

   const opcionesEmail= {
        from: 'devJobs <noreply@devjobs.com',
        to:opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context:{
            resetUrl: opciones.resetUrl
        }
    }

    const sendMail=util.promisify(transport.sendMail,transport);
    return sendMail.call(transport,opcionesEmail)
}