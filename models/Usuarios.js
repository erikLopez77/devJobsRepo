const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: 'Agrega tu nombre'
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date
});

//metodo para hashear password
usuariosSchema.pre('save', async function (next) {
    //si el password ya esta hasheado
    if (!this.isModified('password')) {
        return next();
    }
    //si no esta hasheado
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});
usuariosSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        //los strings o errores dentro del next se pasan al catch en forma de error(try-catch)
        next('Ese correo ya se ha registrado');
    } else {
        next('error');
    }
})
//autenticar usuarios
usuariosSchema.methods = {
    compararPassword: function (password) {
        return bcrypt.compareSync(password, this.password)
    }
}
module.exports = mongoose.model('Usuarios', usuariosSchema)