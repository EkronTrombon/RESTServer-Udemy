const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: { message: 'El usuario/contraseña no es correcto' }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: { message: 'El usuario/contraseña no es correcto' }
            });
        }
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;