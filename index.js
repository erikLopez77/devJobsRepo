const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const router = require('./routes/index')();
const cookieParser = require('cookie-parser');
const session = require('express');
const MongoStore = require('connect-mongo'); //(session);

require('dotenv').config({ path: 'variables.env' });

const app = express();

//habilitar handlebars como view
app.engine('handlebars', engine({
    defaultLayout: 'layout'
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
    })
}));

app.use('/', router);

app.listen(process.env.PUERTO);