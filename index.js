const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.send('funciona')
});

app.listen(5000);