const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const router = require('./routes/index')();

const app = express();

//habilitar handlebars como view
app.engine('handlebars', engine({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

//static files
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router);

app.listen(5000);