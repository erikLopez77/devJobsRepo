const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const router = require('./routes/index')();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo'); //(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env' });

const app = express();

//habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//habilitar handlebars como view
app.engine('handlebars', engine({
    defaultLayout: 'layout',
    helpers: require('./helpers/handlebars')
}));
app.set('view engine', 'handlebars');

//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    }),
    cookie: {
        secure: false, // Si estás en HTTPS, cambia a true
        maxAge: 1000 * 60 * 60 * 24, // 1 día de duración
    },
}));
//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//alertas y flash messages
app.use(flash());

//crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router);

app.listen(process.env.PUERTO);